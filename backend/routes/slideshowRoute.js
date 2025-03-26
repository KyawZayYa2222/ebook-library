const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')

// Import controllers
const slideshowController = require('../controllers/slideshowController');

router.get('/', slideshowController.index);
// router.get('/:id', slideshowController.show);
router.post('/', authMiddleware.isLogined, upload.single('image_upload'), slideshowController.create);
router.post('/:id', authMiddleware.isLogined, upload.single('image_upload'), slideshowController.update);
router.delete('/:id', authMiddleware.isLogined, slideshowController.destroy);


module.exports = router;