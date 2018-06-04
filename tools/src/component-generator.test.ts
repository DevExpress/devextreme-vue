import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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

it("generates extension component", () => {
  //#region EXPECTED
  const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxExtensionComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
          isExtension: true
      })
  ).toBe(EXPECTED);
});

describe("props generation", () => {

    it("renders props in alphabetic order", () => {
        //#region EXPECTED
        const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

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
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: {}
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: TYPE1,
    PROP2: [TYPE2, TYPE3]
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: {
      type: TYPE1,
      validator: (v) => typeof(v) !== "string" || [
        "VAL1",
        "VAL2"
      ].indexOf(v) !== -1
    },
    PROP2: {
      type: TYPE2,
      validator: (v) => typeof(v) !== "TYPE3" || [
        "VAL1",
        "VAL2"
      ].indexOf(v) !== -1
    }
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
                    },
                    {
                        name: "PROP2",
                        types: ["TYPE2"],
                        acceptableValues: [`"VAL1"`, `"VAL2"`],
                        acceptableValueType: "TYPE3"
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("renders props with array of acceptable values", () => {
        //#region EXPECTED
        const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  props: {
    PROP1: {
      type: TYPE1,
      validator: (v) => !Array.isArray(v) || v.filter(i => [
        "VAL1",
        "VAL2"
      ].indexOf(i) === -1).length === 0
    }
  },
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
                        acceptableValues: [`"VAL1"`, `"VAL2"`],
                        isArray: true
                    }
                ]
            })
        ).toBe(EXPECTED);
    });
});

it("generates class with model", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent } from "BASE_COMPONENT_PATH";

const DxCLASS_NAME: VueConstructor = Vue.extend({
  extends: BaseComponent,
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): CLASS_NAME {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CLASS_NAME;
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
