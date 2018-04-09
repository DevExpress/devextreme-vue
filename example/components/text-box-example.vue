<template>
  <example-block title="dxTextBox" :state="$data">

      <h5 class="text-box-label">v-bind</h5>
      <dx-text-box
        :value="text"
        valueChangeEvent="input"
      />

      <h5 class="text-box-label">@update:value</h5>
      <dx-text-box
        @update:value="text = $event"
        valueChangeEvent="input"
      />

      <h5 class="text-box-label">valueChanged</h5>
      <dx-text-box
        @valueChanged="text = $event.value"
        valueChangeEvent="input"
      />

      <h5 class="text-box-label">:value.sync</h5>
      <dx-text-box
        :value.sync="text"
        valueChangeEvent="input"
      />

      <h5 class="text-box-label">v-model</h5>
      <dx-text-box
        v-model="text"
        valueChangeEvent="input"
      />

      <h5 class="text-box-label">@focusIn (clears text)</h5>
      <dx-text-box
        v-model="text"
        @focusIn="text = ''"
        valueChangeEvent="input"
      />

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
.text-box-label {
  font-weight: 900;
  margin-top: 20px;
}
</style>