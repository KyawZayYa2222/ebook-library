const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')

// Import controllers
const authorController = require('../controllers/authorController');

router.get('/', authorController.index);
router.get('/:id', authorController.show);
router.post('/', authMiddleware.isLogined, upload.single('image_upload'), authorController.create);
router.post('/:id', authMiddleware.isLogined, upload.single('image_upload'), authorController.update);
router.delete('/:id', authMiddleware.isLogined, authorController.destroy);


module.exports = router;