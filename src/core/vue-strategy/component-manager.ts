import { isVue3 } from "./version";
import { Vue2Strategy } from "./vue2-strategy";
import { Vue3Strategy } from "./vue3-strategy";

function getCurrentStrategy() {
    const currentStrategy = isVue3() ? Vue3Strategy : Vue2Strategy;
    return new currentStrategy();
}

class VueStrategy {
    private context;

    constructor(context) {
        this.context = context;
    }

    public getContext() {
        return this.context;
    }
}

const vueStrategy = new VueStrategy(getCurrentStrategy());
export const vueContext = vueStrategy.getContext();
