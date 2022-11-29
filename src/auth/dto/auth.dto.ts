import { IsJWT, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginInput {
  @IsString()
  @Length(5, 10)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenInput {
  @IsJWT()
  refresh_token: string;
}
