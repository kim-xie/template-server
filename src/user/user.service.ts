import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasources/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async findBy(params): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async remove(where): Promise<any> {
    return this.prisma.user.delete({
      where,
    });
  }

  async update(params): Promise<any> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }
}
