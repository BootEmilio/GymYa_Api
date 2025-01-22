const ProductRepository = require('../repositories/ProductRepository');
const CartRepository = require('../repositories/CartRepository');

const addToCart = (productId, quantity) => {
  const product = ProductRepository.findProductById(productId);
  if (!product) return { status: 404, data: { message: 'Producto no encontrado' } };
  if (product.stock < quantity) return { status: 400, data: { message: 'Stock insuficiente' } };
  CartRepository.addItem(productId, quantity);
  ProductRepository.updateStock(productId, -quantity);
  return { status: 201, data: CartRepository.getCart() };
};

const getCart = () => CartRepository.getCartDetailed();

const updateCart = (productId, quantity) => {
  const cartItem = CartRepository.findItemById(productId);
  if (!cartItem) return { status: 404, data: { message: 'Producto no encontrado en el carrito' } };
  const product = ProductRepository.findProductById(productId);
  const diff = quantity - cartItem.quantity;
  if (diff > 0 && product.stock < diff) return { status: 400, data: { message: 'Stock insuficiente' } };
  ProductRepository.updateStock(productId, -diff);
  CartRepository.updateItem(productId, quantity);
  return { status: 200, data: CartRepository.getCart() };
};

const removeFromCart = (productId) => {
  const cartItem = CartRepository.findItemById(productId);
  if (!cartItem) return { status: 404, data: { message: 'Producto no encontrado en el carrito' } };
  ProductRepository.updateStock(productId, cartItem.quantity);
  CartRepository.removeItem(productId);
  return { status: 204, data: null };
};

module.exports = { addToCart, getCart, updateCart, removeFromCart };