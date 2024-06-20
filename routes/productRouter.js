const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, showEditProduct, showProducts, updateProduct } = require('../controllers/productController');
const { isAuthenticated } = require('../middlewares/authoriser');

// Show all products
router.get('/', isAuthenticated, showProducts);

// Add a new product
router.post('/add', isAuthenticated, addProduct);

// Show edit product form
router.get('/edit/:id', isAuthenticated, showEditProduct);

// Update a product
router.post('/edit/:id', isAuthenticated, updateProduct);

// Delete a product
router.get('/delete/:id', isAuthenticated, deleteProduct);

module.exports = router;
