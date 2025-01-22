const ProductService = require('../services/ProductService');

const getProducts = (req, res) => {
  const products = ProductService.getProducts();
  res.json(products);
};

const searchProducts = (req, res) => {
  const { name, category } = req.query;
  const products = ProductService.searchProducts(name, category);
  res.json(products);
};

module.exports = { getProducts, searchProducts };