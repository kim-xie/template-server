import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import LoggerConfig from './common/configs/logger.config';

@Module({
  imports: [WinstonModule.forRoot({ ...LoggerConfig })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
