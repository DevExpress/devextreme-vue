export interface IWidget {
  exportPath: string;
  isEditor: boolean;
  name: string;
  options: IOption[];
  templates: string[];
}

export interface IOption {
  isSubscribable: boolean;
  name: string;
  options: IOption[];
  types: ITypeDescriptor[];
}

export interface ITypeDescriptor {
  acceptableValues: string[];
  type: string;
}

export interface IArrayDescriptor extends ITypeDescriptor {
  itemTypes: ITypeDescriptor[];
}

export interface IFunctionDescriptor extends ITypeDescriptor {
  params: {
    name: string;
    types: ITypeDescriptor[];
  }[]; // tslint:disable-line:array-type
  returnValueType: ITypeDescriptor;
}

export interface IObjectDescriptor extends ITypeDescriptor {
  fields: {
    name: string;
    types: ITypeDescriptor[];
  }[]; // tslint:disable-line:array-type
}
