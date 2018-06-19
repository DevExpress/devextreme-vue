import { convertTypes } from "./converter";

it("deduplicates", () => {
    expect(convertTypes([
        { type: "String", isCustomType: false, acceptableValues: [] },
        { type: "Number", isCustomType: false, acceptableValues: [] },
        { type: "String", isCustomType: false, acceptableValues: [] }
    ])).toEqual(["String", "Number"]);
});

it("returns undefiend if finds Any", () => {
    expect(convertTypes([{ type: "Any", isCustomType: false, acceptableValues: [] }])).toBeUndefined();
    expect(convertTypes([
        { type: "String", isCustomType: false, acceptableValues: [] },
        { type: "Number", isCustomType: false, acceptableValues: [] },
        { type: "Any", isCustomType: false, acceptableValues: [] }
    ])).toBeUndefined();
});

it("returns Object if finds isCustomType", () => {
    expect(convertTypes([
        { type: "CustomType", isCustomType: true, acceptableValues: [] }
    ])).toEqual(["Object"]);
});

it("returns undefined if array is empty", () => {
    expect(convertTypes([])).toBeUndefined();
});

it("returns undefined if array is undefined", () => {
    expect(convertTypes(undefined)).toBeUndefined();
});

it("returns undefined if array is null", () => {
    expect(convertTypes(null)).toBeUndefined();
});

it("expands custom types", () => {
    expect(convertTypes([
        { type: "CustomType", isCustomType: true, acceptableValues: [] },
    ], {
        CustomType: {
            name: "CustomType",
            types: [
                { type: "String", isCustomType: false, acceptableValues: []},
                { type: "Number", isCustomType: false, acceptableValues: []}
            ],
            props: []
        }
})).toEqual(["Object", "String", "Number"]);
});
