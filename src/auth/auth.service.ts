import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // validate user
  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userService.findBy({ where: name })[0];
    if (user) {
      if (password === user?.password) {
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
    };
    try {
      const token = this.jwtService.sign(payload);
      return { token };
    } catch (error) {
      throw new NotAcceptableException(error.message || 'Certificate error.');
    }
  }
}
