<template>
    <example-block title="dxButton">
        <dx-button text="clik me"/>
        <dx-button
            text="I'm colored"
            :elementAttr="{ style: 'background-color: #ffc' }"
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxButton } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxButton
  }
};
</script>