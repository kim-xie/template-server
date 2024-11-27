import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import LoggerConfig from './common/configs/logger.config';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AllExceptionsFilter } from './common/filters/all.exception';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

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

  // cors：跨域资源共享
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局日志中间件
  app.use(new LoggerMiddleware().use);

  // 服务统一前缀（适用于统一网关服务）
  // app.setGlobalPrefix('api')

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 使用swagger生成API文档
  useSwagger(app);

  // 服务监听
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // 服务地址
  const serviceUrl = (await app.getUrl()).replace('[::1]', 'localhost');
  logger.info(`Application is running at: ${serviceUrl}`);
  logger.info(`Swagger API is running at: ${serviceUrl}/api`);
}

// 启动服务
bootstrap();
