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
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxButton, DxTextBox, DxValidationGroup, DxValidationSummary } from "../../src";
import { DxValidator, DxEmailRule, DxRequiredRule} from "../../src/validator";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxTextBox, 
    DxValidator,
    DxEmailRule,
    DxRequiredRule,
    DxValidationGroup,
    DxValidationSummary
  },
  methods: {
    validate(params) {
      const result = params.validationGroup.validate();
      if (result.isValid) {
          // form data is valid
          params.validationGroup.reset();
      }
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