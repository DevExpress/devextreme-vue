<template>
  <example-block title="dxButton">
    <dx-button
    text="click me"
    v-on:click="greet" />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxButton } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxButton
  },
  methods: {
    greet: function () {
      alert("Hello!");
    }
  }
};
</script>

<style scoped>
.test {
  padding: 10px;
  border: 1px solid black;
  display: inline-block;
}
</style>
