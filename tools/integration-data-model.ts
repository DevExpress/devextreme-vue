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
  types: ITypeDescriptor[];
}
export interface ITypeDescriptor {
  acceptableValues: string[];
  type: string;
  typeParams: ITypeDescriptor[];
}
export interface ISubscribableOption {
  name: string;
  type: string;
}
