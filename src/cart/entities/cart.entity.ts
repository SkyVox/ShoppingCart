import { Product } from '../interfaces/product.interface';

export class Cart {
  cartId: string;

  userId: string;

  products: Array<Product>;
}
