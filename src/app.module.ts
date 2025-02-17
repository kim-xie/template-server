import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { KafkaModule } from './datasources/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'production'}`, '.env'], // 根据 NODE_ENV 加载对应文件
      isGlobal: true, // 全局可用
    }),
    // 静态资源服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    // KafkaModule.register({
    //   clientId: 'fed-monitor-kafka',
    //   brokers: ['10.1.2.106:9092', '10.1.2.107:9092', '10.1.2.108:9092'],
    //   groupId: 'fed-monitor-kafka',
    // }),
    GlobalModule,
    ApolloClientModule,
    HealthModule,
    ImageModule,
    UserModule,
    EsModule,
    KafkaModule,
    SpiderModule,
  ], // 依赖注入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
