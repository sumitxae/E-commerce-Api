const { catchAsyncError } = require('../middlewares/catchAsyncErrors');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');

// Show all products
exports.showProducts = catchAsyncError( async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// Add a new product
exports.addProduct = catchAsyncError(async (req, res) => {
  const { productName, price, productInfo, productImage } = req.body;
  const newProduct = new Product({
    productName,
    price,
    productInfo,
    productImage
  });

    await newProduct.save();
    res.redirect('/products');
})

// Show edit product form
exports.showEditProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

    const product = await Product.findById(id);
    if (product) {
        res.send(product);
    } else {
        return next(new ErrorHandler('Product not found', 404));
    }
    return next(new ErrorHandler('Internal Server error', 500));
})

// Update a product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { productName, price, productInfo, productImage } = req.body;

    const product = await Product.findByIdAndUpdate(id, { productName, price, productInfo, productImage }, { new: true });
    if (product) {
      res.redirect('/products');
    } else {
      return next(new ErrorHandler('Product not found', 404));
    }
    return next(new ErrorHandler('Internal Server error', 500));
});

// Delete a product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.redirect('/products');
    } else {
       return next(new ErrorHandler('Product not found', 404));
    }
    return next(new ErrorHandler('Internal Server error', 500));
})
