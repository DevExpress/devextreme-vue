import { Vue } from "vue/types/vue";

type UpdateFunc = (name: string, value: any) => void;

interface IConfigurable {
    $_config: Configuration;
}

class Configuration {

    private readonly _nestedConfigurations: Configuration[];
    private readonly _name: string | null;
    private readonly _isCollectionItem: boolean;
    private readonly _collectionItemIndex: number | undefined;
    private readonly _options: string[];
    private readonly _initialValues: Record<string, any>;
    private readonly _updateFunc: UpdateFunc;

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        options: string[],
        initialValues: Record<string, any>,
        isCollectionItem?: boolean,
        collectionItemIndex?: number
    ) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._options = options ? options : [];
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;

        this.updateValue = this.updateValue.bind(this);
    }

    public createNested(
        name: string,
        options: string[],
        initialValues: Record<string, any>,
        isCollectionItem?: boolean
    ): Configuration {
        let collectionItemIndex = -1;
        if (isCollectionItem && name) {
            collectionItemIndex = this._nestedConfigurations.filter((c) => c._name && c._name === name).length;
        }

        const configuration = new Configuration(
            this.updateValue,
            name,
            options,
            initialValues,
            isCollectionItem,
            collectionItemIndex
        );

        this._nestedConfigurations.push(configuration);

        return configuration;
    }

    public updateValue(nestedName: string, value: any): void {
        const name = this._isCollectionItem ? `${this._name}[${this._collectionItemIndex}]` : this._name;
        const fullName = [name, nestedName].filter((n) => n).join(".");
        this._updateFunc(fullName, value);
    }

    public getInitialValues(): Record<string, any> | undefined {
        const values = {
            ...this._initialValues
        };

        this._nestedConfigurations.forEach((o) => {
            if (!o._name) { return; }

            const nestedValue = o.getInitialValues();
            if (!nestedValue) { return; }

            if (!o._isCollectionItem) {
                values[o._name] = nestedValue;
            } else {
                let arr = values[o._name];
                if (!arr || !Array.isArray(arr)) {
                    arr = [];
                    values[o._name] = arr;
                }

                arr.push(nestedValue);
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
