type Product = {
  [key in string]: number;
};

export const Products: Product = {
  T_SHIRT: 35.99,
  JEANS: 65.5,
  DRESS: 80.75,
};

export type ProductId = keyof typeof Products;
