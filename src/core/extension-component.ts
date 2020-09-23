import { ComponentPublicInstance as IVue, defineComponent } from "vue";
import { IBaseComponent, initBaseComponent } from "./component";
import { getNodeOptions, getNodeTypeOfComponent } from "./vue-helper";

interface IExtension {
    $_isExtension: boolean;
    $_componentInstance: IVue;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

function initDxExtensionComponent() {
    return defineComponent({
        extends: initBaseComponent(),
        created(): void {
            const nodeOptions = getNodeTypeOfComponent(this);

            nodeOptions.$_isExtension = true;
            nodeOptions.$_componentInstance = this;
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
}

export {
    initDxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
