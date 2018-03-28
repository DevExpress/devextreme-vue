import Vue from "vue";
import Component from "vue-class-component";

import * as events from "devextreme/events";

const DX_REMOVE_EVENT = "dxremove";

@Component({
  template: "<div/>"
})
export default class DxComponent extends Vue {
    protected _instance: any;

    public mounted(): void {
        this._instance = this._createWidget(this.$el, this.$options.propsData as any);
    }

    public beforeDestroy(): void {
        events.triggerHandler(this.$el, DX_REMOVE_EVENT);
        this._instance.dispose();
    }

    protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
        return null;
    }
}
