import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Secure() {
  const guards: (Function | CanActivate)[] = [AuthGuard];
  const decorators: (MethodDecorator | ClassDecorator | PropertyDecorator)[] = [
    ApiBearerAuth(),
  ];

  decorators.push(UseGuards(...guards));

  return applyDecorators(...decorators);
}
