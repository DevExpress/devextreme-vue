<template>
    <example-block title="dxButton">
        <dx-button text="clik me"/>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { Button as DxButton } from "../../src";

export default {
  components: {
      ExampleBlock,
      DxButton
  }
}
</script>