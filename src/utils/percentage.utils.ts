/**
 * Calculate the percentage of a value.
 *
 * @param value - The value(number) to calculate the percentage of.
 * @param percentage - The percentage to calculate.
 * @returns The percentage of the given value.
 */
export const calculatePercentage = (value: number, percentage: number) => {
  if (percentage < 0 || percentage > 100) {
    throw new Error(`Percentage must be between 0 and 100`);
  }

  return value * (1 - percentage / 100);
};
