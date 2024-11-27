import { Injectable } from '@nestjs/common';
import { GlobalService } from '@src/global/global.service';

@Injectable()
export class UserService {
  constructor(private readonly globalService: GlobalService) {}

  async create(data: any): Promise<any> {
    return this.globalService.getPrisma().user.create({ data });
  }

  async findAll(): Promise<any[]> {
    return this.globalService.getPrisma().user.findMany();
  }

  async findBy(params): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.globalService.getPrisma().user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async remove(where): Promise<any> {
    return this.globalService.getPrisma().user.delete({
      where,
    });
  }

  async update(params): Promise<any> {
    const { where, data } = params;
    return this.globalService.getPrisma().user.update({
      data,
      where,
    });
  }
}
