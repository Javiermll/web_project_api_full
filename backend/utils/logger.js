
const fs = require('fs');
const path = require('path');

const requestLogPath = path.join(__dirname, '../request.log');
const errorLogPath = path.join(__dirname, '../error.log');

function logToFile(filePath, data) {
	fs.appendFile(
		filePath,
		JSON.stringify(data) + '\n',
		(err) => {
			if (err) console.error('Error escribiendo log:', err);
		}
	);
}

// Middleware para registrar cada request
function requestLogger(req, res, next) {
	const log = {
		time: new Date().toISOString(),
		method: req.method,
		url: req.originalUrl,
		headers: req.headers,
		body: req.body,
		query: req.query,
		ip: req.ip,
	};
	logToFile(requestLogPath, log);
	next();
}

// Middleware para registrar errores
function errorLogger(err, req, res, next) {
	const log = {
		time: new Date().toISOString(),
		method: req.method,
		url: req.originalUrl,
		error: {
			message: err.message,
			stack: err.stack,
			statusCode: err.statusCode,
			name: err.name,
		},
		body: req.body,
		query: req.query,
		ip: req.ip,
	};
	logToFile(errorLogPath, log);
	next(err);
}

module.exports = {
	requestLogger,
	errorLogger,
};
