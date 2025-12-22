import { BaseException } from './base.exception';
import { ErrorType } from './error-type.enum';

export class AuthenticationException extends BaseException {
  constructor(
    error = ErrorType.AuthenticationError,
    message = 'Unauthorizated Access',
    httpStatusCode = 401,
  ) {
    super(error, message, httpStatusCode);
  }
}
