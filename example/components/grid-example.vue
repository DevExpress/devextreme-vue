<template>
    <example-block title="dxDataGrid">
        <dx-data-grid 
            :dataSource="sales"
            keyExpr="orderId"
            :allowColumnReordering="true"
            :grouping="{ autoExpandAll: true }"
            :groupPanel="{ visible: true }"
            :paging="{ pageSize: 10 }"
            :selection="{ mode: 'multiple' }"
            :filterRow="{ visible: true }"
            :selectedRowKeys="selectedRowKeys"
            :columns="columns"
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { sales } from "../data";
import { DxDataGrid } from "../../src";

const selectedKeys = [10273, 10277, 10292, 10295, 10300, 10302, 10305, 10308, 10312, 
10319, 10321, 10323, 10326, 10328, 10331, 10334, 10335, 10341, 10351, 10353, 10356, 
10362, 10367, 10373, 10376, 10383, 10387];

export default {
  components: {
    ExampleBlock,
    DxDataGrid
  },
  data: function() {
    return {
      sales: sales,
      selectedRowKeys: selectedKeys,
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
          dataField: "city"
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