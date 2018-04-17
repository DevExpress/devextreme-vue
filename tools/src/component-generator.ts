import { createKeyComparator, lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    props?: IProp[];
    hasModel?: boolean;
}

interface IComponentModel {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    renderedProps?: string[];
    hasModel?: boolean;
    widgetName: string;
}

interface IProp {
    name: string;
    types?: string[];
    acceptableValues?: string[];
}

function generate(component: IComponent): string {
    const componentModel = {
        ...component,
        renderedProps: component.props
            ? component.props.sort(createKeyComparator<IProp>((p) => p.name)).map(createPropModel)
            : undefined,
        widgetName: `${uppercaseFirst(component.name)}`
    };

    return renderComponent(componentModel);
}

function createPropModel(p: IProp) {
    const hasExtendedDeclaration = !p.types || !!p.acceptableValues;
    return hasExtendedDeclaration ? renderExtendedProp(p) : renderSimpleProp(p);
}

// tslint:disable:max-line-length
const renderComponent: (model: IComponentModel) => string = createTempate(`
import * as VueType from "vue";
const Vue = VueType.default || VueType;
import <#= it.widgetName #> from "devextreme/<#= it.dxExportPath #>";
import { VueConstructor } from "vue";
import BaseComponent from "<#= it.baseComponentPath #>";

const Dx<#= it.name #>: VueConstructor = Vue.extend({
  extends: BaseComponent,<#? it.props #>
  props: {<#= it.renderedProps.join(',') #>
  },<#?#><#? it.hasModel #>
  model: { prop: "value", event: "update:value" },<#?#>
  computed: {
    instance(): <#= it.widgetName #> {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = <#= it.widgetName #>;
  }
});
export { Dx<#= it.name #> };
`.trimLeft());

const renderSimpleProp: (model: IProp) => string = createTempate(`
    <#= it.name #>: <#? it.types.length > 1 #>[<#?#><#= it.types.join(', ') #><#? it.types.length > 1 #>]<#?#>
`.trimRight());

const renderExtendedProp: (model: IProp) => string = createTempate(`
    <#= it.name #>: {<#? it.types #>
      type: <#? it.types.length > 1 #>[<#?#><#= it.types.join(', ') #><#? it.types.length > 1 #>]<#?#><#?#><#? it.acceptableValues #>,
      validator: (v) => typeof(v) !== "string" || [<#= it.acceptableValues.join(', ') #>].indexOf(v) !== -1
    <#?#>}
`.trimRight());
// tslint:enable:max-line-length

export default generate;
export { IComponent, IProp };
