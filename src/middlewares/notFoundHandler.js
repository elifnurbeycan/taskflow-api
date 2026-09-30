const AppError = require("../errors/AppError");
const ErrorCodes = require("../errors/errorCodes");

const notFoundHandler = (req, res, next) => {
    next(
        new AppError(
            `Route not found: ${req.method} ${req.originalUrl}`,
            404,
            ErrorCodes.ROUTE_NOT_FOUND
        )
    );
};

module.exports = notFoundHandler;