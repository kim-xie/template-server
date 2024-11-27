import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApolloClientModule } from './datasources/appollo/apolloClient.module';
import { GlobalModule } from '@src/global/global.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    GlobalModule,
    ApolloClientModule,
    HealthModule,
    ImageModule,
    UserModule,
  ], // 依赖注入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
