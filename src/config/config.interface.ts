import { OpenAPIObject } from '@nestjs/swagger';

export interface Config {
  nest: NestConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
}

export interface NestConfig {
  port: number;
  cors: boolean;
  prefix?: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  config: Omit<OpenAPIObject, 'paths'>;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
}
