import Vue from "vue";
import VueComponent from "vue-class-component";
import BaseComponent from "../core/component";

const createWidgetMock = jest.fn();

@VueComponent({
    mixins: [BaseComponent]
})
class TestComponent extends Vue {
    protected _createWidget(): any {
        createWidgetMock();
    }
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("component rendering", () => {

    it("correctly renders", () => {
        const vm = new Vue(TestComponent).$mount();
        expect(vm.$el.outerHTML).toBe("<div></div>");
    });

    it("calls widget creation", () => {
        new Vue(TestComponent).$mount();
        expect(createWidgetMock).toHaveBeenCalledTimes(2);
    });
});
