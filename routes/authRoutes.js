const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { createProductCategory, getProductCategoryById, getProductCategories } = require('../controllers/productCategoryController');
const router = express.Router();
const multer = require('multer');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Register Route
router.post('/auth/register', registerUser);

// Login Route
router.post('/auth/login', loginUser);

// Product list
router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.post('/product/create', upload.single('image'), createProduct);

// product category
router.get('/product-category', getProductCategories);
router.get('/product-category/:id', getProductCategoryById);
router.post('/product-category/create',  upload.single('image'), createProductCategory);

module.exports = router;
