import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MeasureTimeInterceptor } from '@common/interceptors/measure-time.interceptor';
import { GeneralExceptionFilter } from '@common/filters/general-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ProjectV API')
    .setDescription('The ProjectV API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('ProjectV')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new MeasureTimeInterceptor());

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
