const { check, validationResult } = require('express-validator');
const { uploadToDrive, updateDriveFile, deleteDriveFile } = require('../utils/uploadToDrive');
const Category = require('../models/categoryModel');
// const { drive } = require('googleapis/build/src/apis/drive');
const { validateFileTypeAndSize } = require('../utils/fileValidator');

let validateResult;
const validMimeTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif', 'image/webp'];
const folderId = process.env.DRIVE_IMAGE_FOLDER_ID;

// private methods 
const validateImage = (req) => {
    if (!req.file && req.body.image_url === '') {
        return [{
            field: 'drive_file_id',
            msg: 'Please upload an image or provide an image URL'
        }]
    }
    return null;
}


// get category data 
const index = async (req, res) => {
    let { search='', page=1, per_page=8 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(per_page, 10);

    const filter = search
        ? query = {
            name: { $regex: search, $options: 'i'}
        } : {}

    // Calculate the total number of documents that match the filter
    const totalDocs = await Category.countDocuments(filter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalDocs / limitNumber);

    // Ensure the requested page is within the valid range
    const currentPage = Math.min(Math.max(pageNumber, 1), totalPages);

    // Calculate the number of documents to skip
    const skip = Math.max(((currentPage - 1) * limitNumber), 0);

    // get pagination infos 
    const pagination = {
        first: currentPage === 1? 1 : Math.max((currentPage - 1), 0),
        items: limitNumber,
        last: currentPage === totalPages? totalPages : currentPage + 1,
        next: currentPage < totalPages? currentPage + 1 : null,
        pages: totalPages,
        prev: currentPage > 1? currentPage - 1 : null
    };

    // get data from db 
    try {
        const results = await Category.find(filter)
                .skip(skip)
                .limit(limitNumber)
                .lean();

        const categories = results.map(result => ({
            ...result,
            id: result._id.toString(),
            _id: undefined,
        }))
    
        return res.status(200).json({
            msg: 'category data get successfully',
            data: categories,
            pagination
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
}

// get category details by id 
const show = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
               .lean();

        category.id = category._id.toString();
        delete category._id;

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        return res.status(200).json({
            msg: 'category data get successfully',
            data: category
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
}

// create category
const create = [
    check('name', 'Please enter a valid name')
        .notEmpty()
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // check file upload or include url 
        validateResult = validateImage(req);
        if(validateResult) {
            return res.status(400).json({ errors: validateResult });
        }

        console.log(req.body)

        let { name, drive_file_id } = req.body;

        // if image file upload, upload to drive 
        if(req.file) {
            // validate file type and size
            validateResult = validateFileTypeAndSize(validMimeTypes, undefined, req.file);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
            
            try {
                const response = await uploadToDrive(req.file, folderId);

                // set image to drive file url 
                image_url = `https://lh3.googleusercontent.com/d/${response.data.id}`;
                drive_file_id = response.data.id;
            } catch (err) {
                return res.status(400).json({ errors: [{
                    field: 'image',
                    msg: 'Error uploading image to Drive',
                    error: err.message
                }] });
            }
        } else {
            image_url = `https://lh3.googleusercontent.com/d/${drive_file_id}`;
        }

        // Create new book
        const newCategory = new Category({
            name,
            image_url,
            drive_file_id,
        });

        // Save book to the database
        await newCategory.save();

        return res.status(200).json({
            msg: 'Category created successfully',
            data: newCategory
        })
    }
]

// update category
const update = [
    check('name', 'Please enter a valid name')
       .notEmpty()
       .bail()
       .isLength({ min: 3, max: 50 })
       .withMessage('Name must be between 3 and 50 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // check file upload or include url 
        const validateResult = validateImage(req);
        if(validateResult) {
            return res.status(400).json({ errors: validateResult });
        }

        // check collection exist 
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

       let { name, drive_file_id } = req.body;

       // if image file upload, upload to drive 
       if(req.file) {
            // check image file or not 
            const validateResult = validateFileTypeAndSize(validMimeTypes, undefined, req.file);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
            
            try {
                const response = await updateDriveFile(req.file, category.drive_file_id);

                // set image to drive file url 
                image_url = `https://lh3.googleusercontent.com/d/${response.data.id}`;
                drive_file_id = response.data.id;
            } catch (err) {
                return res.status(400).json({ errors: [{
                    field: 'image',
                    msg: 'Error updating image to Drive',
                    error: err.message
                }] });
            }
        } else {
            if(category.drive_file_id && drive_file_id != category.drive_file_id) {
                // delete old drive file 
                await deleteDriveFile(category.drive_file_id);
            }
            // set image to drive file url 
            image_url = `https://lh3.googleusercontent.com/d/${drive_file_id}`;
        }

        // Update
        try {
            Object.assign(category, {
                name,
                image_url,
                drive_file_id
            });

            const updatedCategory = await category.save();
            return res.status(200).json({
                msg: 'Category updated successfully', 
                data: updatedCategory
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ 
                msg: 'Internal server error',
                error: err
            });
        }

    }];


// Delete 
const destroy = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // delete image file from drive 
        if(category.drive_file_id && category.drive_file_id!== '') {
            await deleteDriveFile(category.drive_file_id);
        }

        // Delete
        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            msg: 'Category deleted successfully', 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
}


module.exports = {
    index,
    show,
    create,
    update,
    destroy
};