import { convertTypes } from "./converter";

it("deduplicates", () => {
    expect(convertTypes([
        { type: "String", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" },
        { type: "Number", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" },
        { type: "String", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" }
    ])).toEqual(["String", "Number"]);
});

it("returns undefiend if finds Any", () => {
    expect(convertTypes([
        { type: "Any", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" }
    ])).toBeUndefined();
    expect(convertTypes([
        { type: "String", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" },
        { type: "Number", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" },
        { type: "Any", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" }
    ])).toBeUndefined();
});

it("returns Object if finds isCustomType", () => {
    expect(convertTypes([
        { type: "CustomType", isCustomType: true, acceptableValues: [], isImportedType: false, importPath: "" }
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
        { type: "CustomType", isCustomType: true, acceptableValues: [], isImportedType: false, importPath: "" },
    ], {
        CustomType: {
            name: "CustomType",
            types: [
                { type: "String", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" },
                { type: "Number", isCustomType: false, acceptableValues: [], isImportedType: false, importPath: "" }
            ],
            props: [],
            templates: [],
            module: ""
        }
})).toEqual(["Object", "String", "Number"]);
});
