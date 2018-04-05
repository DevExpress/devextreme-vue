import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent]
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: {
        --PROP: {},
        a-PROP: {},
        B-PROP: {},
        b-PROP: {}
    }
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: {
        PROP1: {}
    }
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: {
        PROP1: TYPE1,
        PROP2: [TYPE2, TYPE3]
    }
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: {
        PROP1: {
            type: TYPE1,
            validator: (v) => ["VAL1", "VAL2"].indexOf(v) !== -1
        }
    }
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
                        acceptableValues: [ `"VAL1"`, `"VAL2"` ]
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
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    model: { prop: "value", event: "update:value" }
})
class DxCLASS_NAME extends Vue {
  private _instance: any;

  public get instance(): CLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new CLASS_NAME(element, props);
  }
}
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
