import Vue from "vue";
import VueComponent from "vue-class-component";
import BaseComponent from "../core/component";

import * as events from "devextreme/events";

const Widget = {
    option: jest.fn(),
    dispose: jest.fn()
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
