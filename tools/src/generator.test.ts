import { IWidget } from "../integration-data-model";
import { mapWidget } from "./generator";

const simpleWidget: IWidget = {
    complexOptions: [],
    exportPath: "",
    isEditor: false,
    isExtension: false,
    name: "dxTestWidget",
    nesteds: [],
    options: [],
    templates: []
};

describe("mapWidget", () => {
    it("ignores 'key' option in props", () => {
        const result = mapWidget(
            {
                ...simpleWidget,
                options: [
                    {
                        name: "key",
                        types: [{ type: "Object" }, { type: "String" }],
                        isSubscribable: false,
                        props: []
                    }
                ]
            },
            "baseComponentPath",
            "configComponentPath",
            "extensionComponentPath",
            []
        );
        expect(result.component.props).toEqual([]);
    });

    it("does not ignore 'key' in nested components", () => {
        const result = mapWidget(
            {
                ...simpleWidget,
                complexOptions: [
                    {
                        name: "key",
                        optionName: "key",
                        owners: [simpleWidget.name],
                        props: [],
                        isCollectionItem: false,
                        nesteds: [],
                        predefinedProps: [],
                        templates: []
                      },
                    ]
            },
            "baseComponentPath",
            "configComponentPath",
            "extensionComponentPath",
            []
        );
        expect(result.component.nestedComponents).toEqual(
            [{ name: "DxKey", optionName: "key", props: [], predefinedProps: [], isCollectionItem: false }]
        );
    });
});
