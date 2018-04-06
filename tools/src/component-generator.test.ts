import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH"
        })
    ).toBe(EXPECTED);
});

describe("props generation", () => {

    it("renders props in alphabetic order", () => {
        //#region EXPECTED
        const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    --PROP: {},
    a-PROP: {},
    B-PROP: {},
    b-PROP: {}
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                props: [{ name: "B-PROP" }, { name: "b-PROP" }, { name: "a-PROP" }, { name: "--PROP" }]
            })
        ).toBe(EXPECTED);
    });

    it("renders props without type", () => {
        //#region EXPECTED
        const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: {}
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                props: [{ name: "PROP1" }]
            })
        ).toBe(EXPECTED);
    });

    it("renders props with type", () => {
        //#region EXPECTED
        const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: TYPE1,
    PROP2: [TYPE2, TYPE3]
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                props: [{ name: "PROP1", types: ["TYPE1"] }, { name: "PROP2", types: ["TYPE2", "TYPE3"] }]
            })
        ).toBe(EXPECTED);
    });

    it("renders props with acceptable values", () => {
        //#region EXPECTED
        const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: {
      type: TYPE1,
      validator: (v) => ["VAL1", "VAL2"].indexOf(v) !== -1
    }
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                props: [
                    {
                        name: "PROP1",
                        types: ["TYPE1"],
                        acceptableValues: [`"VAL1"`, `"VAL2"`]
                    }
                ]
            })
        ).toBe(EXPECTED);
    });
});

it("generates class with model", () => {
    //#region EXPECTED
    const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import Vue, { VueConstructor } from "vue";
import BaseComponent from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): CLASS_NAME {
      return (this as any)._instance;
    }
  },
  beforeCreate() {
    (this as any)._Widget = CLASS_NAME;
  }
});
export { DxCLASS_NAME };
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH",
            hasModel: true
        })
    ).toBe(EXPECTED);
});
