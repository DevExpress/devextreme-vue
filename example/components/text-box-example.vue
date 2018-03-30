<template>
  <example-block title="dxTextBox" :state="$data">

      <h5>v-bind</h5>
      <dx-text-box :value="text" valueChangeEvent="input" />

      <h5>@update:value</h5>
      <dx-text-box @update:value="text = $event" valueChangeEvent="input" />

      <h5 class="dead">@valueChanged</h5>
      <dx-text-box @valueChanged="text = $event.value" valueChangeEvent="input" />

      <h5>:value.sync</h5>
      <dx-text-box :value.sync="text" valueChangeEvent="input" />

      <h5>v-model</h5>
      <dx-text-box v-model="text" valueChangeEvent="input" />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxTextBox } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxTextBox
  },
  data: function() {
    return {
      text: "text"
    };
  }
};
</script>

<style scoped>
h5 {
  font-weight: 900;
  margin-top: 20px;
}
.dead {
  color: red;
}
</style>