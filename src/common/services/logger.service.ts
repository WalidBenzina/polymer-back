import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production'

    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    )

    // Create the logger instance
    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: logFormat,
      defaultMeta: { service: 'polymer-africa-api' },
      transports: [
        // Write logs to console
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        // In production, also write logs to file
        ...(isProduction
          ? [
              new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
              new winston.transports.File({ filename: 'logs/combined.log' }),
            ]
          : []),
      ],
    })
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context })
  }
}
