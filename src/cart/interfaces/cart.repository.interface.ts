import { Cart } from '../entities/cart.entity';
import { ProductId } from '../enum/product.enum';
import { Product } from './product.interface';

export interface ICartRepository {
  find(userId: string): Promise<Cart>;

  insert(userId: string, product: Product): Promise<string>;

  delete(userId: string, productId: ProductId): Promise<boolean>;
}

export const ICartRepository = Symbol('ICartRepository');
