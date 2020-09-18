import { BaseComponent, IBaseComponent } from "./component";
import { ComponentPublicInstance as IVue, DefineComponent, defineComponent } from "vue";
import { markAsExtention, getNodeOptions } from "./vue-helper";

interface IExtension {
    $_isExtension: boolean;
    $_componentInstance: IVue;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent: DefineComponent = defineComponent({
    extends: BaseComponent,
    created(): void {
        markAsExtention(this);
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        const componentOptions = getNodeOptions(this);
        if (componentOptions && (componentOptions as any as IExtensionComponentNode).$_hasOwner) { return; }

        this.attachTo(this.$el);
    },

    methods: {
        attachTo(element: any) {
            (this as any as IBaseComponent).$_createWidget(element);
        }
    }
});

export {
    DxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
