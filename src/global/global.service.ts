import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  private prisma;

  getPrisma() {
    return this.prisma;
  }

  setPrisma(prisma) {
    this.prisma = prisma;
  }
}
