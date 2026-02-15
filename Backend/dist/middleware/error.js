"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';
    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
