import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn } from 'class-validator';
import { ProductId, Products } from '../enum/product.enum';

export class DeleteProductDto {
  @ApiProperty({
    type: 'string',
    description: 'Product ID',
    example: 'T_SHIRT',
    enum: Object.keys(Products),
    required: true,
  })
  @IsIn(Object.keys(Products))
  @IsDefined()
  ProductId: ProductId;
}
