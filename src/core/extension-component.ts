import { VueConstructor } from "vue";
import { BaseComponent } from "./component";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionTarget {
    $_isExtensionTarget: boolean;
}

const DxExtensionComponent: VueConstructor = BaseComponent.extend({

    created(): void {
        (this as any).$_isExtension = true;
    },

    mounted() {
        if (this.$parent && (this.$parent as any as IExtensionTarget).$_isExtensionTarget) { return; }

        this.attachTo(this.$el);
    },

    methods: {
        attachTo(element: any) {
            (this as any).$_createWidget(element);
        }
    }
});

export {
    DxExtensionComponent,
    IExtension,
    IExtensionTarget
};
