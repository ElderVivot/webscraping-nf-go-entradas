import { format, createLogger, transports, Logger } from 'winston'

const NODE_ENV = process.env.NODE_ENV || 'development'
const { timestamp, combine, printf, errors, json } = format

function buildDevLogger (): Logger {
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || JSON.stringify(message)}`
    })

    return createLogger({
        level: 'debug',
        format: combine(
            format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat
        ),
        transports: [new transports.Console()]
    })
}

function buildProdLogger () {
    return createLogger({
        format: combine(timestamp(), errors({ stack: true }), json()),
        // defaultMeta: { service: 'user-service' },
        transports: [new transports.Console()]
    })
}

export const logger = NODE_ENV === 'development' ? buildDevLogger() : buildProdLogger()