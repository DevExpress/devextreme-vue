import { VueConstructor } from "vue";
import { BaseComponent } from "./component";

const DxExtensionComponent: VueConstructor = BaseComponent.extend({

    created(): void {
        (this as any).$_isExtension = true;
    },

    methods: {
        attachTo(element: any) {
            (this as any).$_createWidget(element);
        }
    }
});

export { DxExtensionComponent };
