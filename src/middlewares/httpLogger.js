const { randomUUID } = require("node:crypto");
const pinoHttp = require("pino-http");

const logger = require("../config/logger");

const httpLogger = pinoHttp({
    logger,

    genReqId: (req, res) => {
        const existingRequestId =
            req.headers["x-request-id"];

        const requestId =
            existingRequestId || randomUUID();

        res.setHeader("X-Request-Id", requestId);

        return requestId;
    },

    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) {
            return "error";
        }

        if (res.statusCode >= 400) {
            return "warn";
        }

        return "info";
    },

    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.originalUrl} completed with ${res.statusCode}`;
    },

    customErrorMessage: (req, res) => {
        return `${req.method} ${req.originalUrl} failed with ${res.statusCode}`;
    },

    quietReqLogger: true
});

module.exports = httpLogger;