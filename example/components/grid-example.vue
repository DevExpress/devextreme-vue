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
      <div>
        Country Sort Order:&nbsp;
        <dx-switch
          :value.sync="countrySortOrderVal"
          offText="desc"
          onText="asc"
        />
      </div>
      <dx-data-grid 
          :dataSource="sales"
          keyExpr="orderId"
          :allowColumnReordering="true"
          :rowAlternationEnabled="alternateRowColors"
          :selectedRowKeys="selectedRowKeys"
      >

        <dx-filter-row :visible="filterRowVisible" />
        <dx-group-panel :visible="true" />
        <dx-grouping :autoExpandAll="true" />
        <dx-selection mode="multiple" />

        <dx-column
          dataField="orderId"
          caption="Order ID"
          :allowSorting="false"
          :allowFiltering="false"
          :allowGrouping="false"
          :allowReordering="false"
          :width="100"
        />
        <dx-column
          dataField="city"
          cellTemplate="cell-city"
        />
        <dx-column
          dataField="country"
          :sortOrder="countrySortOrder"
        />
        <dx-column
          dataField="region"
          :groupIndex="0"
        />
        <dx-column
          dataField="date"
          dataType="date"
          selectedFilterOperation=">="
          filterValue="2013/04/01"
          :width="150"
        />
        <dx-column
          dataField="amount"
          format="currency"
          selectedFilterOperation=">="
          :filterValue="1000"
          :width="100"
        />

        <dx-pager :visible="true" :showPageSizeSelector="true" />
        <dx-paging :pageSize="10"/>

        <dx-button slot="cell-city" slot-scope="data" :text="data.text" />
      </dx-data-grid>
    </example-block>
</template>

<script>
import Vue from "vue";

import ExampleBlock from "./example-block";
import { DxButton, DxCheckBox, DxDataGrid, DxSwitch } from "../../src";
import {
  DxColumn,
  DxFilterRow,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSelection
} from "../../src/ui/data-grid";

import { sales } from "../data";

const selectedKeys = [10273, 10277, 10292, 10295, 10300, 10302, 10305, 10308, 10312, 
10319, 10321, 10323, 10326, 10328, 10331, 10334, 10335, 10341, 10351, 10353, 10356, 
10362, 10367, 10373, 10376, 10383, 10387];

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxCheckBox,
    DxDataGrid,
    DxSwitch,
    DxColumn,
    DxFilterRow,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSelection
  },
  computed: {
    countrySortOrder() {
      return this.countrySortOrderVal ? "asc" : "desc";
    }
  },
  data: function() {
    return {
      sales: sales,
      selectedRowKeys: selectedKeys,
      alternateRowColors: true,
      filterRowVisible: true,
      countrySortOrderVal: true
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
