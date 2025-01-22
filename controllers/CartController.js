const CartService = require('../services/CartService');

const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const result = CartService.addToCart(productId, quantity);
  res.status(result.status).json(result.data);
};

const getCart = (req, res) => {
  const cart = CartService.getCart();
  res.json(cart);
};

const updateCart = (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const result = CartService.updateCart(productId, quantity);
  res.status(result.status).json(result.data);
};

const removeFromCart = (req, res) => {
  const { productId } = req.params;
  const result = CartService.removeFromCart(productId);
  res.status(result.status).send(result.data);
};

module.exports = { addToCart, getCart, updateCart, removeFromCart };