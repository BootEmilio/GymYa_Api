const ProductRepository = require('../repositories/ProductRepository');

const getProducts = () => ProductRepository.getAllProducts();

const searchProducts = (name, category) => ProductRepository.searchProducts(name, category);

module.exports = { getProducts, searchProducts };