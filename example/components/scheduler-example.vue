<template>
    <example-block title="dxScheduler">
        <scheduler 
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
import { appointments } from "./data";
import { Scheduler } from "../../src";


export default {
    components: {
        ExampleBlock,
        Scheduler
    },
    data: function() {
        return {
            appointments: appointments
        }
    }
}
</script>