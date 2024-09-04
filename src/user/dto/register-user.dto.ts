import { ApiProperty } from '@nestjs/swagger';
import { UserLoginDto } from './login-user.dto';

export class RegisterUserDto extends UserLoginDto {
  @ApiProperty({
    description: 'The real name',
  })
  realName: string;
  @ApiProperty({
    description: 'The nick name',
  })
  nickName: string;
  @ApiProperty({
    description: 'The mobile number',
  })
  mobile: string;
  @ApiProperty({
    description: 'Confirm password',
  })
  confirmPassword: string;
}
