<template>
  <example-block title="Validation" :state="$data">
    <dx-validation-group>
      <dx-text-box value="email@mail.com">
        <dx-validator :validationRules="validationRules.email" />
      </dx-text-box>
      <br />
      <dx-text-box value="password">
        <dx-validator :validationRules="validationRules.password" />
      </dx-text-box>
      <br />
      <dx-validation-summary />
      <dx-button text="Submit" @click="validate"/>
    </dx-validation-group>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxButton, DxTextBox, DxValidator, DxValidationGroup, DxValidationSummary } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxTextBox, 
    DxValidator,
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
  },
  data: function() {
    return {
      validationRules: {
        email: [
            { type: "required", message: "Email is required." },
            { type: "email", message: "Email is invalid." }
        ],
        password: [
            { type: "required", message: "Password is required." }
        ]
    }};
  }
};
</script>

<style scoped>
.text-box-label {
  font-weight: 900;
  margin-top: 20px;
}
</style>