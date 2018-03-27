import Vue from "vue";
import VueComponent from "vue-class-component";
import BaseComponent from "../core/component";

const createWidgetMock = jest.fn();

@VueComponent({
    mixins: [BaseComponent]
})
class TestComponent extends Vue {
    protected _createWidget(element: HTMLElement, props: any): any {
        createWidgetMock(element, props);
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
        expect(createWidgetMock).toHaveBeenCalledTimes(1);
    });
});

describe("option processing", () => {
    it("pass props to option on mounting", () => {
        const vm = new TestComponent({
            propsData: {
                sampleProp: "default"
            }
        }).$mount();
        expect(createWidgetMock).toHaveBeenCalledWith(vm.$el, {
            sampleProp: "default"
        });
    });
});
