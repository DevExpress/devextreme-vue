import generate from "./index-generator";

it("generates", () => {
    expect(
        generate([
            { name: "widget", path: "./path" },
            { name: "anotherWidget", path: "./another/path" },
        ])
    ).toBe(EXPECTED_GENERATES);
});
//#region EXPECTED_GENERATES
const EXPECTED_GENERATES = `
export { widget } from "./path";
export { anotherWidget } from "./another/path";
`.trimLeft();
