const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, '../logs/access.log');

const loggerMiddleware = (req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)}\n`;

  // Escribir el log en un archivo
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });

  next();
};

module.exports = loggerMiddleware;
