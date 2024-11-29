import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../../../cart/entities/cart.entity';
import { ProductId } from '../../../cart/enum/product.enum';
import { ICartRepository } from '../../../cart/interfaces/cart.repository.interface';
import { Product } from '../../../cart/interfaces/product.interface';

@Injectable()
export class CartRepository implements ICartRepository {
  /**
   * The @carts property below is a mock database.
   * In real scenarios, we would use a database like SQL Server or MongoDB.
   */
  private carts: { [userId: string]: Cart } = {};

  constructor() {}

  public async find(userId: string): Promise<Cart> {
    return this.carts[userId];
  }

  public async insert(userId: string, product: Product): Promise<string> {
    const cart = this.carts[userId] ?? this._newCart(userId);
    const products = cart.products;
    products.push(product);

    this.carts[userId] = cart;

    return cart.cartId;
  }

  public async delete(userId: string, productId: ProductId): Promise<boolean> {
    const cart = this.carts[userId];
    const products = cart.products;

    const productIndex = products.findIndex(
      (product) => product.id === productId,
    );
    const found = productIndex !== -1;

    if (found) {
      products.splice(productIndex, 1);
    }

    cart.products = products;
    this.carts[userId] = cart;

    return found;
  }

  private _newCart(userId: string): Cart {
    return {
      userId,
      cartId: uuidv4(),
      products: [],
    };
  }
}
