import { JwtService as NestJwtService } from '@nestjs/jwt';

export class JwtService extends NestJwtService {
  constructor() {
    super();
  }
}
