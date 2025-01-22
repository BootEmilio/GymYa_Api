const CartRepository = require('../repositories/CartRepository');
const SaleRepository = require('../repositories/SaleRepository');

const checkout = () => {
  const cart = CartRepository.getCartDetailed();
  if (cart.length === 0) return { status: 400, data: { message: 'El carrito está vacío' } };
  const total = cart.reduce((sum, item) => sum + item.total, 0);
  const sale = SaleRepository.addSale(cart, total);
  CartRepository.clearCart();
  return { status: 200, data: { message: 'Venta realizada con éxito', sale } };
};

const getSales = (startDate, endDate) => SaleRepository.getSalesByDate(startDate, endDate);

module.exports = { checkout, getSales };
