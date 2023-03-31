import { describe, expect, it } from "@jest/globals";
import { computeDaysBetween, mergeObjects } from "./helpers";

describe("Function merge ojects", () => {
  it("contains all keys", () => {
    const result = mergeObjects({ a: 1, b: 2 }, { c: 3 });
    expect(result).toMatchObject({ a: 1, b: 2, c: 3 });
  });
  it("o2 overrides o1 values", () => {
    const o1 = { a: 1, b: 2 };
    const result = mergeObjects(o1, { a: 3 });
    expect(result).toMatchObject({ a: 3, b: 2 });
    expect(o1).toMatchObject({ a: 1, b: 2 });
  });
});

describe("Function days between", () => {
  it("retruns 0 if dates are the same", () => {
    expect(computeDaysBetween(new Date(), new Date())).toBe(0);
  });
  it("retruns 0 if dates are only 6 hours appart", () => {
    expect(
      computeDaysBetween(new Date(2022, 11, 20, 12), new Date(2022, 11, 20, 18))
    ).toBe(0);
  });
  it("retruns 1 if dates are 1 days appart", () => {
    expect(
      computeDaysBetween(new Date(2022, 11, 20), new Date(2022, 11, 21))
    ).toBe(1);
  });
});
