import "../../__mocks__/version";
// import * as VueType from "vue";
import { DxComponent, IWidgetComponent } from "../../component";
// import { createApp } from "vue";
import { vueContext } from "../../vue-strategy/component-manager";
jest.mock('../../vue-strategy/version', () => ({ isVue3: jest.fn(() => true)}));
import { mount } from "@vue/test-utils";
// import { nextTick } from "vue";
import { DxConfiguration, IConfigurable } from "../../configuration-component";

// import { DxExtensionComponent } from "../../extension-component";

// import * as events from "devextreme/events";

// import { mount } from "@vue/test-utils";

const eventHandlers = {};
const Widget = {
    option: jest.fn(),
    resetOption: jest.fn(),
    dispose: jest.fn(),
    on: (event, handler) => {
        eventHandlers[event] = handler;
    },
    fire: (event, args) => {
        if (!eventHandlers[event]) {
            throw new Error(`no handler registered for '${event}'`);
        }
        eventHandlers[event](args);
    },
    beginUpdate: jest.fn(),
    endUpdate: jest.fn(),
};

function createWidget(_, options) {
    if (options.onInitializing) {
        options.onInitializing.call(Widget);
    }
    return Widget;
}
const WidgetClass = jest.fn(createWidget);

const TestComponent = vueContext.create({
    extends: DxComponent,
    beforeCreate() {
        this.$_WidgetClass = WidgetClass;
    },
    props: {
        prop1: Number,
        sampleProp: String
    },
    model: {
        prop: "prop1",
        event: "update:prop1"
    }
});

function skipIntegrationOptions(options: {
    integrationOptions: object,
    onInitializing: () => void,
    ref: string
}): Record<string, any> {
    const result = {...options };
    delete result.integrationOptions;
    delete result.onInitializing;
    delete result.ref;
    return result;
}

function buildTestConfigCtor(): any {
    return vueContext.create({
        extends: DxConfiguration,
        props: {
            prop1: Number,
            prop2: String
        }
    });
}

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("component rendering", () => {

    it("correctly renders", () => {
        const wrapper = mount(TestComponent);
        
        expect(wrapper.html()).toBe("<div attrs=\"[object Object]\"></div>");
    });

    it("calls widget creation", () => {
        mount(TestComponent);
        expect(WidgetClass).toHaveBeenCalledTimes(1);
        expect(Widget.beginUpdate).toHaveBeenCalledTimes(1);
        expect(Widget.endUpdate).toHaveBeenCalledTimes(1);
    });

    it("passes id to element", () => {
        const vm = vueContext.create({
            template: "<test-component id='my-id'/>",
            components: {
                TestComponent
            }
        });
        const wrapper = mount(vm);
        expect(wrapper.element.id).toBe("my-id");
    });

    it("creates nested component", () => {
        mount(vueContext.create({
            template: "<test-component><test-component/></test-component>",
            components: {
                TestComponent
            }
        }));

        expect(WidgetClass.mock.instances.length).toBe(2);
        expect(WidgetClass.mock.instances[1]).toEqual({});
    });

    describe("options", () => {

        it("pass props to option on mounting", () => {
            const wrapper = mount(TestComponent, {
                props: {
                    sampleProp: "default"
                }
            });
    
            expect(WidgetClass.mock.calls[0][0]).toBe(wrapper.element);
    
            expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
                sampleProp: "default"
            });
        });
    
        it("subscribes to optionChanged", () => {
            mount(TestComponent, {
                props: {
                    sampleProp: "default"
                }
            });
    
            expect(eventHandlers).toHaveProperty("optionChanged");
        });
    
        it("watch prop changing", async () => {
            const wrapper = mount(TestComponent, {
                props: {
                    sampleProp: "default"
                }
            });
            await wrapper.setProps({ sampleProp: "new" });
    
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("sampleProp", "new");
        });
    
    });

    describe("configuration", () => {

        const Nested = buildTestConfigCtor();
        (Nested as any).$_optionName = "nestedOption";
    
        it("creates configuration", () => {
            const wrapper = mount(TestComponent);
    
            expect((wrapper.vm as any as IConfigurable).$_config).not.toBeNull();
        });
    
        it("updates pendingOptions from a widget component configuration updateFunc", () => {
            const wrapper = mount(TestComponent);
    
            const pendingOptions = (wrapper.vm as any as IWidgetComponent).$_pendingOptions;
    
            const name = "abc";
            const value = {};
    
            (wrapper.vm as any as IConfigurable).$_config.updateFunc(name, value);
            expect(pendingOptions[name]).toEqual(value);
        });
    
        it("initializes nested config", () => {
            const vm = vueContext.create({
                template:
                    `<test-component id="component1">` +
                    `  <nested :prop1="123" />` +
                    `</test-component>`,
                components: {
                    TestComponent,
                    Nested
                }
            });

            const wrapper = mount(vm);


    
            const config = (wrapper.vm.$slots[0] as any as IConfigurable).$_config;
            expect(config.nested).toHaveLength(1);
            expect(config.nested[0].name).toBe("nestedOption");
            expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
            expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
            expect(config.nested[0].isCollectionItem).toBeFalsy();
        });
    
        // it("initializes nested config (collectionItem)", () => {
        //     const nestedCollectionItem = buildTestConfigCtor();
        //     (nestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        //     (nestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested-collection-item :prop1="123" />` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             nestedCollectionItem
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     expect(config.nested).toHaveLength(1);
        //     expect(config.nested[0].name).toBe("nestedOption");
        //     expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
        //     expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
        //     expect(config.nested[0].isCollectionItem).toBeTruthy();
        //     expect(config.nested[0].collectionItemIndex).toBe(0);
        // });
    
        // it("initializes nested config (several collectionItems)", () => {
        //     const nestedCollectionItem = buildTestConfigCtor();
        //     (nestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        //     (nestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested-collection-item :prop1="123" />` +
        //             `  <nested-collection-item :prop1="456" prop2="abc" />` +
        //             `  <nested-collection-item prop2="def" />` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             nestedCollectionItem
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     expect(config.nested).toHaveLength(3);
    
        //     expect(config.nested[0].name).toBe("nestedOption");
        //     expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
        //     expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
        //     expect(config.nested[0].isCollectionItem).toBeTruthy();
        //     expect(config.nested[0].collectionItemIndex).toBe(0);
    
        //     expect(config.nested[1].name).toBe("nestedOption");
        //     expect(config.nested[1].options).toEqual(["prop1", "prop2"]);
        //     expect(config.nested[1].initialValues).toEqual({ prop1: 456, prop2: "abc" });
        //     expect(config.nested[1].isCollectionItem).toBeTruthy();
        //     expect(config.nested[1].collectionItemIndex).toBe(1);
    
        //     expect(config.nested[2].name).toBe("nestedOption");
        //     expect(config.nested[2].options).toEqual(["prop1", "prop2"]);
        //     expect(config.nested[2].initialValues).toEqual({ prop2: "def" });
        //     expect(config.nested[2].isCollectionItem).toBeTruthy();
        //     expect(config.nested[2].collectionItemIndex).toBe(2);
        // });
    
        // it("initializes nested config predefined prop", () => {
        //     const predefinedValue = {};
        //     const NestedWithPredefined = buildTestConfigCtor();
        //     (NestedWithPredefined as any as IConfigurationComponent).$_optionName = "nestedOption";
        //     (NestedWithPredefined as any as IConfigurationComponent).$_predefinedProps = {
        //         predefinedProp: predefinedValue
        //     };
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested-with-predefined />` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             NestedWithPredefined
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     const initialValues = config.getNestedOptionValues();
        //     expect(initialValues).toHaveProperty("nestedOption");
        //     expect(initialValues!.nestedOption).toHaveProperty("predefinedProp");
        //     expect(initialValues!.nestedOption!.predefinedProp).toBe(predefinedValue);
        // });
    
        // it("initializes sub-nested config", () => {
        //     const subNested = buildTestConfigCtor();
        //     (subNested as any as IConfigurationComponent).$_optionName = "subNestedOption";
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested :prop1="123">` +
        //             `    <sub-nested prop2="abc"/>` +
        //             `  </nested>` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             Nested,
        //             subNested
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     expect(config.nested).toHaveLength(1);
    
        //     const nestedConfig = config.nested[0];
        //     expect(nestedConfig.nested).toHaveLength(1);
    
        //     expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        //     expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        //     expect(nestedConfig.nested[0].initialValues).toEqual({ prop2: "abc" });
        //     expect(nestedConfig.nested[0].isCollectionItem).toBeFalsy();
        // });
    
        // it("initializes sub-nested config (collectionItem)", () => {
        //     const nestedCollectionItem = buildTestConfigCtor();
        //     (nestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        //     (nestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested>` +
        //             `    <nested-collection-item :prop1="123"/>` +
        //             `  </nested>` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             Nested,
        //             nestedCollectionItem
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     expect(config.nested).toHaveLength(1);
    
        //     const nestedConfig = config.nested[0];
        //     expect(nestedConfig.nested).toHaveLength(1);
    
        //     expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        //     expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        //     expect(nestedConfig.nested[0].initialValues).toEqual({ prop1: 123 });
        //     expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
        //     expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);
        // });
    
        // it("initializes sub-nested config (multiple collectionItems)", () => {
        //     const nestedCollectionItem = buildTestConfigCtor();
        //     (nestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        //     (nestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
    
        //     const vm = new Vue({
        //         template:
        //             `<test-component>` +
        //             `  <nested>` +
        //             `    <nested-collection-item :prop1="123" />` +
        //             `    <nested-collection-item :prop1="456" prop2="abc" />` +
        //             `    <nested-collection-item prop2="def" />` +
        //             `  </nested>` +
        //             `</test-component>`,
        //         components: {
        //             TestComponent,
        //             Nested,
        //             nestedCollectionItem
        //         }
        //     }).$mount();
    
        //     const config = (vm.$children[0] as any as IConfigurable).$_config;
        //     expect(config.nested).toHaveLength(1);
    
        //     const nestedConfig = config.nested[0];
        //     expect(nestedConfig.nested).toHaveLength(3);
    
        //     expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        //     expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        //     expect(nestedConfig.nested[0].initialValues).toEqual({ prop1: 123 });
        //     expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
        //     expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);
    
        //     expect(nestedConfig.nested[1].name).toBe("subNestedOption");
        //     expect(nestedConfig.nested[1].options).toEqual(["prop1", "prop2"]);
        //     expect(nestedConfig.nested[1].initialValues).toEqual({ prop1: 456, prop2: "abc" });
        //     expect(nestedConfig.nested[1].isCollectionItem).toBeTruthy();
        //     expect(nestedConfig.nested[1].collectionItemIndex).toBe(1);
    
        //     expect(nestedConfig.nested[2].name).toBe("subNestedOption");
        //     expect(nestedConfig.nested[2].options).toEqual(["prop1", "prop2"]);
        //     expect(nestedConfig.nested[2].initialValues).toEqual({ prop2: "def" });
        //     expect(nestedConfig.nested[2].isCollectionItem).toBeTruthy();
        //     expect(nestedConfig.nested[2].collectionItemIndex).toBe(2);
        // });
    
        // describe("expectedChildren", () => {
    
        //     it("initialized for widget component", () => {
        //         const expected = {};
    
        //         const WidgetComponent = Vue.extend({
        //             extends: DxComponent,
        //             beforeCreate() {
        //                 (this as any as IWidgetComponent).$_WidgetClass = WidgetClass;
        //                 (this as any as IWidgetComponent).$_expectedChildren = expected;
        //             }
        //         });
    
        //         const vm = new WidgetComponent();
    
        //         expect((vm as IWidgetComponent).$_config.expectedChildren).toBe(expected);
        //     });
    
        //     it("initialized for config component", () => {
        //         const expected = {};
    
        //         const ConfigComponent = buildTestConfigCtor();
        //         (ConfigComponent as any as IConfigurationComponent).$_optionName = "nestedOption";
        //         (ConfigComponent as any as IConfigurationComponent).$_expectedChildren = expected;
    
        //         const vm = new Vue({
        //             template:
        //                 `<test-component>` +
        //                 `  <config-component />` +
        //                 `</test-component>`,
        //             components: {
        //                 TestComponent,
        //                 ConfigComponent
        //             }
        //         }).$mount();
    
        //         const widgetConfig = (vm.$children[0] as any as IConfigurable).$_config;
        //         expect(widgetConfig.nested[0].expectedChildren).toBe(expected);
        //     });
        // });
    
    });
});
