<template>
    <example-block title="dxChart">
        <chart 
            :dataSource="chartData"
            :series="series"
        />
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "./data";
import { Chart } from "../../src";


export default {
    components: {
        ExampleBlock,
        Chart
    },
    data: function() {
        return {
            chartData: orangesByDay,
            series: [{
                argumentField: "day",
                valueField: "oranges",
                name: "My oranges",
                type: "line"
            }]
        }
    }
}
</script>