<template>
  <example-block title="Validation" >
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
      <dx-button text="Submit" @click="validate" />
    </dx-validation-group>
    <br />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import {
  DxButton,
  DxTextBox,
  DxValidationGroup,
  DxValidationSummary,
  DxValidator
} from "../../src";
import { DxAdapter, DxEmailRule, DxRequiredRule } from "../../src/validator";

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
    DxValidationSummary,
  },
  methods: {
    validate(params) {
      const result = params.validationGroup.validate();
      if (result.isValid) {
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