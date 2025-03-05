import { Controller, Get } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { createUser, findAllUser } from '@src/datasources/mongodb/service/user';

@ApiTags('demo')
@Controller()
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  @Get('esDemo')
  @ApiOperation({ summary: 'esDemo' })
  esDemo(): Promise<string> {
    return this.demoService.esDemo();
  }
  @Get('kafkaDemo')
  @ApiOperation({ summary: 'kafkaDemo' })
  kafkaDemo(): Promise<string> {
    return this.demoService.kafkaDemo();
  }
  @Get('redisDemo')
  @ApiOperation({ summary: 'redisDemo' })
  redisDemo(): Promise<string> {
    return this.demoService.redisDemo();
  }

  @Get('mongoDemo')
  @ApiOperation({ summary: 'mongoDemo' })
  async mongoDemo(): Promise<any> {
    await createUser({ name: 'kim', password: '123456' });
    return findAllUser();
  }
}
