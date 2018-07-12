import Configuration, { UpdateFunc } from "./configuration";

function createRootConfig(updateFunc: UpdateFunc): Configuration {
    return new Configuration(updateFunc, null, [], {});
}

it("calls update from nested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    const nested = root.createNested("option", [], {});
    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.prop", 123);
});

it("calls update from subnested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    const nested = root.createNested("option", [], {});
    const subNested = nested.createNested("subOption", [], {});
    subNested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.subOption.prop", 123);
});

it("pulls initial value from nested", () => {
    const root = createRootConfig(jest.fn());

    const nested = root.createNested("option", [], {});
    nested.createNested("subOption", ["prop"], { prop: 123 });

    expect(root.getInitialValues()).toMatchObject({
        option: {
            subOption: {
                prop: 123
            }
        }
    });
});

it("pulls initial values from self and nested", () => {
    const root = createRootConfig(jest.fn());

    const nested = root.createNested("option", ["propA"], { propA: 123 });
    nested.createNested("subOption", ["prop"], { propB: 456 });

    expect(root.getInitialValues()).toMatchObject({
        option: {
            propA: 123,
            subOption: {
                propB: 456
            }
        }
    });
});

it("pulls undefined if no initial values provided", () => {
    const root = createRootConfig(jest.fn());

    const nested = root.createNested("option", [], {});
    nested.createNested("subOption", [], {});

    expect(root.getInitialValues()).toBeUndefined();
});

it("pulls initial values and ignores empty", () => {
    const root = createRootConfig(jest.fn());

    const nested = root.createNested("option", ["empty"], {});
    nested.createNested("subOption", ["prop"], { prop: 123 });

    root.createNested("anotherOption", [], {});
    nested.createNested("anotherSubOption", [], {});

    expect(root.getInitialValues()).toMatchObject({
        option: {
            subOption: {
                prop: 123
            }
        }
    });
});

describe("options to watch list", () => {

    it("includes option with initial values", () => {
        const config = new Configuration(jest.fn(), null, ["option1"], { option1: 123, option2: 456 });

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("includes option without initial values", () => {
        const config = new Configuration(jest.fn(), null, ["option1"], {});

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("excludes option if finds nested config with the same name", () => {
        const config = new Configuration(jest.fn(), null, ["option1", "theNestedOption"], {});
        config.createNested("theNestedOption", [], {});

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

});
