<template>
    <example-block title="dxList">
        <h4>List of simple items</h4>
        <dx-list :items="simpleData" />
        <br/>
        <h4>List with item template</h4>
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
      simpleData: [1, 2, 3, 4],
      listData: orangesByDay
    };
  }
};
</script>