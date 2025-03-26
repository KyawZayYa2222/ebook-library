const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')

const uploadFields = upload.fields([
    { name: 'image_upload', maxCount: 1 },
    { name: 'book_upload', maxCount: 1 }
])

// Import controllers
const bookController = require('../controllers/bookController');

router.get('/', bookController.index);
router.get('/:id', bookController.show);
router.post('/', authMiddleware.isLogined, uploadFields, bookController.create);
router.post('/:id', authMiddleware.isLogined, uploadFields, bookController.update);
router.delete('/:id', authMiddleware.isLogined, bookController.destroy);


module.exports = router;