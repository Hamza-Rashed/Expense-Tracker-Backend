import { ErrorCode, ErrorDetails, AppError } from './errors.types';

export class Errors {
  // Validation errors (400)
  static Validation(field: string, reason: string, details?: ErrorDetails): AppError {
    return this.createError(
      ErrorCode.VALIDATION_ERROR,
      400,
      `Validation failed for field '${field}': ${reason}`,
      { field, reason, ...details }
    );
  }

  static BadRequest(message: string, details?: ErrorDetails): AppError {
    return this.createError(
      ErrorCode.BAD_REQUEST,
      400,
      message,
      details
    );
  }

  // Authentication errors (401)
  static Unauthorized(message = 'Authentication required'): AppError {
    return this.createError(ErrorCode.UNAUTHORIZED, 401, message);
  }

  static InvalidCredentials(message: string): AppError {
    return this.createError(
      ErrorCode.INVALID_CREDENTIALS,
      401,
      message
    );
  }

  static AccountLocked(message = 'Account is temporarily locked due to too many failed login attempts .. Please call your account manager'): AppError {
    return this.createError(
      ErrorCode.ACCOUNT_LOCKED,
      401,
      message
    );
  }

  static TokenExpired(): AppError {
    return this.createError(
      ErrorCode.TOKEN_EXPIRED,
      401,
      'Token has expired'
    );
  }

  static InvalidToken(): AppError {
    return this.createError(
      ErrorCode.INVALID_TOKEN,
      401,
      'Invalid token'
    );
  }

  // Authorization errors (403)
  static Forbidden(message = 'Access forbidden'): AppError {
    return this.createError(ErrorCode.FORBIDDEN, 403, message);
  }

  static InsufficientPermissions(message: string): AppError {
        
    return this.createError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      403,
      message
    );
  }

  // Not found errors (404)
  static NotFound(entity: string, id: string): AppError {
    return this.createError(
      ErrorCode.NOT_FOUND,
      404,
      `${entity} with id ${id} not found`,
      { entity, id }
    );
  }

  static UserNotFound(email: string): AppError {
    return this.createError(
      ErrorCode.USER_NOT_FOUND,
      404,
      `User with email ${email} not found`,
      { email }
    );
  }

  static UserNotActive(email: string): AppError {
    return this.createError(
      ErrorCode.USER_NOT_ACTIVE,
      404,
      `User with email ${email} not active`,
      { email }
    );
  }

  static ResourceNotFound(message): AppError {
    return this.createError(
      ErrorCode.RESOURCE_NOT_FOUND,
      404,
      message
    );
  }

  // Conflict errors (409)
  static Conflict(message: string, details?: ErrorDetails): AppError {
    return this.createError(ErrorCode.CONFLICT, 409, message, details);
  }

  static DuplicateResource(message:string): AppError {
    return this.createError(
      ErrorCode.DUPLICATE_RESOURCE,
      409,
      `${message}`
    );
  }

  // System errors (500)
  static InternalServerError(message = 'Internal server error'): AppError {
    return this.createError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      message
    );
  }

  static ExternalServiceError(service: string, message: string): AppError {
    return this.createError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      500,
      `External service error: ${service} - ${message}`,
      { service }
    );
  }

  // Rate limiting (429)
  static RateLimitExceeded(limit: number, timeframe: string): AppError {
    return this.createError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      429,
      `Rate limit exceeded: ${limit} requests per ${timeframe}`,
      { limit, timeframe }
    );
  }

  private static createError(
    code: ErrorCode,
    statusCode: number,
    message: string,
    details?: ErrorDetails
  ): AppError {
    const error = new Error(message) as AppError;
    error.code = code;
    error.statusCode = statusCode;
    error.details = details;
    error.timestamp = new Date();
    return error;
  }
}