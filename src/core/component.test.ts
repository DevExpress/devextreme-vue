import Vue from "vue";
import { DxComponent, DxExtensionComponent } from "../core/component";
import { DxConfiguration } from "../core/configuration-component";

import * as events from "devextreme/events";

const eventHandlers: { [index: string]: (e?: any) => void}  = {};
const Widget = {
    option: jest.fn(),
    dispose: jest.fn(),
    on: (event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler;
    },
    fire: (event: string, args: any) => {
        if (!eventHandlers[event]) {
            throw new Error(`no handler registered for '${event}'`);
        }
        eventHandlers[event](args);
    }
};

const WidgetClass = jest.fn(() => Widget);
const TestComponent = Vue.extend({
    extends: DxComponent,
    beforeCreate() {
        (this as any).$_WidgetClass = WidgetClass;
    }
});

const TestNestedComponent = Vue.extend({
    extends: DxConfiguration,
    props: {
        prop1: Number,
        prop2: String
    },
    beforeMount() {
        (this as any).$_initOption("nestedOption");
    }
});

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("component rendering", () => {

    it("correctly renders", () => {
        const vm = new TestComponent().$mount();
        expect(vm.$el.outerHTML).toBe("<div></div>");
    });

    it("calls widget creation", () => {
        new TestComponent().$mount();
        expect(WidgetClass).toHaveBeenCalledTimes(1);
    });

    it("creates nested component", () => {
        new Vue({
            template: "<test-component><test-component/></test-component>",
            components: {
                TestComponent
            }
        }).$mount();

        expect(WidgetClass.mock.instances.length).toBe(2);
        expect(WidgetClass.mock.instances[1]).toEqual({});
    });
});

describe("options", () => {

    it("pass props to option on mounting", () => {
        const vm = new TestComponent({
            propsData: {
                sampleProp: "default"
            }
        }).$mount();
        expect(WidgetClass).toHaveBeenCalledWith(vm.$el, {
            sampleProp: "default"
        });
    });

    it("subscribes to optionChanged", () => {
        new TestComponent({
            props: ["sampleProp"]
        }).$mount();

        expect(eventHandlers).toHaveProperty("optionChanged");
    });

    it("watch prop changing", (done) => {
        const vm = new TestComponent({
            props: ["sampleProp"],
            propsData: {
                sampleProp: "default"
            }
        }).$mount();

        vm.$props.sampleProp = "new";
        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            done();
        });
    });
});

describe("nested options", () => {

    it("pulls initital values on mounting (template)", () => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <test-nested-component :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                TestNestedComponent
            }
        }).$mount();

        expect(WidgetClass).toHaveBeenCalledWith(vm.$children[0].$el, {
            nestedOption: {
                prop1: 123
            }
        });
    });

    it("pulls initital values on mounting (render function + createElement)", () => {
        const widget = new TestComponent({
            render(createElement) {
                return createElement(TestNestedComponent, { props: { prop1: 123 } });
            }
        }).$mount();

        expect(WidgetClass).toHaveBeenCalledWith(widget.$el, {
            nestedOption: {
                prop1: 123
            }
        });
    });

    it("pulls initital values on mounting (manual mounting)", () => {
        const widget = new TestComponent();
        const option = new TestNestedComponent({
            propsData: {
                prop1: 123
            },
            parent: widget
        });

        option.$mount();
        widget.$mount();

        expect(WidgetClass).toHaveBeenCalledWith(widget.$el, {
            nestedOption: {
                prop1: 123
            }
        });
    });

    it("watches nested option changes", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <test-nested-component :prop1="value" />` +
                `</test-component>`,
            components: {
                TestComponent,
                TestNestedComponent
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.prop1", 456);
            done();
        });
    });

});

describe("template", () => {

    const DX_TEMPLATE_WRAPPER = "dx-template-wrapper";

    function renderItemTemplate(model?: object, container?: any): Element {
        model = model || {};
        container = container || document.createElement("div");
        const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;
        return render({
            container,
            model
        });
    }

    it("passes integrationOptions to widget", () => {
        new Vue({
            template: `<test-component>
                         <div slot='item' slot-scope='data'>1</div>
                         <div slot='content'>1</div>
                         <div>1</div>
                       </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();

        expect(integrationOptions.templates.item).toBeDefined();
        expect(typeof integrationOptions.templates.item.render).toBe("function");

        expect(integrationOptions.templates.content).toBeDefined();
        expect(typeof integrationOptions.templates.content.render).toBe("function");

        expect(integrationOptions.templates.default).toBeUndefined();
    });

    it("renders", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item'>Template</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate();

        expect(renderedTemplate.nodeName).toBe("DIV");
        expect(renderedTemplate.className).toBe(DX_TEMPLATE_WRAPPER);
        expect(renderedTemplate.innerHTML).toBe("Template");
    });

    it("renders scoped slot", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({ text: "with data" });
        expect(renderedTemplate.innerHTML).toBe("Template with data");
    });

    it("adds templates as children", () => {
        const vm = new Vue({
            template: `<test-component ref="component">
                            <div slot='item' slot-scope='props'>Template</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        renderItemTemplate({});

        const component: any = vm.$refs.component;
        expect(component.$children.length).toBe(1);
    });

    it("unwraps container", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate(
            { text: "with data" },
            { get: () => document.createElement("div") }
        );

        expect(renderedTemplate.nodeName).toBe("DIV");
        expect(renderedTemplate.innerHTML).toBe("Template with data");
    });

    it("preserves classes", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props' class='custom-class'></div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({});

        expect(renderedTemplate.className).toBe(`custom-class ${DX_TEMPLATE_WRAPPER}`);
    });

    it("preserves custom-attrs", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props' custom-attr=123 ></div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({});

        expect(renderedTemplate.attributes).toHaveProperty("custom-attr");
        expect(renderedTemplate.attributes["custom-attr"].value).toBe("123");
    });

    it("doesn't throw on dxremove", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();

        const renderedTemplate = renderItemTemplate({ text: "with data" });

        expect(() => events.triggerHandler(renderedTemplate, "dxremove")).not.toThrow();
    });
});

describe("events emitting", () => {

    it("forwards DevExtreme events in camelCase", () => {
        const expectedArgs = {};
        const parent = new Vue({
            template: "<TestComponent v-on:testEventName=''></TestComponent>",
            components: { TestComponent }
        }).$mount();
        const $emitSpy = jest.spyOn(parent.$children[0], "$emit");

        Widget.fire("testEventName", expectedArgs);

        expect($emitSpy).toHaveBeenCalledTimes(1);
        expect($emitSpy.mock.calls[0][0]).toBe("testEventName");
        expect($emitSpy.mock.calls[0][1]).toBe(expectedArgs);
    });

    it("forwards DevExtreme events in kebab-case", () => {
        const expectedArgs = {};
        const parent = new Vue({
            template: "<TestComponent v-on:test-event-name=''></TestComponent>",
            components: { TestComponent }
        }).$mount();
        const $emitSpy = jest.spyOn(parent.$children[0], "$emit");

        Widget.fire("testEventName", expectedArgs);

        expect($emitSpy).toHaveBeenCalledTimes(1);
        expect($emitSpy.mock.calls[0][0]).toBe("test-event-name");
        expect($emitSpy.mock.calls[0][1]).toBe(expectedArgs);
    });
});

describe("extension component", () => {
    const ExtensionWidgetClass = jest.fn(() => Widget);
    const TestExtensionComponent = Vue.extend({
        extends: DxExtensionComponent,
        beforeCreate() {
            (this as any).$_WidgetClass = ExtensionWidgetClass;
        }
    });

    it("doesn't render", () => {
        new TestExtensionComponent().$mount();

        expect(ExtensionWidgetClass).toHaveBeenCalledTimes(0);
    });

    it("destroys correctly", () => {
        const component = new TestExtensionComponent().$mount();

        expect(component.$destroy.bind(component)).not.toThrow();
    });

    it("renders inside component on parent element", () => {
        new Vue({
            template: `<test-component>
                            <test-extension-component/>
                        </test-component>`,
            components: {
                TestComponent,
                TestExtensionComponent
            }
        }).$mount();

        expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
        expect(ExtensionWidgetClass.mock.calls[0][0]).toBe(WidgetClass.mock.calls[0][0]);
    });
});

describe("disposing", () => {

    it("call dispose", () => {
        const component = new TestComponent().$mount();

        component.$destroy();

        expect(Widget.dispose).toBeCalled();
    });

    it("fires dxremove", () => {
        const handleDxRemove = jest.fn();
        const component = new TestComponent().$mount();

        events.on(component.$el, "dxremove", handleDxRemove);
        component.$destroy();

        expect(handleDxRemove).toHaveBeenCalledTimes(1);
    });

    it("destroys correctly", () => {
        const component = new TestComponent();

        expect(component.$destroy.bind(component)).not.toThrow();
    });
});
