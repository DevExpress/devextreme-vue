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

export function forEachChildNode(
    el: Node,
    callback: (child: ReturnType<Node["childNodes"]["item"]>) => void
) {
    Array.prototype.slice.call(el.childNodes).forEach(callback);
}

export function haveEqualKeys(obj1: object, obj2: object) {
    const obj1Keys = Object.keys(obj1);

    if (obj1Keys.length !==  Object.keys(obj2).length) {
        return false;
    }

    for (const key of obj1Keys) {
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}
