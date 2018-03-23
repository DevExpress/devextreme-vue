<template>
    <div>
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">
        <dx-button text="text"/>
        <dx-list :items="items" />
        <dx-autocomplete :dataSource="items" />
    </div>
</template>

<script lang="ts">

import { List, Button, Autocomplete } from "../src";

const data: object = {
    name: "World",
    items: ["1111", "22222", "33333"]
}

export default {
    data: () => data,
    components: {
        "dx-button": Button,
        "dx-list": List,
        "dx-autocomplete": Autocomplete
    },
    name: "app"
}
</script>
