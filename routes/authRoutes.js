const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { createProductCategory, getProductCategoryById, getProductCategories } = require('../controllers/productCategoryController');
const router = express.Router();
const multer = require('multer');

// Configure multer for file upload
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Register Route
router.post('/auth/register', registerUser);

// Login Route
router.post('/auth/login', loginUser);

// Product list
router.get('/products', getProducts);
router.get('product/:id', getProductById);
router.post('/product/create', upload.single('image'), createProduct);

// product category
router.get('/product-category', getProductCategories);
router.get('/product-category/:id', getProductCategoryById);
router.post('/product-category/create', createProductCategory);

module.exports = router;
