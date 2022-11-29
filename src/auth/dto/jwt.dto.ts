import { Role } from '@prisma/client';

export interface JwtDto {
  sub: number;
  name: string;
  roles: Role[];
  iat: number;
  exp: number;
}

export interface Payload {
  sub: number;
  name: string;
  roles: Role[];
}

export interface Token {
  access_token: string;
  refresh_token: string;
}
