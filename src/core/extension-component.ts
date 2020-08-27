import { VueConstructor } from "vue";
import { IBaseComponent } from "./component";
import { ComponentManager } from "./vue-strategy/component-manager";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent: VueConstructor = ComponentManager.create({
    created(): void {
        this.$_isExtension = true;
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        const componentOptions = ComponentManager.getVNodeOptions(this);
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
