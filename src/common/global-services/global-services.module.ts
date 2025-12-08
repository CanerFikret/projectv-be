import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PRISMA_INJECTION_TOKEN } from "./prisma/prisma-provider";

@Global()
@Module({
  providers: [{
      provide: PRISMA_INJECTION_TOKEN,
      useClass: PrismaService,
    },],
  exports: [PRISMA_INJECTION_TOKEN,]
})
export class GlobalServicesModule {}