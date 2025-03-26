const mongoose = require('../db/connectMongodb');
const { Schema } = mongoose;

const authorSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    image_url: {
        type: String,
        required: true,
    },
    drive_file_id: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Author', authorSchema);