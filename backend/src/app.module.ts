import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
