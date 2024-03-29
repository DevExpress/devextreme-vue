import generate, { renderProps, USE_SYNC_TEMPLATES } from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
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
        }, "widget-gackage-name", 3)
    ).toBe(EXPECTED);
});

it("generates component with model", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
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
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

it("generates option", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET, { Properties } from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

type AccessibleOptions = Pick<Properties,
  "PROP"
>;

interface COMPONENT extends AccessibleOptions {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  props: {
    PROP: {}
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
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
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

it("generates re-export for ExplicitTypes", () => {
    //#region EXPECTED
    const EXPECTED = `
export { ExplicitTypes } from "widget-gackage-name/DX/WIDGET/PATH";
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
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
            },
            hasExplicitTypes: true
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

it("generates nested option component", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
  }
});

const NESTED_COMPONENT = CONFIG_COMPONENT({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
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
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

it("generates nested collection option component", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
  }
});

const NESTED_COMPONENT = CONFIG_COMPONENT({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
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
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

it("generates expectedChildren info", () => {
    //#region EXPECTED
    const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      EXPECTED_1: { isCollectionItem: true, optionName: "abc" },
      EXPECTED_2: { isCollectionItem: false, optionName: "def" }
    };
  }
});

const NESTED_COMPONENT = CONFIG_COMPONENT({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
  props: {
    PROP: {}
  }
});
(NESTED_COMPONENT as any).$_optionName = "NESTED_OPTION_NAME";
(NESTED_COMPONENT as any).$_expectedChildren = {
  EXPECTED_3: { isCollectionItem: true, optionName: "ghi" },
  EXPECTED_4: { isCollectionItem: false, optionName: "jkl" }
};

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
                isCollectionItem: false,
                expectedChildren: {
                  EXPECTED_3: { isCollectionItem: true, optionName: "ghi" },
                  EXPECTED_4: { isCollectionItem: false, optionName: "jkl" }
                }
              }
            ],
            expectedChildren: {
              EXPECTED_1: { isCollectionItem: true, optionName: "abc" },
              EXPECTED_2: { isCollectionItem: false, optionName: "def" }
            }
        }, "widget-gackage-name")
    ).toBe(EXPECTED);
});

describe("addintion info generation", () => {
  beforeAll(() => {
    USE_SYNC_TEMPLATES.add("COMPONENT");
  });
  afterEach(() => {
    USE_SYNC_TEMPLATES.delete("COMPONENT");
  });

  it("generates", () => {
      //#region EXPECTED
      const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = false;
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
          }, "widget-gackage-name", 3)
      ).toBe(EXPECTED);
  });
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

    it("generates props without type", () => {
        const EXPECTED =
        `    PROP1: {}`;

        expect(
            renderProps([{ name: "PROP1" }])
        ).toBe(EXPECTED);
    });

    it("generates props with type", () => {

      const EXPECTED =
        `    PROP1: TYPE1,` + `\n` +
        `    PROP2: [TYPE2, TYPE3]`;

      expect(
          renderProps([{ name: "PROP1", types: ["TYPE1"] }, { name: "PROP2", types: ["TYPE2", "TYPE3"] }])
      ).toBe(EXPECTED);

    });

    it("generates props with acceptable values", () => {
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

    it("generates nested component with predefined value", () => {
        //#region EXPECTED
        const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
  }
});

const NESTED_COMPONENT = CONFIG_COMPONENT({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
  props: {
    PROP: {}
  }
});
(NESTED_COMPONENT as any).$_optionName = "NESTED_OPTION_NAME";
(NESTED_COMPONENT as any).$_predefinedProps = {
  PROP_1: "PREDEFINED_VALUE"
};

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
                    isCollectionItem: false,
                    predefinedProps: {
                      PROP_1: "PREDEFINED_VALUE"
                    }
                  }
                ]
            }, "widget-gackage-name")
        ).toBe(EXPECTED);
    });

    it("generates nested component with several predefined values", () => {
        //#region EXPECTED
        const EXPECTED = `
import WIDGET from "widget-gackage-name/DX/WIDGET/PATH";
import { BASE_COMPONENT } from "./BASE_COMPONENT_PATH";
import { CONFIG_COMPONENT } from "./CONFIG_COMPONENT_PATH";

interface COMPONENT {
  readonly instance?: WIDGET;
}
const COMPONENT = BASE_COMPONENT({
  computed: {
    instance(): WIDGET {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = WIDGET;
    (this as any).$_hasAsyncTemplate = true;
  }
});

const NESTED_COMPONENT = CONFIG_COMPONENT({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:PROP": null,
  },
  props: {
    PROP: {}
  }
});
(NESTED_COMPONENT as any).$_optionName = "NESTED_OPTION_NAME";
(NESTED_COMPONENT as any).$_predefinedProps = {
  PROP_1: "PREDEFINED_VALUE_1",
  PROP_2: "PREDEFINED_VALUE_2"
};

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
                    isCollectionItem: false,
                    predefinedProps: {
                      PROP_1: "PREDEFINED_VALUE_1",
                      PROP_2: "PREDEFINED_VALUE_2"
                    }
                  }
                ]
            }, "widget-gackage-name")
        ).toBe(EXPECTED);
    });
});
