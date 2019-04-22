import { Vue } from "vue/types/vue";
import { isEqual } from "./helpers";

type UpdateFunc = (name: string, value: any) => void;

interface ExpectedChild {
    isCollectionItem: boolean;
    optionName: string;
}

class Configuration {

    private readonly _name: string | null;
    private readonly _isCollectionItem: boolean;
    private readonly _collectionItemIndex: number | undefined;
    private readonly _initialValues: Record<string, any>;
    private readonly _expectedChildren: Record<string, ExpectedChild>;
    private readonly _updateFunc: UpdateFunc;
    private readonly _ownerConfig: Configuration | undefined;
    private _nestedConfigurations: Configuration[];
    private _optionChangedFunc: any;

    private _options: string[];

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        initialValues: Record<string, any>,
        expectedChildren?: Record<string, ExpectedChild>,
        isCollectionItem?: boolean,
        collectionItemIndex?: number,
        ownerConfig?: Configuration | undefined
    ) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;
        this._expectedChildren = expectedChildren || {};
        this._ownerConfig = ownerConfig;

        this.updateValue = this.updateValue.bind(this);
    }

    public get name(): string | null {
        return this._name;
    }

    public get path(): string | null {
        return this._isCollectionItem ? `${this._name}[${this._collectionItemIndex}]` : this._name;
    }

    public get fullPath(): string | null {
        const ownerPath = this.ownerPath ? `${this.ownerPath}.` : this.ownerPath;
        const name = this._name ? `${ownerPath}${this._name}` : this._name;
        return this._isCollectionItem ? `${name}[${this._collectionItemIndex}]` : name;
    }

    public get options(): string[] {
        return this._options;
    }

    public get initialValues(): Record<string, any> {
        return this._initialValues;
    }

    public get expectedChildren(): Record<string, ExpectedChild> {
        return this._expectedChildren;
    }

    public get nested(): Configuration[] {
        return this._nestedConfigurations;
    }

    public get ownerPath(): string {
        return this._ownerConfig && this._ownerConfig.fullPath ? this._ownerConfig.fullPath : "";
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

    public set optionChangedFunc(handler: any) {
        this._optionChangedFunc = handler;
    }

    public onOptionChanged(args: {name: string, fullName: string, value: any}): void {
        if (this._optionChangedFunc) {
            this._optionChangedFunc(args);
        }
        this._nestedConfigurations.forEach((nestedConfig) => {
            nestedConfig.onOptionChanged(args);
        });
    }

    public cleanNested() {
        this._nestedConfigurations = [];
    }

    public createNested(
        name: string,
        initialValues: Record<string, any>,
        isCollectionItem?: boolean,
        expectedChildren?: Record<string, ExpectedChild>,
        ownerConfig?: Configuration | undefined
    ): Configuration {

        const expected = this._expectedChildren[name];
        let actualName = name;
        let actualIsCollectionItem = isCollectionItem;
        if (expected) {
            actualIsCollectionItem = expected.isCollectionItem;
            if (expected.optionName) {
                actualName = expected.optionName;
            }
        }

        let collectionItemIndex = -1;
        if (actualIsCollectionItem && actualName) {
            collectionItemIndex = this._nestedConfigurations.filter((c) => c._name && c._name === actualName).length;
        }

        const configuration = new Configuration(
            this.updateValue,
            actualName,
            initialValues,
            expectedChildren,
            actualIsCollectionItem,
            collectionItemIndex,
            ownerConfig
        );

        this._nestedConfigurations.push(configuration);

        return configuration;
    }

    public updateValue(nestedName: string, value: any): void {
        const fullName = [this.path, nestedName].filter((n) => n).join(".");
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

function subscribeOnUpdates(config: Configuration, vueInstance: Pick<Vue, "$emit">): void {
    config.optionChangedFunc = (args: any) => {
        let optionName = args.name;
        let optionValue = args.value;
        const fullOptionPath = config.fullPath + ".";

        if (config.name && config.name === args.name && args.fullName.indexOf(fullOptionPath) === 0) {
            optionName = args.fullName.slice(fullOptionPath.length);
        } else if (args.fullName !== args.name) {
            optionValue = args.component.option(optionName);
        }
        if (!isEqual(args.value, args.previousValue)) {
            vueInstance.$emit("update:" + optionName, optionValue);
        }
    };
}

export default Configuration;
export { bindOptionWatchers, subscribeOnUpdates, UpdateFunc, ExpectedChild };
