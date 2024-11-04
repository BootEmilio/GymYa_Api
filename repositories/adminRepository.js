const db = require('../db');

// Consultas financieras
const getMonthlyIncome = async () => {
  const result = await db.query(`
    SELECT SUM(monto) AS total 
    FROM pagos 
    WHERE estado = 'Completado' AND EXTRACT(MONTH FROM fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE)
  `);
  return result.rows[0].total || 0;
};

const getPendingPayments = async () => {
  const result = await db.query(`
    SELECT * 
    FROM pagos 
    WHERE estado = 'Pendiente'
  `);
  return result.rows;
};

const getActiveMemberships = async () => {
    const result = await db.query('SELECT * FROM clientes');
    return result.rows;
  };
  

const getIncomeGraphData = async () => {
  const result = await db.query(`
    SELECT TO_CHAR(fecha_pago, 'YYYY-MM') AS mes, SUM(monto) AS total 
    FROM pagos 
    WHERE estado = 'Completado' AND fecha_pago >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY mes
    ORDER BY mes
  `);
  return result.rows;
};

// Consultas de estadísticas de clientes
const getActiveClients = async () => {
  const result = await db.query(`
    SELECT COUNT(*) AS total 
    FROM usuarios 
    WHERE activo = TRUE
  `);
  return result.rows[0].total || 0;
};

const getNewClientsThisMonth = async () => {
  const result = await db.query(`
    SELECT COUNT(*) AS total 
    FROM usuarios 
    WHERE EXTRACT(MONTH FROM fecha_registro) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha_registro) = EXTRACT(YEAR FROM CURRENT_DATE)
  `);
  return result.rows[0].total || 0;
};

const getClientsByMembershipType = async () => {
  const result = await db.query(`
    SELECT m.nombre AS tipo_membresia, COUNT(hm.id_cliente) AS cantidad
    FROM historial_membresias hm
    JOIN membresias m ON hm.id_membresia = m.id
    WHERE hm.estado = 'Activa'
    GROUP BY m.nombre
  `);
  return result.rows;
};

// Consultas de estadísticas de asistencias
const getDailyAttendance = async () => {
  const result = await db.query(`
    SELECT COUNT(*) AS total 
    FROM asistencias 
    WHERE DATE(fecha_entrada) = CURRENT_DATE
  `);
  return result.rows[0].total || 0;
};

const getRecentAccesses = async () => {
  const result = await db.query(`
    SELECT u.nombre_completo, a.fecha_hora_acceso, a.tipo_acceso 
    FROM accesos_usuarios a
    JOIN usuarios u ON a.id_cliente = u.id
    ORDER BY a.fecha_hora_acceso DESC
    LIMIT 10
  `);
  return result.rows;
};

const getFrequentClients = async () => {
  const result = await db.query(`
    SELECT u.nombre_completo, COUNT(a.id) AS asistencias 
    FROM asistencias a
    JOIN usuarios u ON a.id_cliente = u.id
    WHERE EXTRACT(MONTH FROM a.fecha_entrada) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY u.id, u.nombre_completo
    ORDER BY asistencias DESC
    LIMIT 5
  `);
  return result.rows;
};

// Consultas para alertas
const getExpiringPayments = async () => {
  const result = await db.query(`
    SELECT u.nombre_completo, p.fecha_pago, m.nombre AS tipo_membresia
    FROM pagos p
    JOIN usuarios u ON p.id_cliente = u.id
    JOIN membresias m ON p.id_membresia = m.id
    WHERE p.estado = 'Pendiente' AND p.fecha_pago <= CURRENT_DATE + INTERVAL '7 days'
  `);
  return result.rows;
};

const getExpiringMemberships = async () => {
  const result = await db.query(`
    SELECT u.nombre_completo, hm.fecha_fin, m.nombre AS tipo_membresia
    FROM historial_membresias hm
    JOIN usuarios u ON hm.id_cliente = u.id
    JOIN membresias m ON hm.id_membresia = m.id
    WHERE hm.estado = 'Activa' AND hm.fecha_fin <= CURRENT_DATE + INTERVAL '7 days'
  `);
  return result.rows;
};

const getAttendanceAlerts = async () => {
  const result = await db.query(`
    SELECT u.nombre_completo, COUNT(a.id) AS asistencias
    FROM asistencias a
    JOIN usuarios u ON a.id_cliente = u.id
    WHERE EXTRACT(MONTH FROM a.fecha_entrada) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY u.id, u.nombre_completo
    HAVING COUNT(a.id) > 20  -- Puedes ajustar este límite de visitas según sea necesario
    ORDER BY asistencias DESC
  `);
  return result.rows;
};

module.exports = {
  getMonthlyIncome,
  getPendingPayments,
  getActiveMemberships,
  getIncomeGraphData,
  getActiveClients,
  getNewClientsThisMonth,
  getClientsByMembershipType,
  getDailyAttendance,
  getRecentAccesses,
  getFrequentClients,
  getExpiringPayments,
  getExpiringMemberships,
  getAttendanceAlerts,
};
