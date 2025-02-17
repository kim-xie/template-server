import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  NotAcceptableException,
  NotFoundException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserLoginDto } from './dto/loginUser.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginParmas: UserLoginDto) {
    const { user, code } = await this.authService.validateUser(
      loginParmas.name,
      loginParmas.password,
    );
    switch (code) {
      case 1:
        return this.authService.certificate(user);
      case 2:
        throw new NotAcceptableException('Name or password is incorrect.');
      default:
        throw new NotFoundException('User cannot found.');
    }
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  create(@Body() registerUserDto: RegisterUserDto): Promise<any> {
    return this.userService.create(registerUserDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiOperation({ summary: '查询所有用户' })
  @ApiResponse({
    status: 200,
    description: 'Find all users',
  })
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<any[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':name')
  @ApiOperation({ summary: '根据用户名查询用户' })
  @ApiResponse({
    status: 200,
    description: 'The founded user.',
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('name') name: string): Promise<any> {
    return this.userService.findBy({ where: name });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({
    status: 200,
    description: 'Remove user',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
