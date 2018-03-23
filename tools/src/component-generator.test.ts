import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent]
})
class CLASS_NAME extends Vue {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new dxCLASS_NAME(element, props);
  }
}
export { CLASS_NAME };
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
