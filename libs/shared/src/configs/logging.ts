import winston from "winston";

const { combine, colorize, timestamp, printf, json } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
    return stack
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "warn" : "debug",
    format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        process.env.NODE_ENV === "production" ? json() : colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        /**
        ...(process.env.NODE_ENV === "production"
            ? [
                new winston.transports.File({ filename: "logs/error.log", level: "error" }),
                new winston.transports.File({ filename: "logs/combined.log" })
            ]
            : [])
        **/
    ],
    /**
    exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: "logs/rejections.log" }),
    ]
    **/
});
