<template>
  <div>
      <h4>standard input</h4>
      <input v-model='text' />

      <h4 class='alive'>v-bind</h4>
      <text-box :value='text' valueChangeEvent='input' />

      <h4 class='dead'>v-on:valueChanged</h4>
      <text-box @valueChanged='text = $event.value' valueChangeEvent='input' />

      <h4 class='alive'>v-on:update:value</h4>
      <text-box @update:value='text = $event' valueChangeEvent='input' />

      <h4 class='alive'>:value.sync</h4>
      <text-box :value.sync='text' valueChangeEvent='input' />

      <h4 class='dead'>v-model</h4>
      <text-box v-model='text' valueChangeEvent='input' />
  </div>
</template>
<script>
import { TextBox } from "../../src";
export default {
  components: {
    TextBox
  },
  data: function() {
    return {
      text: "text"
    };
  }
};
</script>
<style scoped>
h4 {
  font-weight: 900;
}
.dead {
  color: red;
}
.alive {
  color: blue;
}
</style>

