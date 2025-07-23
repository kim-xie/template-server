import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';

@Module({
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
