export function uppercaseFirst(value: string): string {
    return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
    return value[0].toLowerCase() + value.substr(1);
}

export function camelize(value: string): string {
    return lowercaseFirst(value.split("-").map((v) => uppercaseFirst(v)).join(""));
}

export function toComparable(value: any): any {
    return value instanceof Date ? value.getTime() : value;
}

export function isEqual(value1, value2) {
    if (toComparable(value1) === toComparable(value2)) {
        return true;
    }

    if (Array.isArray(value1) && Array.isArray(value2)) {
        return value1.length === 0 && value2.length === 0;
    }

    return false;
}

export function extractScopedSlots(
    obj: Record<string, any>,
    nonScopedSlots: string[]
): Record<string, any> {

    const result = {};

    Object.keys(obj).forEach((key: string) => {
        if (nonScopedSlots && nonScopedSlots.indexOf(key) > -1) {
            return;
        }

        const value = obj[key];
        if (value instanceof Function) {
            result[key] = value;
        }
    });

    return result;
}
