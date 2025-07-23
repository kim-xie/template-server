import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';
@Injectable()
export class TradeService {
  private readonly logger = new Logger(TradeService.name);

  constructor() {
    this.run();
  }
  async run() {
    const binance = new ccxt.binance({});
    const res = await binance.fetchTime();
    this.logger.warn(`res: ${JSON.stringify(res)}`);
  }
}
