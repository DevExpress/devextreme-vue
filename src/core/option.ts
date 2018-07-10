import { Vue } from "vue/types/vue";

type UpdateFunc = (name: string, value: any) => void;

interface IConfigurable {
    $_config: Configuration;
}

class Configuration {

    private readonly _nestedConfigurations: Configuration[];
    private readonly _name: string | null;
    private readonly _options: string[];
    private readonly _initialValues: Record<string, any>;
    private readonly _updateFunc: UpdateFunc;

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        options: string[],
        initialValues: Record<string, any>
    ) {
        this._name = name;
        this._updateFunc = updateFunc;
        this._options = options ? options : [];
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];

        this.updateValue = this.updateValue.bind(this);
    }

    public createNested(
        name: string,
        options: string[],
        initialValues: Record<string, any>
    ): Configuration {
        const configuration = new Configuration(this.updateValue, name, options, initialValues);
        this._nestedConfigurations.push(configuration);
        return configuration;
    }

    public updateValue(nestedName: string, value: any): void {
        const fullName = [this._name, nestedName].filter((n) => n).join(".");
        this._updateFunc(fullName, value);
    }

    public getInitialValues(): Record<string, any> | undefined {
        const values = {
            ...this._initialValues
        };

        this._nestedConfigurations.forEach((o) => {
            if (o._name) {
                const nestedValue = o.getInitialValues();
                if (nestedValue) {
                    values[o._name] = nestedValue;
                }
            }
        });

        return Object.keys(values).length > 0 ? values : undefined;
    }

    public getOptionsToWatch(): string[] {
        const blackList = {};
        this._nestedConfigurations.forEach((c) => c._name && (blackList[c._name] = true));

        return this._options.filter((o) => !blackList[o]);
    }
}

function bindOptionWatchers(config: Configuration, vueInstance: Pick<Vue, "$watch" | "$props">): void {
    const targets = config.getOptionsToWatch();
    if (targets) {
        targets.forEach((optionName: string) => {
            vueInstance.$watch(optionName, (value) => config.updateValue(optionName, value));
        });
    }
}

export default Configuration;
export { bindOptionWatchers, IConfigurable, UpdateFunc };
