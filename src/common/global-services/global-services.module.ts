import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PRISMA_INJECTION_TOKEN } from './prisma/prisma-provider';
import { LoggerService } from './logger/logger.service';
import { JwtService } from './jwt/jwt.service';

@Global()
@Module({
  providers: [
    LoggerService,
    JwtService,
    {
      provide: PRISMA_INJECTION_TOKEN,
      useClass: PrismaService,
    },
  ],
  exports: [LoggerService, PRISMA_INJECTION_TOKEN, JwtService],
})
export class GlobalServicesModule {}
