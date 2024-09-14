import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
  // 创建实例
  const app = await NestFactory.create(AppModule);

  // cors：跨域资源共享
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 使用swagger生成API文档
  useSwagger(app);

  // Use Winston for logging
  app.useLogger(app.get(WinstonModule));

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

// 启动服务
bootstrap();
