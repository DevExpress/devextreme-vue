import { Vue } from "vue/types/vue";

type UpdateFunc = (name: string, value: any) => void;

class Configuration {

    private readonly _nestedConfigurations: Configuration[];
    private readonly _name: string | null;
    private readonly _isCollectionItem: boolean;
    private readonly _collectionItemIndex: number | undefined;
    private readonly _initialValues: Record<string, any>;
    private readonly _updateFunc: UpdateFunc;

    private _options: string[];

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        initialValues: Record<string, any>,
        isCollectionItem?: boolean,
        collectionItemIndex?: number
    ) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;

        this.updateValue = this.updateValue.bind(this);
    }

    public get name(): string | null {
        return this._name;
    }

    public get options(): string[] {
        return this._options;
    }

    public get initialValues(): Record<string, any> {
        return this._initialValues;
    }

    public get nested(): Configuration[] {
        return this._nestedConfigurations;
    }

    public get collectionItemIndex(): number | undefined {
        return this._collectionItemIndex;
    }

    public get isCollectionItem(): boolean {
        return this._isCollectionItem;
    }

    public get updateFunc(): UpdateFunc {
        return this._updateFunc;
    }

    public init(options: string[]): void {
        this._options = options ? options : [];
    }

    public createNested(
        name: string,
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

function bindOptionWatchers(config: Configuration, vueInstance: Pick<Vue, "$watch">): void {
    const targets = config.getOptionsToWatch();
    if (targets) {
        targets.forEach((optionName: string) => {
            vueInstance.$watch(optionName, (value) => config.updateValue(optionName, value));
        });
    }
}

export default Configuration;
export { bindOptionWatchers, UpdateFunc };
