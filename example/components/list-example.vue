<template>
    <example-block title="dxList">
        <dx-list 
            :items="listData" 
            :itemTemplate="itemTemplate" 
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "../data";
import { DxList } from "../../src";

export default {
    components: {
        ExampleBlock,
        DxList
    },
    data: function() {
        return {
            listData: orangesByDay
        }
    },
    methods: {
        itemTemplate: function(data, index, element) {
            element.textContent = data.day;
        }
    }
}
</script>