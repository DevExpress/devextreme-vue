import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";

import { IConfigurable } from "../configuration-component";

import DxTextBox from "../../text-box";

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("two-way binding", () => {

    it("v-model works correctly", async (done) => {
        const vm = defineComponent({
            template:
                `<dx-text-box id="component1" v-model="testValue"></dx-text-box>
                 <dx-text-box id="component2" v-model="testValue"></dx-text-box>
                `,
            components: {
                DxTextBox
            },
            data() {
                return {
                    testValue: "value"
                };
            }
        });
        const wrapper = mount(vm);
        const components = wrapper.findAllComponents(DxTextBox);
        const component = components[1].vm as any as IConfigurable;
        component.$_config.updateValue = jest.fn();
        components[0].vm.$emit("update:modelValue", "newValue");
        nextTick(() => {
            expect(component.$_config.updateValue).toBeCalled();
            done();
        });
    });

    it("v-model with argument works correctly", async (done) => {
        const vm = defineComponent({
            template:
                `<dx-text-box id="component1" v-model:value="testValue"></dx-text-box>
                 <dx-text-box id="component2" v-model:value="testValue"></dx-text-box>
                `,
            components: {
                DxTextBox
            },
            props: {
                testValue: String
            }
        });
        const wrapper = mount(vm);
        const component = wrapper.findAllComponents(DxTextBox)[0].vm as any as IConfigurable;
        component.$_config.updateValue = jest.fn();
        wrapper.setProps({ testValue: "test" });
        nextTick(() => {
            expect(component.$_config.updateValue).toBeCalled();
            done();
        });
    });
});
