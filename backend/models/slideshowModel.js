const mongoose = require('../db/connectMongodb');
const { Schema } = mongoose;

const slideshowSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    image: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Slideshow', slideshowSchema);