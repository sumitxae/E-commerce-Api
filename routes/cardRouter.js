const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, showEditProduct, showProducts, updateProduct } = require('../controllers/productController');

// Show all products
router.get('/products', showProducts);

// Add a new product
router.post('/products/add', addProduct);

// Show edit product form
router.get('/products/edit/:id', showEditProduct);

// Update a product
router.post('/products/edit/:id', updateProduct);

// Delete a product
router.get('/products/delete/:id', deleteProduct);

module.exports = router;
