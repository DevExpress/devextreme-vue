import { BaseComponent, IBaseComponent } from "./component";
import { vueContext } from "./vue-strategy";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent: any = vueContext.create({
    extends: BaseComponent,
    created(): void {
        const vNodeOptions = vueContext.vNodeComponentOptions(this, true);
        if (vNodeOptions) {
            vNodeOptions.$_isExtension = true;
            vNodeOptions.$_componentInstance = this;
        } else {
            this.$_isExtension = true;
        }
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        const componentOptions = vueContext.vNodeComponentOptions(this, false);
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
