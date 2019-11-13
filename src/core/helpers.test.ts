import { allKeysAreEqual, getOptionInfo, isEqual, toComparable } from "./helpers";

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

    it("Empty Array and null", () => {
        const testArray1 = [];
        const testArray2 = null;
        expect(isEqual(testArray1, testArray2)).toBe(false);
        expect(isEqual(testArray2, testArray1)).toBe(false);
    });

    it("Date", () => {
        const testDate1 = new Date(2018, 9, 9);
        const testDate2 = new Date(2018, 9, 9);
        expect(isEqual(testDate1, testDate2)).toBe(true);
    });
});

describe("allKeysAreEqual", () => {
    [
        [{}, {}],
        [{a: 1}, {a: 2}],
        [{a: 1, b: 2}, {a: 1, b: 2}],
        [{}, Object.create({}, {a: { value: 1}})],
        [Object.create({}, {a: { value: 1}}), {}],
        [Object.create({}, {a: { value: 1}}), Object.create({}, {b: { value: 1}})]
    ].map((input) => {
        it("returns true", () => {
            expect(allKeysAreEqual(input[0], input[1])).toBe(true);
        });
    });

    [
        [{}, {a: 1}],
        [{a: 1}, {}],
        [{a: 1, b: 2}, {a: 1, c: 3}],
        [{a: 1}, Object.create({}, {a: { value: 1}})],
        [Object.create({}, {a: { value: 1}}), {a: 1}]
    ].map((input) => {
        it("returns false", () => {
            expect(allKeysAreEqual(input[0], input[1])).toBe(false);
        });
    });
});

describe("getOptionInfo", () => {
    it("returns for simple option", () => {
        const optionInfo = getOptionInfo("test");

        expect(optionInfo.isCollection).toBe(false);
        expect(optionInfo.name).toEqual("test");
        expect(optionInfo.fullName).toEqual("test");
    });

    it("returns for collection option", () => {
        const optionInfo = getOptionInfo("test[4]");

        expect(optionInfo.isCollection).toBe(true);
        expect(optionInfo.name).toEqual("test");
        expect(optionInfo.fullName).toEqual("test[4]");

        if (optionInfo.isCollection) {
            expect(optionInfo.index).toEqual(4);
        }
    });
});
