const pino = require("pino");

const isTest = process.env.NODE_ENV === "test";
const isDevelopment =
    process.env.NODE_ENV !== "production" && !isTest;

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    enabled: !isTest,

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie"
        ],
        censor: "[REDACTED]"
    },

    transport: isDevelopment
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname"
              }
          }
        : undefined
});

module.exports = logger;