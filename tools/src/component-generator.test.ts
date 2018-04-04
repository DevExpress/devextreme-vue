import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: undefined
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

it("generates class with props", () => {
    //#region EXPECTED
    const EXPECTED = `
import CLASS_NAME from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: ["PROP1","PROP2"]
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
            options: [{ name: "PROP1" }, { name: "PROP2" }]
        })
    ).toBe(EXPECTED);
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
    props: undefined,
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
            isEditor: true
        })
    ).toBe(EXPECTED);
});
