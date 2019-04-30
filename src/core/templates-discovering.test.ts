import { extractScopedSlots } from "./templates-discovering";

describe("extractScopedSlots", () => {
    // https://github.com/vuejs/vue/issues/9443

    it("removes non-functional fields", () => {
        const actual = extractScopedSlots(
            {
                a() { return true; },
                b: 123,
                c: true,
                d: undefined
            },
            []
        );

        expect(Object.keys(actual)).toEqual(["a"]);
    });

    it("removes non-scoped slots", () => {
        const actual = extractScopedSlots(
            {
                a() { return true; },
                b() { return true; }
            },
            ["b"]
        );

        expect(Object.keys(actual)).toEqual(["a"]);
    });
});