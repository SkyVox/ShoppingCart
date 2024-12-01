import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../user/enums/user-role.enum';
import { UserPayload } from '../user/interfaces/user.interface';
import { calculatePercentage } from '../utils/percentage.utils';
import {
  assignCalculatePriceDto,
  CalculatePriceResponseDto,
} from './dto/calculate-price.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { InsertProductDto } from './dto/insert-product.dto';
import { Cart } from './entities/cart.entity';
import { Products } from './enum/product.enum';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { Product } from './interfaces/product.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(ICartRepository)
    readonly cartRepository: ICartRepository,
  ) {}

  public async findUserProducts(user: UserPayload): Promise<Cart> {
    try {
      const cart = await this.cartRepository.find(user.Id);

      if (!cart) {
        throw new BadRequestException('Cart not found! Try add some products.');
      }

      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async insertProduct(
    user: UserPayload,
    dto: InsertProductDto,
  ): Promise<string> {
    const product: Product = {
      id: dto.ProductId,
      name: dto.Name,
      price: Products[dto.ProductId],
    };

    try {
      const insert = await this.cartRepository.insert(user.Id, product);

      if (!insert) {
        throw new BadRequestException(
          'An error has occurred while trying to insert the product.',
        );
      }

      return insert;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async deleteProduct(
    user: UserPayload,
    dto: DeleteProductDto,
  ): Promise<string> {
    await this.findUserProducts(user);

    try {
      const deleted = await this.cartRepository.delete(user.Id, dto.ProductId);

      if (!deleted) {
        throw new BadRequestException(
          'No product were found to be removed from the cart.',
        );
      }

      return `1x ${dto.ProductId} removed successfully.`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async clearCart(user: UserPayload): Promise<string> {
    try {
      await this.cartRepository.clear(user.Id);
      return `Cart cleared successfully.`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async calculatePrice(
    user: UserPayload,
  ): Promise<CalculatePriceResponseDto> {
    const cart = await this.findUserProducts(user);
    const products = cart.products;

    if (products.length === 0) {
      return assignCalculatePriceDto(0, 0);
    }

    const productPrices = products.map((product) => product.price);
    const total = productPrices.reduce(
      (acc, currentPrice) => acc + currentPrice,
      0,
    );

    const isVIPCustomer = user.Role === UserRole.VIP;
    const vipPrice = calculatePercentage(total, 15);

    if (products.length <= 2) {
      const finalPrice = isVIPCustomer ? vipPrice : total;
      return assignCalculatePriceDto(total, finalPrice.toFixed(2));
    }

    /**
     * In case user has more than 2 products in their cart.
     */

    const lowestProductPrice = Math.min(...productPrices);
    const commonPrice = total - lowestProductPrice;

    if (isVIPCustomer && vipPrice < commonPrice) {
      return assignCalculatePriceDto(total, vipPrice.toFixed(2));
    }

    return assignCalculatePriceDto(total, commonPrice.toFixed(2));
  }
}
