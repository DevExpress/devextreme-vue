import Vue from "vue";
import BaseComponent from "../core/component";

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
    extends: BaseComponent,
    beforeCreate() {
        (this as any).$_WidgetClass = WidgetClass;
    }
});

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

describe("option processing", () => {
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

describe("template", () => {

    const DX_TEMPLATE_WRAPPER = "dx-template-wrapper";

    function renderItemTemplate(model: object, container: any = null): Element {
        const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;
        return render({
            container: container || document.createElement("div"),
            model
        });
    }

    it("passes integrationOptions to widget", () => {
        new Vue({
            template: "<test-component><div slot='item' slot-scope='data'>1</div></test-component>",
            components: {
                TestComponent
            }
        }).$mount();
        const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();
        expect(integrationOptions.templates.item).toBeDefined();
        expect(typeof integrationOptions.templates.item.render).toBe("function");
    });

    it("renders", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({ text: "with data" });

        expect(renderedTemplate.nodeName).toBe("DIV");
        expect(renderedTemplate.className).toBe(DX_TEMPLATE_WRAPPER);
        expect(renderedTemplate.innerHTML).toBe("Template with data");
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
});
