import Configuration, { bindOptionWatchers, subscribeOnUpdates, UpdateFunc } from "./configuration";

function createRootConfig(updateFunc: UpdateFunc): Configuration {
    return new Configuration(updateFunc, null, {});
}

it("calls update from nested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    const nested = root.createNested("option", {});
    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.prop", 123);
});

it("calls update from subnested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {});
    const subNested = nested.createNested("subOption", {});

    subNested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.subOption.prop", 123);
});

it("calls update from nested collectionItem (first)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {}, true);
    root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[0].prop", 123);
});

it("calls update from nested collectionItem (middle)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    root.createNested("option", {}, true);
    const nested = root.createNested("option", {}, true);
    root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[1].prop", 123);
});

it("calls update from nested collectionItem (last)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    root.createNested("option", {}, true);
    root.createNested("option", {}, true);
    const nested = root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[2].prop", 123);
});

it("calls update from nested collectionItem (the only)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[0].prop", 123);
});

it("binds option watchers", () => {
    const updateValueFunc = jest.fn();
    const $watchFunc = jest.fn();

    bindOptionWatchers(
        {
            updateValue: updateValueFunc,
            getOptionsToWatch: () => ["prop1"],
        } as any,
        {
            $watch: $watchFunc
        }
    );

    expect($watchFunc.mock.calls[0][0]).toBe("prop1");

    const value = {};
    $watchFunc.mock.calls[0][1](value);

    expect(updateValueFunc).toHaveBeenCalledTimes(1);
    expect(updateValueFunc.mock.calls[0][0]).toBe("prop1");
    expect(updateValueFunc.mock.calls[0][1]).toBe(value);
});

it("subscribes on updates", () => {
    const $emitFunc = jest.fn();

    const config: any = {
        name: "option1",
        fullOptionPath: "option1"
    };

    subscribeOnUpdates(
        config,
        {
            $emit: $emitFunc
        }
    );
    config.optionChangedFunc({name: "option1", fullName: "option1", value: "value"});
    expect($emitFunc.mock.calls[0][0]).toBe("option1");
    expect($emitFunc.mock.calls[0][1]).toBe("value");

    expect($emitFunc.mock).toHaveBeenCalledTimes(1);
});

describe("initial configuration", () => {

    it("pulls value from nested", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested
            .createNested("subOption", { prop: 123 })
            .init(["prop"]);

        expect(root.getInitialValues()).toMatchObject({
            option: {
                subOption: {
                    prop: 123
                }
            }
        });
    });

    it("pulls array of values from a coollectionItem nested (single value)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("options", { propA: 123 }, true);

        expect(root.getInitialValues()).toMatchObject({
            options: [
                { propA: 123 }
            ]
        });
    });

    it("pulls array of values from a coollectionItem nested (several values)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("options", { propA: 123 }, true);
        root.createNested("options", { propA: 456, propB: 789 }, true);

        expect(root.getInitialValues()).toMatchObject({
            options: [
                { propA: 123 },
                { propA: 456, propB: 789 },
            ]
        });
    });

    it("pulls values from the last nested (not a coollectionItem)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("option", { propA: 123 });
        root.createNested("option", { propA: 456, propB: 789 });

        expect(root.getInitialValues()).toMatchObject({
            option: { propA: 456, propB: 789 }
        });
    });

    it("pulls values from self and nested", () => {
        const root = new Configuration(jest.fn(), null, { propA: 123 });

        const nested = root.createNested("option", { propB: 456 });
        nested.createNested("subOption", { propC: 789 });

        expect(root.getInitialValues()).toMatchObject({
            propA: 123,
            option: {
                propB: 456,
                subOption: {
                    propC: 789
                }
            }
        });
    });

    it("pulls undefined if no values provided", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested.createNested("subOption", {});

        expect(root.getInitialValues()).toBeUndefined();
    });

    it("pulls values and ignores empty nested", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested.init(["empty"]);
        nested
            .createNested("subOption", { prop: 123 })
            .init(["prop"]);

        root.createNested("anotherOption", {});
        nested.createNested("anotherSubOption", {});

        expect(root.getInitialValues()).toMatchObject({
            option: {
                subOption: {
                    prop: 123
                }
            }
        });
    });

});

describe("options watch-list", () => {

    it("includes option with initial values", () => {
        const config = new Configuration(jest.fn(), null, { option1: 123, option2: 456 });
        config.init(["option1"]);

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("includes option without initial values", () => {
        const config = new Configuration(jest.fn(), null, {});
        config.init(["option1"]);

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("excludes option if finds nested config with the same name", () => {
        const config = new Configuration(jest.fn(), null, {});
        config.init(["option1", "theNestedOption"]);
        config.createNested("theNestedOption", {});

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

});
