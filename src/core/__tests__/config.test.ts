import { mount } from "@vue/test-utils";
import { DxComponent, IWidgetComponent } from "../component";
import config, { getOption } from "../config";
import { defineComponent } from "vue";

const Widget = {
    option: jest.fn(),
    dispose: jest.fn(),
    on: jest.fn(),
    fire: jest.fn(),
    beginUpdate: jest.fn(),
    endUpdate: jest.fn(),
};

const WidgetClass = jest.fn(() => Widget);

const TestComponent = defineComponent({
    extends: DxComponent,
    beforeCreate() {
        (this as any as IWidgetComponent).$_WidgetClass = WidgetClass;
    }
});

describe("useLegacyTemplateEngine", () => {
    const originalValue = getOption("useLegacyTemplateEngine");

    beforeEach(() => {
        config({ useLegacyTemplateEngine: true });
    });

    afterEach(() => {
        config({ useLegacyTemplateEngine: originalValue });
    });

    it("has model as scope", () => {
        mount(defineComponent({
            template: `<test-component>
                          <template #item="{text}">
                            <div>Template {{text}}</div>
                          </template>
                        </test-component>`,
            components: {
                TestComponent
            }
        }));

        const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;
        const renderedTemplate = render({
            container: document.createElement("div"),
            model: { text: "with data" },
            index: 4
        });

        expect(renderedTemplate.innerHTML).toBe("Template with data");
    });
});
