import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsString } from 'class-validator';
import { ProductId, Products } from '../enum/product.enum';

export class InsertProductDto {
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

  @ApiProperty({
    type: 'string',
    description: 'Product Name',
    example: 'Blue T-Shirt',
    required: true,
  })
  @IsString()
  @IsDefined()
  Name: string;
}
