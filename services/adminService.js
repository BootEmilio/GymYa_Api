const adminRepository = require('../repositories/adminRepository');

// Obtener estadísticas financieras
const getFinancialStats = async () => {
  const ingresosMensuales = await adminRepository.getMonthlyIncome();
  const pagosPendientes = await adminRepository.getPendingPayments();
  const membresiasActivas = await adminRepository.getActiveMemberships();
  const graficaIngresos = await adminRepository.getIncomeGraphData();

  return {
    ingresosMensuales,
    pagosPendientes,
    membresiasActivas,
    graficaIngresos,
  };
};

// Obtener estadísticas de clientes
const getClientStats = async () => {
  const totalClientesActivos = await adminRepository.getActiveClients();
  const clientesNuevosMes = await adminRepository.getNewClientsThisMonth();
  const clientesPorMembresia = await adminRepository.getClientsByMembershipType();

  return {
    totalClientesActivos,
    clientesNuevosMes,
    clientesPorMembresia,
  };
};

// Obtener estadísticas de asistencias
const getAttendanceStats = async () => {
  const asistenciasDiarias = await adminRepository.getDailyAttendance();
  const historialAccesos = await adminRepository.getRecentAccesses();
  const clientesFrecuentes = await adminRepository.getFrequentClients();

  return {
    asistenciasDiarias,
    historialAccesos,
    clientesFrecuentes,
  };
};

// Obtener alertas
const getAlerts = async () => {
  const pagosPorVencer = await adminRepository.getExpiringPayments();
  const membresiasPorExpirar = await adminRepository.getExpiringMemberships();
  const alertasAsistencia = await adminRepository.getAttendanceAlerts();

  return {
    pagosPorVencer,
    membresiasPorExpirar,
    alertasAsistencia,
  };
};

module.exports = {
  getFinancialStats,
  getClientStats,
  getAttendanceStats,
  getAlerts,
};
