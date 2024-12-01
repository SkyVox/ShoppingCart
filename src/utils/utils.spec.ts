import { calculatePercentage } from './percentage.utils';

describe('Application Utils', () => {
  describe('calculatePercentage', () => {
    it(`should return the original value if percentage is 0`, () => {
      expect(calculatePercentage(100, 0)).toBe(100);
    });

    it(`should return the correct percentage of a value`, () => {
      expect(calculatePercentage(50, 50)).toBe(25);
      expect(calculatePercentage(100, 20)).toBe(80);
      expect(calculatePercentage(200, 10)).toBe(180);
    });

    it(`should return 0 if percentage is 100`, () => {
      expect(calculatePercentage(100, 100)).toBe(0);
    });

    it(`should throw an error if percentage is negative`, () => {
      expect(() => calculatePercentage(100, -1)).toThrowError();
    });

    it(`should throw an error if percentage greater than 100`, () => {
      expect(() => calculatePercentage(100, 101)).toThrowError();
    });

    it(`should handle negative values`, () => {
      expect(calculatePercentage(-100, 20)).toBe(-80);
    });
  });
});
