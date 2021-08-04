import { ICustomType, ITypeDescr } from "devextreme-internal-tools/integration-data-model";

function convertTypes(
    types: ITypeDescr[] | undefined | null,
    customTypes?: Record<string, ICustomType>
): string[] | undefined {
    if (types === undefined || types === null || types.length === 0) {
        return;
    }

    if (customTypes) {
        types = types.concat(expandTypes(types, customTypes));
    }

    const convertedTypes = new Set(types.map(convertType));
    if (convertedTypes.has("Any")) {
        return;
    }

    return Array.from(convertedTypes);
}

function expandTypes(types: ITypeDescr[], customTypes: Record<string, ICustomType>): ITypeDescr[] {
    const expandedTypes: ITypeDescr[] = [];
    types.forEach((t) => {
      if (t.isCustomType) {
        const aliases = customTypes[t.type].types;
        if (aliases) {
            expandedTypes.push(...aliases);
        }
      }
    });
    return expandedTypes;
}
function convertType(typeDescr: ITypeDescr): string {
    switch (typeDescr.type) {
        case "String":
        case "Number":
        case "Boolean":
        case "Array":
        case "Object":
        case "Function":
            return typeDescr.type;
    }

    if (typeDescr.isCustomType) {
        return "Object";
    }

    return "Any";
}

export { convertTypes };
