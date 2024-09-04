import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name',
  })
  firstName: string;
  @ApiProperty({
    description: 'The last name',
  })
  lastName: string;
}
