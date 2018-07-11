import generate, { renderProps } from "./component-generator";

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
export {
  DxCLASS_NAME
};
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
export {
  DxCLASS_NAME
};
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
export {
  DxCLASS_NAME
};
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

it("renders options in alphabetic order", () => {
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
export {
  DxCLASS_NAME
};
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

it("renders nested options props in alphabetic order", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { DxComponent as BaseComponent, DxConfiguration } from "BASE_COMPONENT_PATH";

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

const NESTED_COMPONENT = Vue.extend({
  extends: DxConfiguration,
  props: {
    PROP: {}
  },
  beforeMount() {
    (this as any).$_initOption("NESTED_OPTION_NAME");
  }
});

export {
  DxCLASS_NAME,
  NESTED_COMPONENT
};
`.trimLeft();
        //#endregion

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH",
            nestedComponents: [
              {
                name: "NESTED_COMPONENT",
                optionName: "NESTED_OPTION_NAME",
                props: [
                  { name: "PROP" }
                ]
              }
            ]
        })
    ).toBe(EXPECTED);
});

describe("options generation", () => {

    it("renders option without type", () => {
        const EXPECTED =
        `    PROP1: {}`;

        expect(
            renderProps([{ name: "PROP1" }])
        ).toBe(EXPECTED);
    });

    it("renders options with type", () => {

      const EXPECTED =
        `    PROP1: TYPE1,` + `\n` +
        `    PROP2: [TYPE2, TYPE3]`;

      expect(
          renderProps([{ name: "PROP1", types: ["TYPE1"] }, { name: "PROP2", types: ["TYPE2", "TYPE3"] }])
      ).toBe(EXPECTED);

    });

    it("renders options with acceptable values", () => {
        //#region EXPECTED
        const EXPECTED =
`    PROP1: {
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
    }`;
        //#endregion

        expect(
            renderProps([
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
            ])
        ).toBe(EXPECTED);
    });

    it("renders options with array of acceptable values", () => {
        //#region EXPECTED
        const EXPECTED =
`    PROP1: {
      type: TYPE1,
      validator: (v) => !Array.isArray(v) || v.filter(i => [
        "VAL1",
        "VAL2"
      ].indexOf(i) === -1).length === 0
    }`;
        //#endregion

        expect(
            renderProps([
                {
                    name: "PROP1",
                    types: ["TYPE1"],
                    acceptableValues: [`"VAL1"`, `"VAL2"`],
                    isArray: true
                }
            ])
        ).toBe(EXPECTED);
    });
});
