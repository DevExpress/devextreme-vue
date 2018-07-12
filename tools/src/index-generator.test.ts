import generate from "./index-generator";

it("generates", () => {
    expect(generate([ "./path", "./another/path" ])).toBe(EXPECTED_GENERATES);
});
//#region EXPECTED_GENERATES
const EXPECTED_GENERATES = `
export default from "./path";
export default from "./another/path";
`.trimLeft();
