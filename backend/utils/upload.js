const multer = require("multer");
const path = require("path");

// Multer config - store file temporarily in `uploads/`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "tmp-upload/"); // Store in tempory directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage });
module.exports = upload;
