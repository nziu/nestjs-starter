import { DocumentBuilder } from '@nestjs/swagger';
import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
    cors: process.env.CORS === 'true',
    prefix: process.env.PREFIX || '',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    config: new DocumentBuilder()
      .setTitle('Nestjs')
      .setDescription('The nestjs API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    path: process.env.SWAGGER_PATH || 'swagger',
  },
  security: {
    expiresIn: '1h',
    refreshIn: '7d',
  },
};

export default (): Config => config;
