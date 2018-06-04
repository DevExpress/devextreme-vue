import { ITypeDescr } from "../integration-data-model";

function convertTypes(types: ITypeDescr[]): string[] {
    if (types === undefined || types === null || types.length === 0) {
        return;
    }

    const convertedTypes = new Set(types.map(convertType));
    if (convertedTypes.has("Any")) {
        return;
    }

    return Array.from(convertedTypes);
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
