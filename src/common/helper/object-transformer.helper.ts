import { Type } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export class ObjectTransformer {
  static transform<T>(
    value: unknown,
    type: Type<T>,
    options?: ClassTransformOptions,
  ): T {
    const instance: T = plainToInstance(type, value, options);
    return instance;
  }
}
