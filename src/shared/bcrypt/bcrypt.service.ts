import { Inject, Injectable, Optional } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SERVICE_OPTIONS } from './bcrypt.constants';

@Injectable()
export class BcryptService {
  constructor(
    @Optional()
    @Inject(BCRYPT_SERVICE_OPTIONS)
    private readonly saltOrRounds: number | string = 10,
  ) {}

  async compare(rawStr: string, hashedStr: string): Promise<boolean> {
    return bcrypt.compare(rawStr, hashedStr);
  }

  async hash(rawStr: string, saltOrRounds?: number | string): Promise<string> {
    return bcrypt.hash(rawStr, saltOrRounds || this.saltOrRounds);
  }
}
