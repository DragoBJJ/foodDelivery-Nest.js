import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { PostgresError } from 'pg-error-enum';
import { Response } from 'express';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Database Error';

    if (exception instanceof QueryFailedError) {
      if (exception.driverError?.code === PostgresError.UNIQUE_VIOLATION) {
        message = 'Duplicate entry';
        statusCode = HttpStatus.CONFLICT;
      }
    }
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
