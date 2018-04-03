<template>
    <example-block title="dxList">
        <h4>List with simple items</h4>
        <dx-list :items="[1, 2, 3, 4]" />
        <br/>
        <h4>List with simple items</h4>
        <dx-list :items="listData">
            <div slot="item" slot-scope="data">
                <i>{{data.day}}</i>
            </div>
        </dx-list>
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