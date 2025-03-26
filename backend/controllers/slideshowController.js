const { check, validationResult } = require('express-validator');
const { uploadToDrive, updateDriveFile, deleteDriveFile } = require('../utils/uploadToDrive');
const Slideshow = require('../models/slideshowModel');
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


// get slideshow data 
const index = async (req, res) => {
    try {
        const results = await Slideshow.find({})
               .lean();

        const slideshows = results.map(result => ({
            id: result._id.toString(),
            _id: undefined,
           ...result
        }))
    
        return res.status(200).json({
            msg: 'slideshow data get successfully',
            data: slideshows
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
}

// get slideshow details by id 
// const show = async (req, res) => {
//     try {
//         const author = await Author.findById(req.params.id)
//                .lean();

//         author.id = author._id.toString();
//         delete author._id;

//         if (!author) {
//             return res.status(404).json({ msg: 'Author not found' });
//         }

//         return res.status(200).json({
//             msg: 'Author data get successfully',
//             data: author
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ 
//             msg: 'Internal server error',
//             error: err
//         });
//     }
// }

// create slideshow
const create = [
    check('title', 'Please enter a valid title')
        .notEmpty()
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('Title must be between 3 and 50 characters long'),
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

        let { title, drive_file_id } = req.body;

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
        const newSlideshow = new Slideshow({
            title,
            image_url,
            drive_file_id,
        });

        // Save book to the database
        await newSlideshow.save();

        return res.status(200).json({
            msg: 'Slideshow created successfully',
            data: newSlideshow
        })
    }
]

// update category
const update = [
    check('title', 'Please enter a valid title')
       .notEmpty()
       .bail()
       .isLength({ min: 3, max: 50 })
       .withMessage('Title must be between 3 and 50 characters long'),
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
        const slideshow = await Slideshow.findById(req.params.id);
        if(!slideshow) {
            return res.status(404).json({ msg: 'Slideshow not found' });
        }

       let { title, drive_file_id } = req.body;

       // if image file upload, upload to drive 
       if(req.file) {
            // check image file or not 
            const validateResult = validateFileTypeAndSize(validMimeTypes, undefined, req.file);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
            
            try {
                const response = await updateDriveFile(req.file, slideshow.drive_file_id);
                
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
            if(slideshow.drive_file_id && drive_file_id != slideshow.drive_file_id) {
                // delete old drive file 
                await deleteDriveFile(slideshow.drive_file_id);
            }
            // set image to drive file url 
            image_url = `https://lh3.googleusercontent.com/d/${drive_file_id}`;
        }

        // Update
        try {
            Object.assign(slideshow, {
                title,
                image_url,
                drive_file_id,
            });

            const updatedSlideshow = await slideshow.save();
            return res.status(200).json({
                msg: 'Slideshow updated successfully', 
                data: updatedSlideshow
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ 
                msg: 'Internal server error',
                error: err
            });
        }

    }];

// delete slideshow 
const destroy = async (req, res) => {
    try {
        const slideshow = await Slideshow.findById(req.params.id);
        if (!slideshow) {
            return res.status(404).json({ msg: 'Slideshow not found' });
        }

        // delete image file from drive 
        if(slideshow.drive_file_id && slideshow.drive_file_id!== '') {
            try {
                await deleteDriveFile(slideshow.drive_file_id);
            } catch (err) {
                console.error(err);
            }
        }

        await Slideshow.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            msg: 'Slideshow deleted successfully'
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
    // show,
    create,
    update,
    destroy
};