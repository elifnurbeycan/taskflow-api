const ErrorCodes = require("../errors/errorCodes");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorCode =
        err.errorCode || ErrorCodes.INTERNAL_SERVER_ERROR;


    if (statusCode >= 500 && req.log) {
        req.log.error(
            { err },
            "Unhandled application error"
        );
    }

    const errorResponse = {
        code: errorCode,
        message:
            statusCode === 500
                ? "An unexpected error occurred"
                : err.message
    };

    if (err.details) {
        errorResponse.details = err.details;
    }

    res.status(statusCode).json({
        error: errorResponse
    });
};

module.exports = errorHandler;