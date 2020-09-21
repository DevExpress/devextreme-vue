import { VueConstructor } from "vue";
import { initBaseComponent } from "./component";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

function initDxExtensionComponent(): VueConstructor {
    return initBaseComponent().extend({
        created(): void {
            this.$_isExtension = true;
        },

        mounted() {
            this.$el.setAttribute("isExtension", "true");
            if (this.$vnode && (this.$vnode.componentOptions as any as IExtensionComponentNode).$_hasOwner) { return; }

            this.attachTo(this.$el);
        },

        methods: {
            attachTo(element: any) {
                this.$_createWidget(element);
            }
        }
    });
}

export {
    initDxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
