const { createLogger, format, transports } = require('winston');

/**
 * Create a Winston logger.
 * In this example, logs are printed to the console and saved to a file (app.log).
 * The log format includes a timestamp and a custom message format.
 */
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    // Print logs to the console
    new transports.Console(),
    // Save logs to a file named "app.log"
    new transports.File({ filename: 'app.log' })
  ],
});

module.exports = logger;

