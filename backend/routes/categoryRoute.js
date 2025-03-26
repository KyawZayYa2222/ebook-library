const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')

// Import controllers
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.index);
router.get('/:id', categoryController.show);
router.post('/', authMiddleware.isLogined, upload.single('image_upload'), categoryController.create);
router.post('/:id', authMiddleware.isLogined, upload.single('image_upload'), categoryController.update);
router.delete('/:id', authMiddleware.isLogined, categoryController.destroy);


module.exports = router;