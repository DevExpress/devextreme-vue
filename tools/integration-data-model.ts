export interface IWidget {
  exportPath: string;
  isEditor: boolean;
  name: string;
  options: IOption[];
  subscribableOptions: ISubscribableOption[];
  templates: string[];
}
export interface IOption {
  name: string;
  options: IOption[];
  types: string[];
  valueRestriction: IValueRestriction;
}
export interface ISubscribableOption {
  name: string;
  type: string;
}
export interface IValueRestriction {
  acceptableValues: string[];
  type: string;
}
