export interface IWidget {
  exportPath: string;
  isEditor: boolean;
  name: string;
  options: IOption[];
  subscribableOptions: ISubscribableOption[];
  templates: string[];
}
export interface IOption {
  acceptableValues: string[];
  name: string;
  options: IOption[];
  types: string[];
}
export interface ISubscribableOption {
  name: string;
  type: string;
}
