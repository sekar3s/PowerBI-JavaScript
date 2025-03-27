import { calculatePercentage } from '../src/util';

describe('calculatePercentage', () => {
  test('should return 50 when part is 50 and total is 100', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
  });

  test('should return 0 when part is 0 and total is 100', () => {
    expect(calculatePercentage(0, 100)).toBe(0);
  });

  test('should return 0 when total is 0 (to handle division by zero)', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  test('should return -50 when part is -50 and total is 100', () => {
    expect(calculatePercentage(-50, 100)).toBe(-50);
  });

  test('should return -50 when part is 50 and total is -100', () => {
    expect(calculatePercentage(50, -100)).toBe(-50);
  });

  test('should return 50 when part is -50 and total is -100', () => {
    expect(calculatePercentage(-50, -100)).toBe(50);
  });

  test('should return 25 when part is 2.5 and total is 10', () => {
    expect(calculatePercentage(2.5, 10)).toBe(25);
  });

  test('should return 10 when part is 0.0001 and total is 0.001', () => {
    expect(calculatePercentage(0.0001, 0.001)).toBe(10);
  });

  test('should return 100 when part and total are both Number.MAX_VALUE', () => {
    expect(calculatePercentage(Number.MAX_VALUE, Number.MAX_VALUE)).toBe(100);
  });

  test('should return a very small percentage close to 0 when part is Number.MIN_VALUE and total is Number.MAX_VALUE', () => {
    expect(calculatePercentage(Number.MIN_VALUE, Number.MAX_VALUE)).toBeCloseTo(0);
  });
});