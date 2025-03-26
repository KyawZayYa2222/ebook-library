const { check, validationResult } = require('express-validator');
const { getFileById, uploadToDrive, updateDriveFile, deleteDriveFile } = require('../utils/uploadToDrive');
const Book = require('../models/bookModel');
const { validateFileTypeAndSize } = require('../utils/fileValidator');

let validateResult;
// book file minetypes 
const validImageMimeTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif', 'image/webp'];
const validBookMimeTypes = ['application/pdf', 'application/epub'];
const validBookSize = 1024 * 1024 * 20;
const imageFolderId = process.env.DRIVE_IMAGE_FOLDER_ID;
const bookFolderId = process.env.DRIVE_BOOK_FOLDER_ID;

// private methods 
const validateImage = (req) => {
    if (!req.files.image_upload && req.body.image_drive_file_id === '') {
        return [{
            field: 'image_drive_file_id',
            msg: 'Please upload an image or provide a drive file ID'
        }]
    }
    return null;
}

const validateBook = (req) => {
    if (!req.files.book_upload && req.body.book_drive_file_id === '') {
        return [{
            field: 'book_drive_file_id',
            msg: 'Please upload a book file or provide a drive file ID'
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
            title: { $regex: search, $options: 'i'}
        } : {}

    // Calculate the total number of documents that match the filter
    const totalDocs = await Book.countDocuments(filter);

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
        const results = await Book.find(filter)
                .skip(skip)
                .limit(limitNumber)
                .populate([
                    { path: 'categories', select: 'name' },
                    { path: 'author', select: 'name' },
                ])
                .lean();

        const categories = results.map(result => ({
            ...result,
            id: result._id.toString(),
            _id: undefined,
        }))
    
        return res.status(200).json({
            msg: 'Book data get successfully',
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

// get book details by id 
const show = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                .populate([
                    { path: 'categories', select: 'name' },
                    { path: 'author', select: 'name' },
                ])
               .lean();

        book.id = book._id.toString();
        delete book._id;

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        return res.status(200).json({
            msg: 'book data get successfully',
            data: book
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            msg: 'Internal server error',
            error: err
        });
    }
}

// create book
const create = [
    check('title', 'Please enter a valid title')
        .notEmpty()
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters long'),
    check('author', 'Please select a valid author')
        .notEmpty(),
    check('categories', 'Please select one or more valid categories')
        .notEmpty(),
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

        validateResult = validateBook(req);
        if(validateResult) {
            return res.status(400).json({ errors: validateResult });
        }

        console.log(req.body)

        // validate upload files 
        // image upload 
        if(req.files.image_upload) {
            // console.log(req.files.book_upload[0])
            // console.log('hello')
            // console.log(req)
            console.log('image upload: ' + req.files.image_upload)
            validateResult = validateFileTypeAndSize(validImageMimeTypes, undefined, req.files.image_upload[0]);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
        }
        // book upload 
        if(req.files.book_upload) {
            validateResult = validateFileTypeAndSize(validBookMimeTypes, validBookSize, req.files.book_upload[0]);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
        }

        let { title, author, image_drive_file_id, book_drive_file_id } = req.body;
        const categories = req.body.categories.split(',');
        let image_url = '';
        let book_download_url = '';
        let book_size = 0;

        // if image file upload, upload to drive 
        if(req.files.image_upload) {
            try {
                const response = await uploadToDrive(req.files.image_upload[0], imageFolderId);

                // set image to drive file url 
                image_url = `https://lh3.googleusercontent.com/d/${response.data.id}`;
                image_drive_file_id = response.data.id;
            } catch (err) {
                return res.status(400).json({ errors: [{
                    field: 'image_upload',
                    msg: 'Error uploading image to Drive',
                    error: err.message
                }] });
            }
        } else {
            image_url = `https://lh3.googleusercontent.com/d/${image_drive_file_id}`;
        }

        // if book file upload, upload to drive 
        if(req.files.book_upload) {
            try {
                const response = await uploadToDrive(req.files.book_upload[0], bookFolderId);

                // set image to drive file url 
                book_download_url = response.data.webContentLink;
                book_size = response.data.size;
                book_drive_file_id = response.data.id;
            } catch (err) {
                return res.status(400).json({ errors: [{
                    field: 'book',
                    msg: 'Error uploading book file to Drive',
                    error: err.message
                }] });
            }
        } else {
            // find drive file by id and get details
            const response = await getFileById(book_drive_file_id);
            book_download_url = response.data.webContentLink;
            book_size = response.data.size;
        }

        // Create new book
        const newBook = new Book({
            title,
            image_url,
            book_download_url,
            author,
            categories,
            image_drive_file_id,
            book_drive_file_id,
            size: book_size
        });

        // Save book to the database
        try {
            await newBook.save();

            return res.status(201).json({
                msg: 'Book created successfully',
                data: newBook
            })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ 
                msg: 'Internal server error',
                error: err
            });
        }
    }
]

// update category
const update = [
    check('title', 'Please enter a valid title')
       .notEmpty()
       .bail()
       .isLength({ min: 3, max: 50 })
       .withMessage('Title must be between 3 and 100 characters long'),
    check('author', 'Please select a valid author')
        .notEmpty(),
    check('categories', 'Please select one or more valid categories')
        .notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // check file upload or include drive file ID 
        validateResult = validateImage(req);
        if(validateResult) {
            return res.status(400).json({ errors: validateResult });
        }
        validateResult = validateBook(req);
        if(validateResult) {
            return res.status(400).json({ errors: validateResult });
        }

        // validate uploaded files 
        // image upload 
        if(req.files.image_upload) {
            console.log('image upload: ' + req.files.image_upload)
            validateResult = validateFileTypeAndSize(validImageMimeTypes, undefined, req.files.image_upload[0]);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
        }
        // book upload 
        if(req.files.book_upload) {
            validateResult = validateFileTypeAndSize(validBookMimeTypes, validBookSize, req.files.book_upload[0]);
            if(validateResult) {
                return res.status(400).json({ errors: validateResult });
            }
        }

        // check collection exist 
        const book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        let { title, author, image_drive_file_id, book_drive_file_id } = req.body;
        const categories = req.body.categories.split(',');
        let image_url = '';
        let book_download_url = '';
        let book_size = 0;


       // if image file upload, upload to drive 
       if(req.files.image_upload) {
        // console.log('uploading image')
            try {
                const response = await updateDriveFile(req.files.image_upload[0], book.image_drive_file_id);
                // console.log(response);
                // set image to drive file url 
                image_url = `https://lh3.googleusercontent.com/d/${response.data.id}`;
                image_drive_file_id = response.data.id;
            } catch (err) {
                // console.log(err);
                return res.status(400).json({ errors: [{
                    field: 'image_upload',
                    msg: 'Error uploading image to Drive',
                    error: err.message
                }] });
            }
        } else {
            // console.log('image drive id')
            if(book.image_drive_file_id && image_drive_file_id != book.image_drive_file_id) {
                // console.log('delete old drive file')
                // delete old drive file 
                await deleteDriveFile(book.image_drive_file_id);
            }
            image_url = `https://lh3.googleusercontent.com/d/${image_drive_file_id}`;
        }

        // if book file upload, upload to drive 
        if(req.files.book_upload) {
            // console.log('uploading book')
            try {
                const response = await updateDriveFile(req.files.book_upload[0], book.book_drive_file_id);

                // set image to drive file url 
                book_download_url = response.data.webContentLink;
                book_size = response.data.size;
                book_drive_file_id = response.data.id;
            } catch (err) {
                return res.status(400).json({ errors: [{
                    field: 'book',
                    msg: 'Error uploading book file to Drive',
                    error: err.message
                }] });
            }
        } else {
            // console.log('book drive id')
            if(book.book_drive_file_id && book_drive_file_id != book.book_drive_file_id) {
                // console.log('delete old drive file')
                // delete old drive file 
                await deleteDriveFile(book.book_drive_file_id);
            }
            // find drive file by id and get details
            const response = await getFileById(book_drive_file_id);
            book_download_url = response.data.webContentLink;
            book_size = response.data.size;
        }


        // Update
        try {
            Object.assign(book, {
                title,
                image_url,
                book_download_url,
                author,
                categories,
                image_drive_file_id,
                book_drive_file_id,
                size: book_size
            });

            const updatedBook = await book.save();
            return res.status(200).json({
                msg: 'Book updated successfully', 
                data: updatedBook
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
        const book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // delete image file from drive 
        if(book.image_drive_file_id && book.image_drive_file_id!== '') {
            await deleteDriveFile(book.image_drive_file_id);
        }

        // delete book file from drive 
        if(book.book_drive_file_id && book.book_drive_file_id!== '') {
            await deleteDriveFile(book.book_drive_file_id);
        }

        // Delete
        await Book.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            msg: 'Book deleted successfully', 
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