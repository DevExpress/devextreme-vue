import Vue from "vue";
import VueComponent from "vue-class-component";
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

@VueComponent({
    mixins: [BaseComponent]
})
class TestComponent extends Vue {
    protected _createWidget(element: HTMLElement, props: any): any {
        return new WidgetClass(element, props);
    }
}

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

describe("events emitting", () => {

    it("forwards DevExtreme events", () => {
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
