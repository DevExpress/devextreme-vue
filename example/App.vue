<template>
    <div>
        <button-example/>
        <br/>
        <popup-example/>
        <br/>
        <text-box-example/>
        <br/>
        <list-example/>
        <br/>
        <grid-example/>
        <br/>
        <scheduler-example/>
        <br/>
        <chart-example/>
    </div>
</template>

<script>

import ButtonExample from "./components/button-example";
import ListExample from "./components/list-example";
import GridExample from "./components/grid-example";
import PopupExample from "./components/popup-example";
import TextBoxExample from "./components/text-box-example";
import SchedulerExample from "./components/scheduler-example";
import ChartExample from "./components/chart-example";

export default {
    components: {
        ButtonExample,
        PopupExample,
        TextBoxExample,
        ListExample,
        GridExample,
        SchedulerExample,
        ChartExample
    },
    name: "app"
}
</script>
