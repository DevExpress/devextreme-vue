<template>
    <div>
        <dx-button text="Example button"/>
        <br/>
        <br/>
        <popup-example/>
    </div>
</template>

<script>

import { Button } from "../src";


import PopupExample from "./components/PopupExample.vue";


export default {
    components: {
        "dx-button": Button,
        PopupExample
    },
    name: "app"
}
</script>
