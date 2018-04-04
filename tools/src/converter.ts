function convertTypes(types: string[]): string[] {
    if (typeof (types) === "undefined" || types.length === 0) {
        return undefined;
    }

    const convertedTypes = new Set();
    types.forEach((type) => {
        const convertedType = convertType(type);
        if (convertedType !== null) {
            convertedTypes.add(convertedType);
        }
    });

    if (convertedTypes.has("Any")) {
        return undefined;
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
