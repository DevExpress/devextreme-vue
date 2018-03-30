<template>
    <example-block title="dxList">
        <list 
            :items="listData"
            :itemTemplate="itemTemplate"
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "./data";
import { List } from "../../src";


export default {
    components: {
        ExampleBlock,
        List
    },
    data: function() {
        return {
            listData: orangesByDay,
            itemTemplate: function(data, index, element) {
                element.textContent = data.day;
            }
        }
    }
}
</script>