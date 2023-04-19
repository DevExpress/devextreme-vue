import { convertTypes } from "./converter";

it("deduplicates", () => {
    expect(convertTypes([
        { type: "String", isCustomType: false, acceptableValues: [], importPath: "importPath", isImportedType: false },
        { type: "Number", isCustomType: false, acceptableValues: [], importPath: "importPath", isImportedType: false },
        { type: "String", isCustomType: false, acceptableValues: [], importPath: "importPath", isImportedType: false }
    ])).toEqual(["String", "Number"]);
});

it("returns undefiend if finds Any", () => {
        expect(convertTypes([{
            type: "Any",
            isCustomType: false,
            acceptableValues: [],
            importPath: "importPath",
            isImportedType: false
        }])).toBeUndefined();
        expect(convertTypes([
            {
                type: "String",
                isCustomType: false,
                acceptableValues: [],
                importPath: "importPath",
                isImportedType: false
            },
            {
                type: "Number",
                isCustomType: false,
                acceptableValues: [],
                importPath: "importPath",
                isImportedType: false
            },
            { type: "Any", isCustomType: false, acceptableValues: [], importPath: "importPath", isImportedType: false }
        ])).toBeUndefined();
    });

it("returns Object if finds isCustomType", () => {
    expect(convertTypes([{
        type: "CustomType",
        isCustomType: true,
        acceptableValues: [],
        importPath: "importPath",
        isImportedType: false
    }])).toEqual(["Object"]);
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
    expect(convertTypes([{
        type: "CustomType",
        isCustomType: true,
        acceptableValues: [],
        importPath: "importPath",
        isImportedType: false
    }], {
        CustomType: {
            name: "CustomType",
            module: "module",
            types: [
                {
                    type: "String",
                    isCustomType: false,
                    acceptableValues: [],
                    importPath: "importPath",
                    isImportedType: false
                },
                {
                    type: "Number",
                    isCustomType: false,
                    acceptableValues: [],
                    importPath: "importPath",
                    isImportedType: false
                }
            ],
            props: [],
            templates: [],
            module: ""
        }
    })).toEqual(["Object", "String", "Number"]);
});
