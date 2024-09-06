import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({
    description: 'user login name, unique',
  })
  name: string;
  @ApiProperty({
    description: 'password',
  })
  password: string;
}
