class AppError extends Error {
    constructor(message, statusCode, errorCode, details = null) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.isOperational = true;
    }
}

module.exports = AppError;