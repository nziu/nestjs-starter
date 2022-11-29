import { DynamicModule, Module } from '@nestjs/common';
import { BCRYPT_SERVICE_OPTIONS } from './bcrypt.constants';
import { BcryptModuleOptions } from './bcrypt.interface';
import { BcryptService } from './bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {
  static forRoot(options?: BcryptModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: BcryptModule,
      providers: [
        {
          provide: BCRYPT_SERVICE_OPTIONS,
          useValue: options.saltOrRounds,
        },
      ],
    };
  }
}
