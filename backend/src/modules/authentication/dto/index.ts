import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class ExternalRegisterDto {
  name: string;
  lastname: string;
  email: string;
  picture: string;
  id: string;
  iss: 'google' | 'facebook';
}

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'O nome do usuário' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Doe', description: 'O sobrenome do usuário' })
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'O e-mail do usuário',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '1234John@', description: 'A senha do usuário' })
  @IsNotEmpty()
  readonly password: string;
}
