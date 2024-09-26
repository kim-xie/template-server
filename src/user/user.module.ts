import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../datasources/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)], // 注入依赖,循环依赖 forwardRef
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
