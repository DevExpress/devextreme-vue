<template>
  <example-block title="Validation" :state="$data">
    <dx-validation-group>
      <dx-text-box value="email@mail.com">
        <dx-validator>
          <dx-required-rule message="Email is required." />
          <dx-email-rule message="Email is invalid." />
        </dx-validator>
      </dx-text-box>
      <br />
      <dx-text-box value="password">
        <dx-validator>
          <dx-required-rule message="Password is required." />
        </dx-validator>
      </dx-text-box>
      <br />
      <dx-validation-summary />
      <dx-button text="Submit" @click="validate"/>
    </dx-validation-group>
    <br/>
    <br/>
    <h3>Custom value validation</h3>
    <br/>
    <div>
      <button @click="validateCustom">Validate custom value</button>
      <input v-model="customValue" />
      <br/>
      <div>
        Custom Value is Valid: {{customValueIsValid}}
      </div>
      <dx-validator ref="customValidator">
        <dx-adapter :get-value="getCustomValue" />
        <dx-required-rule message="Value is required." />
      </dx-validator>
    </div>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxButton, DxTextBox, DxValidationGroup, DxValidationSummary, DxValidator } from "../../src";
import { DxAdapter, DxEmailRule, DxRequiredRule} from "../../src/validator";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxTextBox, 
    DxValidator,
    DxAdapter,
    DxEmailRule,
    DxRequiredRule,
    DxValidationGroup,
    DxValidationSummary
  },
  data() {
    return {
      customValue: 1,
      customValueIsValid: true
    }
  },
  methods: {
    validate(params) {
      const result = params.validationGroup.validate();
      if (result.isValid) {
          // form data is valid
          params.validationGroup.reset();
      }
    },
    getCustomValue() {
      return this.customValue;
    },
    validateCustom() {
      var result = this.$refs.customValidator.instance.validate();
      this.customValueIsValid = result.isValid;
    }
  }
};
</script>

<style scoped>
.text-box-label {
  font-weight: 900;
  margin-top: 20px;
}
</style>