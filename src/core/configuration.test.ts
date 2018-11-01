import Configuration, { bindOptionWatchers, ExpectedChild, subscribeOnUpdates, UpdateFunc } from "./configuration";

function createRootConfig(updateFunc: UpdateFunc): Configuration {
    return new Configuration(updateFunc, null, {});
}

function createConfigWithExpectedChildren(children: Record<string, ExpectedChild>): Configuration {
    return new Configuration(
        jest.fn(),
        null,
        {},
        children
    );
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
    const emitStub = jest.fn();

    const config: any = {
        name: null
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub
        }
    );
    config.optionChangedFunc({name: "option1", fullName: "option1", value: "value"});

    expect(emitStub).toHaveBeenCalledTimes(1);
    expect(emitStub).toHaveBeenCalledWith("update:option1", "value");
});

it("subscribes on updates of nested options", () => {
    const emitStub = jest.fn();

    const config: any = {
        name: "widgetOption",
        fullPath: "widgetOption[1]"
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub
        }
    );
    config.optionChangedFunc({name: "widgetOption", fullName: "widgetOption[1].option1", value: "value"});

    expect(emitStub).toHaveBeenCalledTimes(1);
    expect(emitStub).toHaveBeenCalledWith("update:option1", "value");
});

it("subscribes on nested updates in root component", () => {
    const emitStub = jest.fn();

    const config: any = {
        name: null
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub
        }
    );
    config.optionChangedFunc({
        name: "widgetOption",
        fullName: "widgetOption[1].option1",
        value: "value",
        component: {
            option: (name: string) => name === "widgetOption" && "widgetOptionValue"
        }
    });

    expect(emitStub).toHaveBeenCalledTimes(1);
    expect(emitStub).toHaveBeenCalledWith("update:widgetOption", "widgetOptionValue");
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

describe("collection items creation", () => {

    describe("not-expected item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {}, true);

            expect(nested.isCollectionItem).toBeTruthy();
        });

        it("is false if isCollection arg is false", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {}, false);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is false if isCollection arg is undefined", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {});

            expect(nested.isCollectionItem).toBeFalsy();
        });
    });

    describe("expected as collection item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeTruthy();
        });

        it("is true if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeTruthy();
        });

        it("is true if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeTruthy();
        });
    });

    describe("expected as collection item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeFalsy();
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
