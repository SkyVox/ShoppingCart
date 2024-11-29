import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class TokenRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'User Name',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsDefined()
  Name: string;

  @ApiProperty({
    type: 'string',
    description: 'User Role (Permission)',
    example: UserRole.COMMON,
    enum: UserRole,
    required: true,
  })
  @IsEnum(UserRole)
  @IsDefined()
  Role: UserRole;
}

export class TokenRequestResponseDto {
  Name: string;
  Token: string;
}
