import { vue2Strategy } from "./vue2-strategy";
import { vue3Strategy } from "./vue3-strategy";
import { isVue3 } from "./version";

const VueStrategy = isVue3() ? vue3Strategy :  vue2Strategy;
let ComponentManager;

if(!ComponentManager) {
    ComponentManager = new VueStrategy();
}

export {
    ComponentManager
}