import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma-client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.getOrThrow('MYSQL_HOST'),
      port: Number(configService.getOrThrow('MYSQL_PORT')),
      user: configService.getOrThrow('MYSQL_USER'),
      database: configService.getOrThrow('MYSQL_DATABASE'),
    });
    super({
      adapter,
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      // Re-throw to prevent app from starting with no database
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('exit', async () => {
      await app.close();
    });
    process.on('beforeExit', async () => {
      await app.close();
    });
    process.on('SIGINT', async () => {
      await app.close();
    });
    process.on('SIGTERM', async () => {
      await app.close();
    });
    process.on('SIGUSR2', async () => {
      await app.close();
    });
  }
}
