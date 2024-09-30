import { ApiProperty } from '@nestjs/swagger';
import { UserLoginDto } from './loginUser.dto';

export class RegisterUserDto extends UserLoginDto {
  @ApiProperty({
    description: 'The name',
  })
  name: string;
  @ApiProperty({
    description: 'The password',
  })
  password: string;
}
