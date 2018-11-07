import { isEqual, toComparable } from "./helpers";

describe("toComparable", () => {

    it("Primitive", () => {
        expect(toComparable(1)).toBe(1);
    });

    it("Object", () => {
        const testObject = { text: 1 };
        expect(toComparable(testObject)).toBe(testObject);
    });

    it("Date", () => {
        const testDate = new Date(2018, 9, 9);
        expect(toComparable(testDate)).toBe(testDate.getTime());
    });
});

describe("isEqual", () => {

    it("Primitive", () => {
        expect(isEqual(1, 1)).toBe(true);
    });

    it("Empty Array", () => {
        const testArray1 = [];
        const testArray2 = [];
        expect(isEqual(testArray1, testArray2)).toBe(true);
    });
});
