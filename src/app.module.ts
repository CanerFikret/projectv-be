import { CommonModule } from '@common/common.module';
import { PRISMA_CONNECTION_NAME, PRISMA_INJECTION_TOKEN } from '@common/global-services/prisma/prisma-provider';
import { CoreModule } from '@core/core.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { PvModule } from './pv/pv.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
     ClsModule.forRoot({
      global: true,
      middleware: { mount: true, generateId: true },
      plugins: [
        new ClsPluginTransactional({
          connectionName: PRISMA_CONNECTION_NAME,
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PRISMA_INJECTION_TOKEN,
          }),
        }),
      ],
    }),
    CommonModule,
    CoreModule,
    PvModule,
  ],

})
export class AppModule {}
