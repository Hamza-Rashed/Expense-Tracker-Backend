import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from 'src/errors/errors.types';
import { mapPrismaError } from './prisma-error.mapper';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Prisma errors
    const prismaError = mapPrismaError(exception);
    if (prismaError) {
      return this.sendError(response, prismaError);
    }

    // Custom AppError
    if ((exception as AppError)?.code) {
      return this.sendError(response, exception as AppError);
    }

    // Nest HttpException
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
      });
    }

    // Fallback (500)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error occurred',
    });
  }

  private sendError(res: Response, error: AppError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
    });
  }
}
