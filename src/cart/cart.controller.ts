import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { BadRequestSchema } from '../infra/exception-schemas/bad-request.schema';
import { UnauthorizedSchema } from '../infra/exception-schemas/unauthorized.schema';
import { UserPayload } from '../user/interfaces/user.interface';
import { CartService } from './cart.service';
import { CalculatePriceResponseDto } from './dto/calculate-price.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { InsertProductDto } from './dto/insert-product.dto';
import { Cart } from './entities/cart.entity';

@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: BadRequestSchema,
})
@ApiUnauthorizedResponse({
  description: 'JWT token is missing or invalid',
  type: UnauthorizedSchema,
})
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.CREATED, type: Cart })
  async findUserProducts(@User() user: UserPayload): Promise<Cart> {
    return this.cartService.findUserProducts(user);
  }

  @Post('insert')
  @ApiResponse({ status: HttpStatus.CREATED, type: String })
  async insertProduct(
    @User() user: UserPayload,
    @Body() dto: InsertProductDto,
  ): Promise<string> {
    return this.cartService.insertProduct(user, dto);
  }

  @Delete('remove')
  @ApiResponse({ status: HttpStatus.CREATED, type: String })
  async deleteProduct(
    @User() user: UserPayload,
    @Body() dto: DeleteProductDto,
  ): Promise<string> {
    return this.cartService.deleteProduct(user, dto);
  }

  @Get('calculate-price')
  @ApiResponse({ status: HttpStatus.CREATED, type: CalculatePriceResponseDto })
  async calculatePrice(
    @User() user: UserPayload,
  ): Promise<CalculatePriceResponseDto> {
    return this.cartService.calculatePrice(user);
  }
}
