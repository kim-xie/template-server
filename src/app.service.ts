import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor() {}
  getHello() {
    this.logger.log('Nest application successfully started');
    return 'Hello World!';
  }
}
