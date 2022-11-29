import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { NestConfig, SwaggerConfig } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // config service
  const configService = app.get(ConfigService);
  const nest = configService.get<NestConfig>('nest');
  const swagger = configService.get<SwaggerConfig>('swagger');

  // cors
  if (nest.cors) app.enableCors();

  // global prefix
  app.setGlobalPrefix(nest.prefix);

  // swagger api
  if (swagger.enabled) {
    const document = SwaggerModule.createDocument(app, swagger.config);
    SwaggerModule.setup(swagger.path, app, document);
  }

  await app.listen(nest.port);
}
bootstrap();
