import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [], // 依赖注入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
