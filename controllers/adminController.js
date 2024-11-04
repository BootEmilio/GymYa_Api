const adminService = require('../services/adminService');

// Resumen Financiero
const getFinancialStats = async (req, res) => {
  try {
    const stats = await adminService.getFinancialStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas financieras:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Estadísticas de Clientes
const getClientStats = async (req, res) => {
  try {
    const stats = await adminService.getClientStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas de clientes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Estadísticas de Asistencias
const getAttendanceStats = async (req, res) => {
  try {
    const stats = await adminService.getAttendanceStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas de asistencias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Alertas y Notificaciones
const getAlerts = async (req, res) => {
  try {
    const alerts = await adminService.getAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getFinancialStats,
  getClientStats,
  getAttendanceStats,
  getAlerts,
};
