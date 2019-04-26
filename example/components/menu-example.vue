<template>
    <example-block title="dxMenu">
        <h4>Menu with simple items</h4>
        <dx-menu>
            <dx-item text="Item 1">
                <dx-item text="Item 1-1"/>
                <dx-item text="Item 1-2"/>
                <dx-item text="Item 1-3">
                    <dx-item text="Item 1-3-1"/>
                </dx-item>
            </dx-item>
            <dx-item text="Item 2"/>
            <dx-item text="Item 3"/>
        </dx-menu>

        <h4>Menu with static item templates</h4>
        <dx-menu>
            <dx-item>
                <div slot-scope="_">Item 1</div>
                <dx-item>
                    <div slot-scope="_">Item 1-1</div>
                </dx-item>
                <dx-item>
                    <div slot-scope="_">Item 1-2</div>
                </dx-item>
                <dx-item>
                    <div slot-scope="_">Item 1-3</div>
                    <dx-item>
                        <div slot-scope="_">Item 1-3-1</div>
                    </dx-item>
                </dx-item>
            </dx-item>
            <dx-item>
                <div slot-scope="_">Item 2</div>
            </dx-item>
            <dx-item>
                <div slot-scope="_">Item 3</div>
            </dx-item>
        </dx-menu>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import DxMenu, { DxItem } from "../../src/menu";

export default {
  components: {
    ExampleBlock,
    DxMenu,
    DxItem
  }
};
</script>
