import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ImageModule } from './image/image.module';
import { ApolloClientModule } from './datasources/appollo/apolloClient.module';
import { GlobalModule } from './global/global.module';
import { UserModule } from './user/user.module';
import { EsModule } from './datasources/es/es.module';
import { SpiderModule } from './spider/spider.module';

@Module({
  imports: [
    // 静态资源服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    GlobalModule,
    ApolloClientModule,
    HealthModule,
    ImageModule,
    UserModule,
    EsModule,
    SpiderModule,
  ], // 依赖注入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
