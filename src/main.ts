import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import LoggerConfig from './common/configs/logger.config';
import { AppModule } from './app.module';
import { startApolloServer } from './datasources/appollo/apolloClient';
import { connectMongoDB } from './datasources/mongodb';

// 开启swagger api
function useSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('The Swagger API description')
    .setVersion('1.0')
    .addTag('Swagger')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  // 使用 Winston 日志
  const logger = winston.createLogger(LoggerConfig);
  // 创建实例
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(logger),
  });

  // 服务统一前缀（适用于统一网关服务）
  // app.setGlobalPrefix('api')

  // cors：跨域资源共享
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 使用swagger生成API文档
  useSwagger(app);

  await app.listen(3000);

  logger.info(`Application is running on: ${await app.getUrl()}`);

  // 启动apollo服务
  await startApolloServer(() => {
    // 连接数据库
    connectMongoDB();
  });
}

// 启动服务
bootstrap();
