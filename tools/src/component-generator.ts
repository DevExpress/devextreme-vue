import { lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
}

interface IOption {
    name: string;
    type: string;
}

function generate(component: IComponent): string {
    const componentModel = {
        ...component,
        widgetName: `dx${uppercaseFirst(component.name)}`,
        optionsName: `I${component.name}Options`
    };

    return renderComponent(componentModel);
}

const renderComponent: (model: {
    name: string;
    widgetName: string;
    optionsName: string;
    baseComponentPath: string;
    dxExportPath: string;
}
// tslint:disable:max-line-length
) => string = createTempate(`
import <#= it.widgetName #> from "devextreme/<#= it.dxExportPath #>";
import BaseComponent from "<#= it.baseComponentPath #>";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent]
})
class <#= it.name #> extends Vue {

  public get instance(): <#= it.widgetName #> {
    return this._instance;
  }

  protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
    return new <#= it.widgetName #>(element, props);
  }
}
export { <#= it.name #> };
`.trimLeft());

export default generate;
