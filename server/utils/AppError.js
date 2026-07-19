/**
 * Operational error for expected failure cases (validation, not-found,
 * unauthorized, etc.) as opposed to unexpected programmer errors/bugs.
 * Thrown from services/controllers and caught by a central error-handling
 * middleware, which uses `statusCode` to shape the HTTP response.
 */
class AppError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.details = details;
    // Operational errors are anticipated and safe to expose to the client;
    // this flag lets the error handler distinguish them from bugs, which
    // should be logged/hidden instead.
    this.isOperational = true;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;