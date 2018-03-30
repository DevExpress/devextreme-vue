<template>
    <div>
        <button-example/>
        <br/>
        <popup-example/>
        <br/>
        <text-box-example/>
        <br/>
        <grid-example/>
    </div>
</template>

<script>

import ButtonExample from "./components/button-example";
import GridExample from "./components/grid-example";
import PopupExample from "./components/popup-example";
import TextBoxExample from "./components/text-box-example";

export default {
    components: {
        ButtonExample,
        PopupExample,
        TextBoxExample,
        GridExample
    },
    name: "app"
}
</script>
