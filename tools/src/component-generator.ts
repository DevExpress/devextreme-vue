import { compareStrings } from "./helpers";
import createTempate from "./template";

interface IImport {
    name: string;
    path: string;
}

interface IComponent {
    name: string;
    widgetComponent: IImport;
    baseComponent: IImport;
    configComponent: IImport;
    props?: IProp[];
    hasModel?: boolean;
    nestedComponents?: INestedComponent[];
}

interface IComponentModel {
    component: string;
    widgetImport: IImport;
    namedImports: IImport[];
    baseComponent: string;
    configComponent: string;
    renderedProps?: string;
    hasModel?: boolean;
    nestedComponents?: INestedComponentModel[];
    namedExports: string[];
}

interface INestedComponent {
    name: string;
    optionName: string;
    props: IProp[];
    isCollectionItem: boolean;
}

interface INestedComponentModel {
    name: string;
    optionName: string;
    renderedProps: string;
    isCollectionItem: boolean;
}

interface IProp {
    name: string;
    types?: string[];
    acceptableValues?: string[];
    acceptableValueType?: string;
    isArray?: boolean;
}

function generate(component: IComponent): string {
    const nestedComponents = component.nestedComponents
        ? component.nestedComponents.map(createNestedComponentModel)
        : undefined;

    const namedExports: string[] = [component.name];
    const namedImports = [
        {
            name: "VueConstructor",
            path: "vue"
        },
        component.baseComponent
    ];

    if (nestedComponents && nestedComponents.length) {
        namedExports.push(...nestedComponents.map((c) => c.name));
        namedImports.push(component.configComponent);
    }

    namedImports.sort(compareImports);
    const componentModel = {
        ...component,

        namedImports,
        widgetImport: component.widgetComponent,
        component: component.name,
        baseComponent: component.baseComponent.name,
        configComponent: component.configComponent.name,

        renderedProps: component.props
            ? renderProps(component.props)
            : undefined,

        nestedComponents,
        namedExports
    };

    return renderComponent(componentModel);
}

function createNestedComponentModel(component: INestedComponent): INestedComponentModel {
    return {
        name: component.name,
        optionName: component.optionName,
        renderedProps: component.props
            ? renderProps(component.props)
            : undefined,
        isCollectionItem: component.isCollectionItem
    };
}

// tslint:disable:max-line-length

const L1: string = `\n` + tab(1);
const L2: string = `\n` + tab(2);
const L3: string = `\n` + tab(3);
const L4: string = `\n` + tab(4);

const renderComponent: (model: IComponentModel) => string = createTempate(
`import * as VueType from "vue";\n` +
`const Vue = VueType.default || VueType;\n` +
`import <#= it.widgetImport.name #> from "devextreme/<#= it.widgetImport.path #>";\n` +

`<#~ it.namedImports :namedImport #>` +
`import { <#= namedImport.name #> } from "<#= namedImport.path #>";\n` +
`<#~#>` + `\n` +

`const <#= it.component #>: VueConstructor = Vue.extend({` +
L1 + `extends: <#= it.baseComponent #>,` +

`<#? it.props #>` +
    L1 + `props: {\n` +
    `<#= it.renderedProps #>` +
    L1 + `},` +
`<#?#>` +

`<#? it.hasModel #>` +
  L1 + `model: { prop: "value", event: "update:value" },` +
`<#?#>` +

  L1 + `computed: {
    instance(): <#= it.widgetImport.name #> {
      return (this as any).$_instance;
    }
  },` +

  L1 + `beforeCreate() {
    (this as any).$_WidgetClass = <#= it.widgetImport.name #>;
  }
});\n` +

`<#? it.nestedComponents #>` +
    `\n` +
    `<#~ it.nestedComponents : nested #>` +
        `const <#= nested.name #> = Vue.extend({` +
        L1 + `extends: <#= it.configComponent #>,` +
        L1 + `props: {\n` +
        `<#= nested.renderedProps #>` +
        L1 + `},` +
        L1 + `beforeMount() {` +
        L2 + `(this as any).` +

        `<#? nested.isCollectionItem #>` +
            `$_initCollectionOption` +
        `<#??#>` +
            `$_initOption` +
        `<#?#>` +

        `("<#= nested.optionName #>");` +
        L1 + `}\n` +
        `});\n` +
    `<#~#>` +
`<#?#>` +

`\n` +
`export {\n` +
    `<#~ it.namedExports :namedExport #>` +
    tab(1) + `<#= namedExport #>,\n` +
    `<#~#>` + `\b\b` + `\n` +
`};\n`
);

function compareProps(a: IProp, b: IProp): number {
    return compareStrings(a.name, b.name);
}
function compareImports(a: IImport, b: IImport): number {
    if (a.path.startsWith(".") && !b.path.startsWith(".")) { return 1; }

    if (!a.path.startsWith(".") && b.path.startsWith(".")) { return -1; }

    return compareStrings(a.path, b.path);
}

function renderProps(props: IProp[]): string {
    return renderPropsTemplate(props.sort(compareProps));
}
const renderPropsTemplate: (props: IProp[]) => string = createTempate(
`<#~ it :prop #>` +

    tab(2) +

    `<#? prop.types && prop.types.length > 0 && !prop.acceptableValues #>` +
        `<#= prop.name #>: ` +

        `<#? prop.types.length > 1 #>` + `[` + `<#?#>` +

        `<#= prop.types.join(', ') #>` +

        `<#? prop.types.length > 1 #>` + `]` + `<#?#>` +

    `<#??#>` +
        `<#= prop.name #>: {` +

        `<#? prop.types #>` +
            L3 + `type: ` +

            `<#? prop.types.length > 1 #>` + `[` + `<#?#>` +

            `<#= prop.types.join(', ') #>` +

            `<#? prop.types.length > 1 #>` + `]` + `<#?#>` +

        `<#?#>` +

        `<#? prop.acceptableValues #>` +
            `,` +
            L3 + `validator: (v) => ` +

            `<#? prop.isArray #>` +

                `!Array.isArray(v) || v.filter(i => [` +

                    `<#~ prop.acceptableValues : value #>` +
                        L4 + `<#= value #>,` +
                    `<#~#>` + `\b` +

                L3 + `].indexOf(i) === -1).length === 0` +

            `<#??#>` +
                `typeof(v) !== ` +

                `<#? prop.acceptableValueType #>` +
                    `"<#= prop.acceptableValueType #>"` +
                `<#??#>` +
                    `"string"` +
                `<#?#>` +

                ` || [` +

                `<#~ prop.acceptableValues : value #>` +
                    L4 + `<#= value #>,` +
                `<#~#>` + `\b` +

                L3 + `].indexOf(v) !== -1` +
            `<#?#>` +

            L2 +

        `<#?#>` +

         `}` +

    `<#?#>,\n` +

`<#~#>` + `\b\b`
);

function tab(i: number): string {
    return Array(i * 2 + 1).join(" ");
}

export default generate;
export { IComponent, INestedComponent, IProp, renderProps };
