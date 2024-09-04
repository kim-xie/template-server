import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasources/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({ data });
	}

  async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

  async findBy(params): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
	}

  async remove(where): Promise<User> {
		return this.prisma.user.delete({
      where,
    });
	}

  async update(params): Promise<User> {
		const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
	}
}
