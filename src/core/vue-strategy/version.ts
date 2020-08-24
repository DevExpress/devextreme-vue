import * as VueType from "vue";
import { VueConstructor } from "vue";
const Vue = VueType.default || VueType;

export function getVueVersion() {
    const currentVersion = (Vue as VueConstructor).version;
    return Number(currentVersion.split('.')[0]);
}

export function isVue3() {
    return getVueVersion() === 3;
}