import * as dasherize from "dasherize";
import { extname as getPathExtension } from "path";

export function removeExtension(path: string) {
    return path.slice(0, - getPathExtension(path).length);
}

export function removePrefix(value: string, prefix: string): string {
    return new RegExp(`^${prefix}`, "i").test(value) ? value.substring(prefix.length) : value;
}

export function toKebabCase(value: string): string {
    return dasherize(value);
}

export function uppercaseFirst(value: string): string {
    return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
    return value[0].toLowerCase() + value.substr(1);
}
