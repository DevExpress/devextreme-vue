<template>
    <example-block title="dxPopup">
        <dx-text-box :value="text" :onValueChanged="handleTextUpdate" valueChangeEvent="input" />
        <br />
        <dx-button text="Show popup" :onClick="handleClick" />
        <dx-popup :visible.sync="visible" width="600" height="400"/>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import {
  DxButton,
  DxPopup,
  DxTextBox
} from "../../src";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxPopup,
    DxTextBox
  },
  data: function() {
    return {
      text: "not-good",
      handleTextUpdate: e => {
        this.updateText(e.value);
      },
      handleClick: () => {
        this.toggle(true);
      },
      visible: false
    };
  },
  methods: {
    updateText: function(value) {
      this.text = value;
    },
    toggle: function(value) {
      this.visible = value;
    }
  },
  name: "popup-example"
};
</script>