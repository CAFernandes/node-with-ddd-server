import { logger } from '@/utils/logger';
import { Logger } from 'log4js';
/* The AppError class is a custom error class that extends the Error class. It has a code and message property, and a saveError
method that logs the error to the console */
export class AppError extends Error {
  public readonly code: number;
  public readonly message: string;
  private error?: Error;
  private logger: Logger;
  /**
   * The constructor function is a special function that is called when an object is created from a class
   * @param [code=400] - The HTTP status code to return.
   * @param {string} message - The message that will be displayed to the user.
   * @param {Error} [error] - The error object that was thrown.
   */
  constructor(code = 400, message: string, error?: Error) {
    super(message);
    this.code = code;
    this.message = message;
    this.error = error;
    this.logger = logger;
  }
  /**
   * If the error is not null, then log the error message and stack trace
   */
  saveError(): void {
    this.logger.level = 'error';
    this.logger.fatal(
      `${this.message} - ${this.error?.message} ${this.error?.stack}`
    );
  }
}
