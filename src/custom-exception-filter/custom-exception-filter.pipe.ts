import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(Error)
export class CustomExceptionFilter extends BaseExceptionFilter {
  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = 400;
    let errMessage: any = err;

    if (err instanceof QueryFailedError) {
      errMessage = { message: err.message };
    }
    if (err instanceof BadRequestException) {
      status = err.getStatus();
    }
    if (err instanceof HttpException) {
      status = err.getStatus();
    }
    if (err instanceof EntityNotFoundError) {
      status = 404;
    }
    if (err.name === 'JsonWebTokenError') {
      status = 401;
      err.message = 'Unauthorized Error'
    }

    response.code(status).send({
      ok: false,
      status,
      ...errMessage,
    });
  }
}
