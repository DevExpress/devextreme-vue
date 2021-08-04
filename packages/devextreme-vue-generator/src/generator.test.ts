
import { IWidget } from "devextreme-internal-tools/integration-data-model";
import { mapWidget } from "./generator";

const simpleWidget: IWidget = {
    complexOptions: [],
    exportPath: "",
    isEditor: false,
    isExtension: false,
    hasTranscludedContent: true,
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
                        firedEvents: [],
                        name: "key",
                        types: [
                            { type: "Object" } as any,
                            { type: "String" } as any
                        ],
                        isSubscribable: false,
                        props: []
                    }
                ]
            },
            "baseComponentPath",
            "configComponentPath",
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
            []
        );
        expect(result.component.nestedComponents).toEqual(
            [{ name: "DxKey", optionName: "key", props: [], predefinedProps: [], isCollectionItem: false }]
        );
    });
});
