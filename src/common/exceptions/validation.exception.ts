import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(error: string, message: string) {
    super({
      error,
      message,
    });
  }
}
