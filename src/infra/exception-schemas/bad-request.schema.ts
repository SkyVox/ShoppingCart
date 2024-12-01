import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestSchema {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({
    example: [
      'ProductId must be one of the following values: T_SHIRT, JEANS, DRESS',
    ],
  })
  message: Array<string>;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
