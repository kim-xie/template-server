import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'get hello' })
  @ApiResponse({
    status: 200,
    description: 'Return "Hello World!"',
    type: 'Hello World!',
  })
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('esDemo')
  @ApiOperation({ summary: 'esDemo' })
  esDemo(): Promise<string> {
    return this.appService.esDemo();
  }
  @Get('kafkaDemo')
  @ApiOperation({ summary: 'kafkaDemo' })
  kafkaDemo(): Promise<string> {
    return this.appService.kafkaDemo();
  }
}
