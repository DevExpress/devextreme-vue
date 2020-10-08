import { compareStrings } from "./helpers";
import { createTempate, L0, L1, L2, L3, L4, TAB2 } from "./template";

interface IImport {
    name: string;
    path: string;
}

interface IExpectedChild {
    isCollectionItem: boolean;
    optionName: string;
}

interface IComponent {
    name: string;
    widgetComponent: IImport;
    baseComponent: IImport;
    configComponent: IImport;
    props?: IProp[];
    hasModel?: boolean;
    nestedComponents?: INestedComponent[];
    expectedChildren?: Record<string, IExpectedChild>;
}

interface INestedComponent {
    name: string;
    optionName: string;
    props: IProp[];
    isCollectionItem: boolean;
    expectedChildren?: Record<string, IExpectedChild>;
    predefinedProps?: Record<string, any>;
}

interface INestedComponentModel {
    name: string;
    optionName: string;
    renderedProps?: string;
    props?: string[];
    isCollectionItem: boolean;
    predefinedProps: Array<{
        name: string;
        value: any;
    }>;
    expectedChildren?: Array<{
        name: string;
        isCollectionItem: boolean;
    }>;
}

interface IExpectedChildModel {
    name: string;
    isCollectionItem: boolean;
    optionName: string;
}

interface IProp {
    name: string;
    types?: string[];
    acceptableValues?: string[];
    acceptableValueType?: string;
    isArray?: boolean;
}

function generateReExport(path: string, fileName: string): string {
    return renderReExport({ path, fileName });
}

const renderReExport: (model: {path: string, fileName: string}) => string = createTempate(
`/** @deprecated Use 'devextreme-vue/<#= it.fileName #>' file instead */\n` +
`export * from "<#= it.path #>";\n` +
`export { default } from "<#= it.path #>";\n`
);

function generate(component: IComponent): string {
    const nestedComponents = component.nestedComponents
        ? component.nestedComponents.map(createNestedComponentModel)
        : undefined;

    const namedExports: string[] = [component.name];
    const namedImports = [
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
        defaultExport: component.name,
        namedExports,
        expectedChildren: formatExpectedChildren(component.expectedChildren),
    };

    return renderComponent(componentModel);
}

function createNestedComponentModel(component: INestedComponent): INestedComponentModel {
    let predefinedProps;

    if (component.predefinedProps) {
        predefinedProps = Object.keys(component.predefinedProps).map((name) => ({
            name,
            value: component.predefinedProps && component.predefinedProps[name]
        }));
    }

    return {
        name: component.name,
        optionName: component.optionName,
        renderedProps: component.props
            ? renderProps(component.props)
            : undefined,
        props: component.props ? getPropsList(component.props) : undefined,
        isCollectionItem: component.isCollectionItem,
        expectedChildren: formatExpectedChildren(component.expectedChildren),
        predefinedProps
    };
}

function formatExpectedChildren(dict: Record<string, IExpectedChild> | undefined): IExpectedChildModel[] | undefined {
    if (!dict) { return; }

    return Object.keys(dict).map((name) => ({
        name,
        isCollectionItem: dict[name].isCollectionItem,
        optionName: dict[name].optionName
    }));
}

// tslint:disable:max-line-length

const renderComponent: (model: {
    component: string;
    widgetImport: IImport;
    namedImports: IImport[];
    baseComponent: string;
    configComponent: string;
    renderedProps?: string;
    hasModel?: boolean;
    nestedComponents?: INestedComponentModel[];
    expectedChildren?: IExpectedChildModel[];
    defaultExport: string;
    namedExports: string[];
}) => string = createTempate(
`import <#= it.widgetImport.name #><#? it.props #>, { IOptions }<#?#> from "devextreme/<#= it.widgetImport.path #>";\n` +
`<#~ it.namedImports :namedImport #>` +
`import { <#= namedImport.name #> } from "<#= namedImport.path #>";\n` +
`<#~#>` + `\n` +

`<#? it.props #>` +
    `type AccessibleOptions = Pick<IOptions,` +
    `<#~ it.props: prop #>` +
        `<#? prop.name !== "dxKey" #>` +
            L1 + `"<#= prop.name #>" |` +
        `<#?#>` +
    `<#~#>` +
    `\b\b` + `\n>` +
    `<#? prop = it.props.find((el)=>el.name === "dxKey") #>` +
        ` & {<#= prop.name#>?: [<#= prop.types.map((el)=>el.toLowerCase()).join(" , ")#>]}` +
    `<#?#>;` +
    `\n` +
    `\n` +
`<#?#>` +

`interface <#= it.component #><#? it.props #> extends AccessibleOptions<#?#> {` +
    L1 + `readonly instance?: <#= it.widgetImport.name #>;` + `\n` +
`}` + `\n` +

`const <#= it.component #> = <#= it.baseComponent #>({` +

`<#? it.props #>` +
    L1 + `props: {\n` +
    `<#= it.renderedProps #>` +
    L1 + `},` +
`<#?#>` +

`<#? it.props #>` +
    L1 + `emits: {` +
        L2 + `"update:isActive": null,` +
        L2 + `"update:hoveredElement": null,` +
    `<#~ it.props: prop #>` +
        L2 + `"update:<#= prop.name #>": null,` +
    `<#~#>` +
    L1 + `},` +
`<#?#>` +

`<#? it.hasModel #>` +
  L1 + `model: { prop: "value", event: "update:value" },` +
`<#?#>` +

L1 + `computed: {` +
    L2 + `instance(): <#= it.widgetImport.name #> {` +
        L3 + `return (this as any).$_instance;` +
    L2 + `}` +
L1 + `},` +

L1 + `beforeCreate() {` +
    L2 + `(this as any).$_WidgetClass = <#= it.widgetImport.name #>;` +

    `<#? it.expectedChildren #>` +
    L2 + `(this as any).$_expectedChildren = {` +
    `<#~ it.expectedChildren : child #>` +
        L3 + `<#= child.name #>: { isCollectionItem: <#= child.isCollectionItem #>, optionName: "<#= child.optionName #>" },` +
    `<#~#>` + `\b` +
    L2 + `};` +
    `<#?#>` +

L1 + `}` +

L0 + `});\n` +

`<#? it.nestedComponents #>` +
    `\n` +
    `<#~ it.nestedComponents : nested #>` +
        `const <#= nested.name #> = <#= it.configComponent #>({` +
        `<#? nested.props #>` +
        L1 + `emits: {` +
                L2 + `"update:isActive": null,` +
                L2 + `"update:hoveredElement": null,` +
            `<#~ nested.props: prop #>` +
                L2 + `"update:<#= prop #>": null,` +
            `<#~#>` +
            L1 + `},` +
        `<#?#>` +
        L1 + `props: {\n` +
        `<#= nested.renderedProps #>` +
        L1 + `}\n` +
        `});\n` +
        `(<#= nested.name #> as any).$_optionName = "<#= nested.optionName #>";\n` +

        `<#? nested.isCollectionItem #>` +
            `(<#= nested.name #> as any).$_isCollectionItem = true;\n` +
        `<#?#>` +

        `<#? nested.predefinedProps #>` +
            `(<#= nested.name #> as any).$_predefinedProps = {` +
            `<#~ nested.predefinedProps : prop #>` +
                L1 + `<#= prop.name #>: "<#= prop.value #>",` +
            `<#~#>` + `\b\n` +
            `};\n` +
        `<#?#>` +

        `<#? nested.expectedChildren #>` +
            `(<#= nested.name #> as any).$_expectedChildren = {` +
            `<#~ nested.expectedChildren : child #>` +
                L1 + `<#= child.name #>: { isCollectionItem: <#= child.isCollectionItem #>, optionName: "<#= child.optionName #>" },` +
            `<#~#>` + `\b\n` +
            `};\n` +
        `<#?#>` +
    `<#~#>` +
`<#?#>` +
`\n` +

`<#? it.defaultExport #>` +
    `export default <#= it.defaultExport #>;\n` +
`<#?#>` +

`export {` +
    `<#~ it.namedExports :namedExport #>` +
        L1 + `<#= namedExport #>,` +
    `<#~#>` + `\b` + `\n` +
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

function getPropsList(props: IProp[]) {
    return props.map((item) => {
        return item.name;
    });
}

function renderProps(props: IProp[]): string {
    return renderPropsTemplate(props.sort(compareProps));
}
const renderPropsTemplate: (props: IProp[]) => string = createTempate(
`<#~ it :prop #>` +

    TAB2 +

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

export default generate;
export {
    IComponent,
    IExpectedChild,
    INestedComponent,
    IProp,
    renderProps,
    generateReExport
};
