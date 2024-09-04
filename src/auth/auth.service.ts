import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // validate user
  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.usersService.matchOne(name);
    if (user) {
      if (user.password === password) {
        return { code: 1, user };
      } else {
        return { code: 2, user: null };
      }
    }
    return { code: 3, user: null };
  }

  // jwt certificate
  async certificate(user: any) {
    const payload = {
      username: user.name,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    try {
      const token = this.jwtService.sign(payload);
      return { token };
    } catch (error) {
      throw new NotAcceptableException(error.message || 'Certificate error.');
    }
  }
}
