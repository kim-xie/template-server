import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name',
  })
  name: string;
  @ApiProperty({
    description: 'The password',
  })
  password: string;
}
