export class CalculatePriceResponseDto {
  /**
   * The total price of the cart without any discounts.
   */
  cartTotalPrice: number;

  /**
   * Final price of the cart after applying discounts
   * This should be the final price that the user will pay.
   */
  finalPrice: number;
}

export const assignCalculatePriceDto = (
  totalPrice: number,
  finalPrice: number | string,
) => {
  const objectToAssign: CalculatePriceResponseDto = {
    cartTotalPrice: Number(totalPrice.toFixed(2)),
    finalPrice: Number(finalPrice),
  };

  return Object.assign(new CalculatePriceResponseDto(), objectToAssign);
};
