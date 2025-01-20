import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  private prisma;
  private es;

  getPrisma() {
    return this.prisma;
  }

  setPrisma(prisma) {
    this.prisma = prisma;
  }

  getEs() {
    return this.es;
  }

  setEs(es) {
    this.es = es;
  }
}
