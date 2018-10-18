<template>
    <example-block title="dxList">
        <h4>List of simple items</h4>
        <dx-list :items="simpleData" />
        <br/>
        <dx-text-box v-model="item"/>
        <dx-button text="Add" @click="add"/>

        <h4>List with item template</h4>
        <dx-list :items="listData">
            <div slot="item" slot-scope="data">
                <i>{{data.day}}</i>
            </div>
            <div slot="weekend" slot-scope="data">
                <i>{{data.day}}</i>
            </div>
        </dx-list>
        <br/>
        <h4>List with several templates</h4>
        <dx-list 
          itemTemplate="weekday"
          :items="listData"
        >
            <div slot="weekday" slot-scope="data">
                <s>{{data.day}}</s>
            </div>
            <div slot="weekend" slot-scope="data">
                <b>{{data.day}}</b>
            </div>
        </dx-list>
        <br/>
        <dx-button text="Toggle Weekend" @click="toggleWeekend"/>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "../data";
import { DxButton, DxList, DxTextBox } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxList,
    DxTextBox
  },
  data: function() {
    return {
      item: "",
      simpleData: [1, 2, 3, 4],
      listData: orangesByDay
    };
  },
  methods: {
      add() {
          if (this.item) {
            this.simpleData.push(this.item)
            this.item = "";
          }
      },
      toggleWeekend() {
          this.listData[5].disabled = !this.listData[5].disabled;
          this.listData[6].disabled = !this.listData[6].disabled;
      }
  }
};
</script>