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

describe("fullPath building", () => {

    const testCases: Array<{
        msg: string;
        name: string | null;
        ownerPath?: string;
        expected: string | null;
        collectionIndex?: number;
    }> = [
            {
                msg: "works for null",
                name: null,
                expected: null
            },
            {
                msg: "works without owner",
                name: "abc",
                expected: "abc"
            },
            {
                msg: "works with owner",
                name: "abc",
                ownerPath: "def",
                expected: "def.abc"
            },
            {
                msg: "works for collection item",
                name: "abc",
                collectionIndex: 123,
                expected: "abc[123]"
            },
            {
                msg: "works for collection item with owner",
                name: "abc",
                ownerPath: "def",
                collectionIndex: 123,
                expected: "def.abc[123]"
            }
        ];

    for (const { msg, name, collectionIndex, ownerPath, expected } of testCases) {
        it(msg, () => {
            const isCollection = collectionIndex !== undefined;
            const ownerConfig = ownerPath ? { fullPath: ownerPath } : undefined;
            expect(new Configuration(
                jest.fn(),
                name,
                {},
                undefined,
                isCollection,
                collectionIndex,
                ownerConfig
            ).fullPath).toBe(expected);
        });
    }
});

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
    const innerChanges = {};

    bindOptionWatchers(
        {
            updateValue: updateValueFunc,
            getOptionsToWatch: () => ["prop1"],
            innerChanges: {}
        } as any,
        {
            $watch: $watchFunc
        },
        innerChanges
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
    const innerChanges = {};

    const config: any = {
        name: null,
        innerChanges
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub,
            $props: {}
        },
        innerChanges
    );
    config.optionChangedFunc({name: "option1", fullName: "option1", value: "value"});

    expect(emitStub).toHaveBeenCalledTimes(1);
    expect(emitStub).toHaveBeenCalledWith("update:option1", "value");
    expect(innerChanges).toEqual({option1: "value"});
});

it("subscribes on updates of nested options", () => {
    const emitStub = jest.fn();
    const innerChanges = {};

    const config: any = {
        name: "widgetOption",
        fullPath: "widgetOption[1]",
        innerChanges
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub,
            $props: {}
        },
        innerChanges
    );
    config.optionChangedFunc({name: "widgetOption", fullName: "widgetOption[1].option1", value: "value"});

    expect(emitStub).toHaveBeenCalledTimes(1);
    expect(emitStub).toHaveBeenCalledWith("update:option1", "value");
    expect(innerChanges).toEqual({option1: "value"});
});

it("subscribes on nested updates in root component", () => {
    const emitStub = jest.fn();
    const innerChanges = {};

    const config: any = {
        name: null
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub,
            $props: {}
        },
        innerChanges
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
    expect(innerChanges).toEqual({widgetOption: "widgetOptionValue"});
});

it("subscribeOnUpdates does'not call update with empty array change", () => {
    const emitStub = jest.fn();
    const innerChanges = {};

    const config: any = {
        name: null
    };

    subscribeOnUpdates(
        config,
        {
            $emit: emitStub,
            $props: {}
        },
        innerChanges
    );
    config.optionChangedFunc({name: "option1", fullName: "option1", value: [], previousValue: []});

    expect(emitStub).toHaveBeenCalledTimes(0);
});

describe("initial configuration", () => {

    it("pulls value from nested", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested
            .createNested("subOption", { prop: 123 })
            .init(["prop"]);

        expect(root.getNestedOptionValues()).toMatchObject({
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

        expect(root.getNestedOptionValues()).toMatchObject({
            options: [
                { propA: 123 }
            ]
        });
    });

    it("pulls array of values from a coollectionItem nested (several values)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("options", { propA: 123 }, true);
        root.createNested("options", { propA: 456, propB: 789 }, true);

        expect(root.getNestedOptionValues()).toMatchObject({
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

        expect(root.getNestedOptionValues()).toMatchObject({
            option: { propA: 456, propB: 789 }
        });
    });

    it("pulls values from self and nested", () => {
        const root = new Configuration(jest.fn(), null, { propA: 123 });

        const nested = root.createNested("option", { propB: 456 });
        nested.createNested("subOption", { propC: 789 });

        expect(root.getNestedOptionValues()).toMatchObject({
            option: {
                propB: 456,
                subOption: {
                    propC: 789
                }
            }
        });
        expect(root.initialValues).toMatchObject({
            propA: 123
        });
    });

    it("pulls empty value for correct option structure T728446", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {}, true);
        nested.createNested("subOption", {});

        expect(root.getNestedOptionValues()).toMatchObject({ option: [{ subOption: {} }]});
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

        expect(root.getNestedOptionValues()).toMatchObject({
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

    describe("expectation of collection item", () => {

        it("applied if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true, optionName: "def" } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });

        it("applied if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true, optionName: "def" } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });

        it("applied if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true,  optionName: "def" } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });
    });

    describe("expected as collection item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeFalsy();
            expect(nested.name).toBe("def");
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
