function convertTypes(types: string[]): string[] {
    if (types === undefined || types === null || types.length === 0) {
        return;
    }

    const convertedTypes = new Set(types.map(convertType));
    if (convertedTypes.has("Any")) {
        return;
    }

    return Array.from(convertedTypes);
}

function convertType(type: string): string {
    switch (type) {
        case "String":
        case "Number":
        case "Boolean":
        case "Array":
        case "Object":
        case "Function":
            return type;
    }

    return "Any";
}

export { convertTypes };
