const mongoose = require('../db/connectMongodb');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    image_url: {
        type: String,
        required: true,
    },
    image_drive_file_id: {
        type: String,
        required: false,
    },
    book_download_url: {
        type: String,
        required: true,
    },
    book_drive_file_id: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    categories: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Category' 
    }],
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'Author' 
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Book', bookSchema);