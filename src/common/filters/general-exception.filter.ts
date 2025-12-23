import { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseException } from '@common/exceptions/base.exception';
import { FailResponse } from '@common/view-models/fail-response.vm';

@Catch(BaseException)
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseModel = new FailResponse();
    responseModel.error = {
      code: exception.code,
      message: exception.message,
    };

    response.status(status).json(responseModel);
  }
}
