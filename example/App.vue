<template>
    <div>
        <dx-button text="Example button"/>
        <br/>
        <br/>
        <popup-example/>
        <br/>
        <text-box-example/>
    </div>
</template>

<script>

import { Button } from "../src";

import PopupExample from "./components/PopupExample.vue";
import TextBoxExample from "./components/text-box-example";

export default {
    components: {
        "dx-button": Button,
        PopupExample,
        TextBoxExample
    },
    name: "app"
}
</script>
