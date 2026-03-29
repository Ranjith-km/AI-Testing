/**
 * src/utils/logger.ts
 * Centralized logging utility using Winston
 * Provides structured logging with file and console output
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

const LOG_DIR = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export class Logger {
  private logger: winston.Logger;
  private testName: string = 'general';

  constructor(testName?: string) {
    if (testName) {
      this.testName = testName;
    }

    // Timestamp format: YYYY-MM-DD HH:MM:SS
    const timestampFormat = () => {
      return new Date().toISOString().replace('T', ' ').slice(0, 19);
    };

    // Custom printf format
    const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
      if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
      }
      return log;
    });

    // Create logger instance
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.errors({ stack: true }),
        customFormat
      ),
      defaultMeta: { service: 'joyalukkas-tests', test: this.testName },
      transports: [
        // Console transport (always active)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            customFormat
          )
        }),

        // File transport - all logs
        new winston.transports.File({
          filename: path.join(LOG_DIR, `${this.testName}.log`),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          tailable: true
        }),

        // File transport - errors only
        new winston.transports.File({
          filename: path.join(LOG_DIR, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          tailable: true
        }),

        // File transport - combined all tests
        new winston.transports.File({
          filename: path.join(LOG_DIR, 'combined.log'),
          maxsize: 10485760, // 10MB
          maxFiles: 10,
          tailable: true
        })
      ]
    });
  }

  /**
   * Set test name for this logger instance
   */
  public setTestName(testName: string): void {
    this.testName = testName;
    this.logger = this.logger.child({ test: testName });
  }

  /**
   * Log info level messages
   */
  public info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  /**
   * Log debug level messages
   */
  public debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log warning level messages
   */
  public warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log error level messages with optional error object
   */
  public error(message: string, error?: Error | Record<string, any>): void {
    if (error instanceof Error) {
      this.logger.error(message, { error: error.message, stack: error.stack });
    } else if (error) {
      this.logger.error(message, error);
    } else {
      this.logger.error(message);
    }
  }

  /**
   * Log action performed (navigation, click, fill, etc.)
   */
  public action(actionType: string, target: string, details?: string): void {
    const message = details 
      ? `[ACTION] ${actionType} on ${target}: ${details}`
      : `[ACTION] ${actionType} on ${target}`;
    this.info(message);
  }

  /**
   * Log assertion result
   */
  public assertion(description: string, passed: boolean, actual?: string, expected?: string): void {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    let message = `[ASSERTION] ${status}: ${description}`;
    if (!passed && expected && actual) {
      message += ` | Expected: ${expected} | Actual: ${actual}`;
    }
    passed ? this.info(message) : this.error(message);
  }

  /**
   * Log page load
   */
  public pageLoad(url: string, loadTime?: number): void {
    const message = loadTime 
      ? `[PAGE] Loaded: ${url} (${loadTime}ms)`
      : `[PAGE] Loaded: ${url}`;
    this.info(message);
  }

  /**
   * Log wait operation
   */
  public wait(selector: string, condition: string, timeout?: number): void {
    const message = timeout
      ? `[WAIT] Waiting for ${condition}: ${selector} (${timeout}ms)`
      : `[WAIT] Waiting for ${condition}: ${selector}`;
    this.debug(message);
  }

  /**
   * Log retry attempt
   */
  public retryAttempt(attempt: number, maxAttempts: number, delay: number): void {
    this.info(`[RETRY] Attempt ${attempt}/${maxAttempts}, retrying in ${delay}ms`);
  }

  /**
   * Log screenshot capture
   */
  public screenshot(name: string, filePath?: string): void {
    const message = filePath
      ? `[SCREENSHOT] Captured: ${name} at ${filePath}`
      : `[SCREENSHOT] Capturing: ${name}`;
    this.info(message);
  }

  /**
   * Log API request
   */
  public apiRequest(method: string, url: string, statusCode?: number): void {
    const message = statusCode
      ? `[API] ${method} ${url} - ${statusCode}`
      : `[API] ${method} ${url}`;
    this.info(message);
  }

  /**
   * Log form submission
   */
  public formSubmit(formName: string, data?: Record<string, any>): void {
    const message = data
      ? `[FORM] Submitting ${formName} with data: ${JSON.stringify(data)}`
      : `[FORM] Submitting ${formName}`;
    this.info(message);
  }

  /**
   * Log validation result
   */
  public validation(fieldName: string, isValid: boolean, error?: string): void {
    const status = isValid ? 'VALID' : 'INVALID';
    const message = error
      ? `[VALIDATION] ${fieldName}: ${status} - ${error}`
      : `[VALIDATION] ${fieldName}: ${status}`;
    isValid ? this.info(message) : this.warn(message);
  }

  /**
   * Log performance metrics
   */
  public performance(metricName: string, value: number, unit: string = 'ms'): void {
    this.info(`[PERFORMANCE] ${metricName}: ${value}${unit}`);
  }

  /**
   * Log accessibility issues
   */
  public accessibility(issue: string, selector?: string): void {
    const message = selector
      ? `[ACCESSIBILITY] ${issue} at ${selector}`
      : `[ACCESSIBILITY] ${issue}`;
    this.warn(message);
  }

  /**
   * Create child logger for sub-operations
   */
  public child(meta: Record<string, any>): Logger {
    const childLogger = new Logger(this.testName);
    childLogger.logger = this.logger.child(meta);
    return childLogger;
  }

  /**
   * Flush all logs before closing
   */
  public async flush(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.on('finish', resolve);
      this.logger.end();
    });
  }

  /**
   * Get log file path
   */
  public getLogFilePath(): string {
    return path.join(LOG_DIR, `${this.testName}.log`);
  }

  /**
   * Get all log files directory
   */
  public static getLogsDirectory(): string {
    return LOG_DIR;
  }
}

// Export singleton instance
export const logger = new Logger('default');

export default Logger;
