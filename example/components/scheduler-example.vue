<template>
    <example-block title="dxScheduler">
        <dx-scheduler 
            currentView="week"
            :dataSource="appointments"
            :height="400"
            :currentDate="new Date(2017, 4, 25)"
            :startDayHour="9"
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { appointments } from "../data";
import { DxScheduler } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxScheduler
  },
  data: function() {
    return {
      appointments: appointments
    };
  }
};
</script>