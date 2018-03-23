import generate from "./index-generator";

it("generates", () => {
    expect(generate([ "./path", "./another/path" ])).toBe(EXPECTED_GENERATES);
});
//#region EXPECTED_GENERATES
const EXPECTED_GENERATES = `
export * from "./path";
export * from "./another/path";
`.trimLeft();
