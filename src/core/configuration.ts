import { Vue } from "vue/types/vue";
import { isEqual } from "./helpers";

type UpdateFunc = (name: string, value: any) => void;
type EmitOptionChangedFunc = (optionName: string, optionValue: any) => void;

interface ExpectedChild {
    isCollectionItem: boolean;
    optionName: string;
}

interface IOptionChangedArgs {
    value: any;
    previousValue: any;
    component: any;
}

class Configuration {

    private readonly _name: string | null;
    private readonly _isCollectionItem: boolean;
    private readonly _collectionItemIndex: number | undefined;
    private readonly _initialValues: Record<string, any>;
    private readonly _expectedChildren: Record<string, ExpectedChild>;
    private readonly _updateFunc: UpdateFunc;
    private readonly _ownerConfig: Pick<Configuration, "fullPath"> | undefined;
    private _nestedConfigurations: Configuration[];
    private _prevNestedConfigOptions: any;
    private _emitOptionChanged: EmitOptionChangedFunc;
    private _componentsCountChanged: boolean;

    private _options: string[];

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        initialValues: Record<string, any>,
        expectedChildren?: Record<string, ExpectedChild>,
        isCollectionItem?: boolean,
        collectionItemIndex?: number,
        ownerConfig?: Pick<Configuration, "fullPath"> | undefined
    ) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;
        this._expectedChildren = expectedChildren || {};
        this._ownerConfig = ownerConfig;
        this._componentsCountChanged = false;

        this.updateValue = this.updateValue.bind(this);
    }

    public get name(): string | null {
        return this._name;
    }

    public get fullName(): string | null {
        if (this._name && this._isCollectionItem) {
            return `${this._name}[${this._collectionItemIndex}]`;
        }

        return this._name;
    }

    public get hasOptionsToUpdate(): boolean {
        return this._componentsCountChanged;
    }

    public set hasOptionsToUpdate(value: boolean) {
        this._componentsCountChanged = value;
    }

    public get fullPath(): string | null {
        let path = this.fullName;

        if (this._ownerConfig && this._ownerConfig.fullPath) {
            path = `${this._ownerConfig.fullPath}.${path}`;
        }

        return path;
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

    public get prevNestedOptions(): any {
        return this._prevNestedConfigOptions;
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

    public set emitOptionChanged(handler: EmitOptionChangedFunc) {
        this._emitOptionChanged = handler;
    }

    public setPrevNestedOptions(value: any) {
        this._prevNestedConfigOptions = value;
    }

    public onOptionChanged(optionRelativePath: string[], args: IOptionChangedArgs): void {
        if (optionRelativePath.length === 0) {
            return;
        }

        const optionName = optionRelativePath[0];
        let optionValue: any;
        if (optionRelativePath.length > 1) {
            for (const nestedConfig of this._nestedConfigurations) {
                if (nestedConfig.fullName === optionName) {
                    nestedConfig.onOptionChanged(optionRelativePath.slice(1), args);
                    return;
                }
            }

            optionValue = args.component.option(this.fullPath ? `${this.fullPath}.${optionName}` : optionName);
        } else {
            optionValue = args.value;
        }

        if (this._emitOptionChanged && !isEqual(args.value, args.previousValue)) {
            this._emitOptionChanged(optionName, optionValue);
        }
    }

    public cleanNested() {
        this._nestedConfigurations = [];
    }

    public createNested(
        name: string,
        initialValues: Record<string, any>,
        isCollectionItem?: boolean,
        expectedChildren?: Record<string, ExpectedChild>
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
            this._updateFunc,
            actualName,
            initialValues,
            expectedChildren,
            actualIsCollectionItem,
            collectionItemIndex,
            this
        );

        this._nestedConfigurations.push(configuration);

        return configuration;
    }

    public updateValue(nestedName: string, value: any): void {
        const fullName = [this.fullPath, nestedName].filter((n) => n).join(".");
        this._updateFunc(fullName, value);
    }

    public getNestedOptionValues(): Record<string, any> | undefined {
        const values = {};

        this._nestedConfigurations.forEach((o) => {
            if (!o._name) { return; }

            const nestedValue = {...o.initialValues, ...o.getNestedOptionValues()};
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

        return values;
    }

    public getOptionsToWatch(): string[] {
        const blackList = {};
        this._nestedConfigurations.forEach((c) => c._name && (blackList[c._name] = true));

        return this._options.filter((o) => !blackList[o]);
    }
}

function bindOptionWatchers(
    config: Configuration,
    vueInstance: Pick<Vue, "$watch">,
    innerChanges: Record<string, any>): void {
    const targets = config.getOptionsToWatch();
    if (targets) {
        targets.forEach((optionName: string) => {
            vueInstance.$watch(optionName, (value) => {
                if (innerChanges[optionName] !== value) {
                    config.updateValue(optionName, value);
                }
                delete innerChanges[optionName];
            });
        });
    }
}

function setEmitOptionChangedFunc(
    config: Configuration,
    vueInstance: Pick<Vue, "$emit" | "$props">,
    innerChanges: Record<string, any>): void {
    config.emitOptionChanged = (name: string, value: string) => {
        if (!isEqual(value, vueInstance.$props[name])) {
            innerChanges[name] = value;
            vueInstance.$emit("update:" + name, value);
        }
    };
}

export default Configuration;
export { bindOptionWatchers, setEmitOptionChangedFunc, UpdateFunc, ExpectedChild, IOptionChangedArgs };
