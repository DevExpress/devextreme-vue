import { lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    options?: IOption[];
}

interface IExtendedComponent extends IComponent {
    widgetName: string;
    optionsName: string;
}

interface IOption {
    name: string;
    type?: string[];
}

function generate(component: IComponent): string {
    const componentModel = {
        ...component,
        widgetName: `dx${uppercaseFirst(component.name)}`,
        optionsName: `I${component.name}Options`
    };

    return renderComponent(componentModel);
}

const renderComponent: (model: IExtendedComponent
// tslint:disable:max-line-length
) => string = createTempate(`
import <#= it.widgetName #> from "devextreme/<#= it.dxExportPath #>";
import BaseComponent from "<#= it.baseComponentPath #>";

import Vue from "vue";
import VueComponent from "vue-class-component";

@VueComponent({
    mixins: [BaseComponent],
    props: <#= it.options ? "[" +  it.options.map((m) => '"'+ m.name +'"').toString() + "]" : undefined #>
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
