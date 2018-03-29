<template>
    <div>
        <dx-text-box :value="text" :onValueChanged="handleTextUpdate" valueChangeEvent="input" />
        <br />
        <dx-button text="Show popup" :onClick="handleClick" />
        <dx-popup :visible.sync="visible" width="600" height="400"/>
    </div>
</template>

<script>
import { Button } from "../../src/ui/button";
import { Popup } from "../../src/ui/popup";
import { ScrollView } from "../../src/ui/scroll-view";
import { TextBox } from "../../src/ui/text-box";

export default {
    components: {
        "dx-button": Button,
        "dx-popup": Popup,
        "dx-scroll-view": ScrollView,
        "dx-text-box": TextBox
    },
    data: function() {
        return {
            text: "not-good",
            handleTextUpdate: (e) => { this.updateText(e.value); },
            handleClick: () => { this.toggle(true); },
            visible: false
        }
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
}
</script>