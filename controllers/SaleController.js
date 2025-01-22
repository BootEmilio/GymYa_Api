const SaleService = require('../services/SaleService');

const checkout = (req, res) => {
  const result = SaleService.checkout();
  res.status(result.status).json(result.data);
};

const getSales = (req, res) => {
  const { startDate, endDate } = req.query;
  const sales = SaleService.getSales(startDate, endDate);
  res.json(sales);
};

module.exports = { checkout, getSales };