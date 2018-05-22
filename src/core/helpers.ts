export function uppercaseFirst(value: string): string {
    return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
    return value[0].toLowerCase() + value.substr(1);
}

export function camelize(value: string): string {
    return lowercaseFirst(value.split("-").map((v) => uppercaseFirst(v)).join(""));
}
