import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { KafkaModule } from './lib/kafka/kafka.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    UserModule,
    AuthenticationModule,
    KafkaModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
