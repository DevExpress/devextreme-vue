import { BaseComponent, IBaseComponent } from "./component";
import { IVue, vueContext } from "./vue-strategy";

interface IExtension {
    $_isExtension: boolean;
    $_componentInstance: IVue;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent: any = vueContext.createComponent({
    extends: BaseComponent,
    created(): void {
        vueContext.markAsExtention(this);
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        const componentOptions = vueContext.getNodeOptions(this);
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
