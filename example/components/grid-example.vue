<template>
    <example-block title="dxDataGrid">
      <div class="flex-container">
        <dx-check-box 
          v-model="alternateRowColors" 
          text="Alternate Row Colors"
        />
        <dx-check-box 
          v-model="filterRowVisible" 
          text="Filter Row Visible"
        />
      </div>
      <dx-data-grid 
          :dataSource="sales"
          keyExpr="orderId"
          :rowAlternationEnabled="alternateRowColors"
          :allowColumnReordering="true"
          :grouping="grouping"
          :groupPanel="groupPanel"
          :paging="paging"
          :selection="selection"
          :filterRow="filterRow"
          :selectedRowKeys="selectedRowKeys"
          :columns="columns"
      >
        <dx-pager :visible="true" :showPageSizeSelector="true" />
        <dx-button slot="cell-city" slot-scope="data" :text="data.text" />
      </dx-data-grid>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { sales } from "../data";
import { DxDataGrid, DxButton, DxCheckBox } from "../../src";
import { DxPager } from "../../src/ui/data-grid";
import Vue from "vue";

const selectedKeys = [10273, 10277, 10292, 10295, 10300, 10302, 10305, 10308, 10312, 
10319, 10321, 10323, 10326, 10328, 10331, 10334, 10335, 10341, 10351, 10353, 10356, 
10362, 10367, 10373, 10376, 10383, 10387];

export default {
  components: {
    ExampleBlock,
    DxDataGrid,
    DxButton,
    DxCheckBox,
    DxPager
  },
  computed: {
    filterRow() {
      return { visible: this.filterRowVisible };
    }
  },
  data: function() {
    return {
      sales: sales,
      alternateRowColors: true,
      selectedRowKeys: selectedKeys,
      grouping: { autoExpandAll: true },
      filterRowVisible: true,
      groupPanel: { visible: true },
      paging: { pageSize: 10 },
      selection: { mode: 'multiple' },
      columns: [
        {
          dataField: "orderId",
          caption: "Order ID",
          allowSorting: false,
          allowFiltering: false,
          allowGrouping: false,
          allowReordering: false,
          width: 100
        },
        {
          dataField: "city",
          cellTemplate: "cell-city"
        },
        {
          dataField: "country",
          sortOrder: "asc"
        },
        {
          dataField: "region",
          groupIndex: 0
        },
        {
          dataField: "date",
          dataType: "date",
          selectedFilterOperation: ">=",
          filterValue: "2013/04/01",
          width: 150
        },
        {
          dataField: "amount",
          format: "currency",
          selectedFilterOperation: ">=",
          filterValue: 1000,
          width: 100
        }
      ]
    };
  }
};
</script>

<style scoped>
  .flex-container {
    display: flex;
    flex-direction: row;
  }
</style>
