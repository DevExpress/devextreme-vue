<template>
    <example-block title="dxTabPanel">
        <dx-tab-panel :items="tabs">
            <div slot="tab1" slot-scope="_">
                <h3>First Tab Content</h3>
            </div>
            <div slot="tab2" slot-scope="_">
                <async-component/>
            </div>
        </dx-tab-panel>
    </example-block>
</template>

<script>
import Vue from "vue";
import ExampleBlock from "./example-block";
import { DxTabPanel } from "../../src";

const SecondTabComponent = Vue.extend({
    template: "<h3>Second Tab Content</h3>"
});

export default {
  components: {
    ExampleBlock,
    DxTabPanel,
    AsyncComponent: () => Promise.resolve(SecondTabComponent)
  },
  data: function() {
    return {
        tabs: [
          { title:"Sync Tab", template:"tab1" },
          { title:"Async Tab", template:"tab2" }
        ]
    };
  }
};
</script>