import { ProductId } from '../enum/product.enum';

export interface Product {
  id: ProductId;
  name: string;
  price: number;
}
