import { convertTypes } from "./converter";

it("deduplicates", () => {
    expect(convertTypes(["String", "Number", "String"])).toEqual(["String", "Number"]);
});

it("returns undefiend if finds Any", () => {
    expect(convertTypes(["Any"])).toBeUndefined();
    expect(convertTypes(["String", "Any", "Number"])).toBeUndefined();
});

it("returns undefined if array is empty", () => {
    expect(convertTypes([])).toBeUndefined();
});

it("returns undefined if array is undefined", () => {
    expect(convertTypes([])).toBeUndefined();
});
