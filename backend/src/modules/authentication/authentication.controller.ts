/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegisterAccountUseCase } from './useCases/registerAccountUseCase';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(
    private readonly registerAccountUseCase: RegisterAccountUseCase,
  ) {}

  @Post('/register')
  async registerWithEmail(@Body() registerDto: RegisterDto) {
    const { email, lastname, name, password } = registerDto;
    return this.registerAccountUseCase.execute({
      credentials: {
        type: 'local',
        email,
        password,
      },
      lastname,
      name,
    });
  }

  @Get('/google')
  async registerWithGoogle(@Query('credential') credential: string) {
    return this.registerAccountUseCase.execute(credential);
  }

  @Post('/facebook')
  registerWithFacebook(@Body() createAuthenticationDto: LoginDto) {
    // return this.authenticationService.create(createAuthenticationDto);
  }

  @Post('/login')
  loginWUserPassword(@Body() createAuthenticationDto: LoginDto) {
    // return this.authenticationService.create(createAuthenticationDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
