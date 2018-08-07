import generate, { renderProps } from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import WIDGET from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

const COMPONENT: VueConstructor = Vue.extend({
  extends: BASE_COMPONENT,
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
  }
});

export default COMPONENT;
export {
  COMPONENT
};
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "COMPONENT",
            widgetComponent: {
              name: "WIDGET",
              path: "DX/WIDGET/PATH"
            },
            configComponent: {
                name: "CONFIG_COMPONENT",
                path: "./CONFIG_COMPONENT_PATH"
            },
            baseComponent: {
                name: "BASE_COMPONENT",
                path: "./BASE_COMPONENT_PATH"
            }
        })
    ).toBe(EXPECTED);
});

it("generates component with model", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import WIDGET from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

const COMPONENT: VueConstructor = Vue.extend({
  extends: BASE_COMPONENT,
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
  }
});

export default COMPONENT;
export {
  COMPONENT
};
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "COMPONENT",
            widgetComponent: {
              name: "WIDGET",
              path: "DX/WIDGET/PATH"
            },
            baseComponent: {
                name: "BASE_COMPONENT",
                path: "./BASE_COMPONENT_PATH"
            },
            configComponent: {
                name: "CONFIG_COMPONENT",
                path: "./CONFIG_COMPONENT_PATH"
            },
            hasModel: true
        })
    ).toBe(EXPECTED);
});

it("generates option", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import WIDGET from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

const COMPONENT: VueConstructor = Vue.extend({
  extends: BASE_COMPONENT,
  props: {
    PROP: {}
  },
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
  }
});

export default COMPONENT;
export {
  COMPONENT
};
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "COMPONENT",
            widgetComponent: {
              name: "WIDGET",
              path: "DX/WIDGET/PATH"
            },
            baseComponent: {
                name: "BASE_COMPONENT",
                path: "./BASE_COMPONENT_PATH"
            },
            configComponent: {
                name: "CONFIG_COMPONENT",
                path: "./CONFIG_COMPONENT_PATH"
            },
            props: [{ name: "PROP" }]
        })
    ).toBe(EXPECTED);
});

it("generates nested option component", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import WIDGET from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

const COMPONENT: VueConstructor = Vue.extend({
  extends: BASE_COMPONENT,
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
  }
});

const NESTED_COMPONENT: any = Vue.extend({
  extends: CONFIG_COMPONENT,
  props: {
    PROP: {}
  }
});
(NESTED_COMPONENT as any).$_optionName = "NESTED_OPTION_NAME";

export default COMPONENT;
export {
  COMPONENT,
  NESTED_COMPONENT
};
`.trimLeft();
        //#endregion

    expect(
        generate({
            name: "COMPONENT",
            widgetComponent: {
              name: "WIDGET",
              path: "DX/WIDGET/PATH"
            },
            baseComponent: {
                name: "BASE_COMPONENT",
                path: "./BASE_COMPONENT_PATH"
            },
            configComponent: {
                name: "CONFIG_COMPONENT",
                path: "./CONFIG_COMPONENT_PATH"
            },
            nestedComponents: [
              {
                name: "NESTED_COMPONENT",
                optionName: "NESTED_OPTION_NAME",
                props: [
                  { name: "PROP" }
                ],
                isCollectionItem: false
              }
            ]
        })
    ).toBe(EXPECTED);
});

it("generates nested collection option component", () => {
    //#region EXPECTED
    const EXPECTED = `
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import WIDGET from "devextreme/DX/WIDGET/PATH";
import { VueConstructor } from "vue";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

const COMPONENT: VueConstructor = Vue.extend({
  extends: BASE_COMPONENT,
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
  }
});

const NESTED_COMPONENT: any = Vue.extend({
  extends: CONFIG_COMPONENT,
  props: {
    PROP: {}
  }
});
(NESTED_COMPONENT as any).$_optionName = "NESTED_OPTION_NAME";
(NESTED_COMPONENT as any).$_isCollectionItem = true;

export default COMPONENT;
export {
  COMPONENT,
  NESTED_COMPONENT
};
`.trimLeft();
        //#endregion

    expect(
        generate({
            name: "COMPONENT",
            widgetComponent: {
              name: "WIDGET",
              path: "DX/WIDGET/PATH"
            },
            baseComponent: {
                name: "BASE_COMPONENT",
                path: "./BASE_COMPONENT_PATH"
            },
            configComponent: {
                name: "CONFIG_COMPONENT",
                path: "./CONFIG_COMPONENT_PATH"
            },
            nestedComponents: [
              {
                name: "NESTED_COMPONENT",
                optionName: "NESTED_OPTION_NAME",
                props: [
                  { name: "PROP" }
                ],
                isCollectionItem: true
              }
            ]
        })
    ).toBe(EXPECTED);
});

describe("props generation", () => {

    it("generates props in alphabetic order", () => {
        //#region EXPECTED
        const EXPECTED =
        `    --PROP: {},` + `\n` +
        `    a-PROP: {},` + `\n` +
        `    B-PROP: {},` + `\n` +
        `    b-PROP: {}`;
        //#endregion

        expect(
          renderProps([
            { name: "B-PROP" },
            { name: "b-PROP" },
            { name: "a-PROP" },
            { name: "--PROP" }
          ])
        ).toBe(EXPECTED);
    });

    it("renders props without type", () => {
        const EXPECTED =
        `    PROP1: {}`;

        expect(
            renderProps([{ name: "PROP1" }])
        ).toBe(EXPECTED);
    });

    it("renders props with type", () => {

      const EXPECTED =
        `    PROP1: TYPE1,` + `\n` +
        `    PROP2: [TYPE2, TYPE3]`;

      expect(
          renderProps([{ name: "PROP1", types: ["TYPE1"] }, { name: "PROP2", types: ["TYPE2", "TYPE3"] }])
      ).toBe(EXPECTED);

    });

    it("renders props with acceptable values", () => {
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

    it("renders props with array of acceptable values", () => {
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
