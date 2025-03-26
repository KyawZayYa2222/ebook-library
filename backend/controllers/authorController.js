const { check, validationResult } = require('express-validator');
const { uploadToDrive, updateDriveFile, deleteDriveFile } = require('../utils/uploadToDrive');
const Author = require('../models/authorModel');
const { validateFileTypeAndSize } = require('../utils/fileValidator');

let validateResult;
const validMimeTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif', 'image/webp'];
const folderId = process.env.DRIVE_IMAGE_FOLDER_ID;

// private methods 
const validateImage = (req) => {
    if (!req.file && req.body.image_url === '') {
        return [{
            field: 'drive_file_id',
            msg: 'Please upload an image or provide a drive file ID'
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
    const totalDocs = await Author.countDocuments(filter);

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
        const results = await Author.find(filter)
                .skip(skip)
                .limit(limitNumber)
                .lean();

        const authors = results.map(result => ({
            ...result,
            id: result._id.toString(),
            _id: undefined,
        }))
    
        return res.status(200).json({
            msg: 'Author data get successfully',
            data: authors,
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
        const author = await Author.findById(req.params.id)
               .lean();

        author.id = author._id.toString();
        delete author._id;

        if (!author) {
            return res.status(404).json({ msg: 'Author not found' });
        }

        return res.status(200).json({
            msg: 'Author data get successfully',
            data: author
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
        // let drive_file_id = '';

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
        const newAuthor = new Author({
            name,
            image_url,
            drive_file_id,
        });

        // Save book to the database
        await newAuthor.save();

        return res.status(200).json({
            msg: 'Author created successfully',
            data: newAuthor
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
        const author = await Author.findById(req.params.id);
        if(!author) {
            return res.status(404).json({ msg: 'Author not found' });
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
                const response = await updateDriveFile(req.file, author.drive_file_id);
                
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
            if(author.drive_file_id && drive_file_id != author.drive_file_id) {
                // delete old drive file 
                await deleteDriveFile(author.drive_file_id);
            }
            // set image to drive file url 
            image_url = `https://lh3.googleusercontent.com/d/${drive_file_id}`;
        }

        // Update
        try {
            Object.assign(author, {
                name,
                image_url,
                drive_file_id,
            });

            const updatedAuthor = await author.save();
            return res.status(200).json({
                msg: 'Author updated successfully', 
                data: updatedAuthor
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ 
                msg: 'Internal server error',
                error: err
            });
        }

    }];

// delete author 
const destroy = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ msg: 'Author not found' });
        }

        // delete image file from drive 
        if(author.drive_file_id && author.drive_file_id!== '') {
            try {
                await deleteDriveFile(author.drive_file_id);
            } catch (err) {
                console.error(err);
            }
        }

        await Author.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            msg: 'Author deleted successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
};

module.exports = {
    index,
    show,
    create,
    update,
    destroy
};