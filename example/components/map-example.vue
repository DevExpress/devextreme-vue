<template>
    <example-block title="dxMap">
        <dx-map
            provider="bing"
            :zoom="11"
            :height="440"
            :controls="true"
        >
            <dx-marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
                <dx-location :lat="40.755833" :lng="-73.986389" />
                <dx-tooltip text="Times Square" />
            </dx-marker>
            <dx-marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
                <dx-location :lat="40.7825" :lng="-73.966111" />
                <dx-tooltip text="Central Park" />
            </dx-marker>

            <dx-route color="green">
                <dx-location :lat="40.755833" :lng="-73.986389" />
                <dx-location :lat="40.7825" :lng="-73.966111" />
            </dx-route>
        </dx-map>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxMap, DxMarker, DxLocation, DxTooltip, DxRoute } from "../../src/map";

export default {
  components: {
    ExampleBlock,
    DxMap,
    DxMarker,
    DxLocation,
    DxTooltip,
    DxRoute
  },
  data: function() {
    return {
      buttonAttrs: {
        style: "background-color: #ffc"
      }
    };
  }
};
</script>