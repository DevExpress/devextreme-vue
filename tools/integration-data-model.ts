export interface IModel {
  customTypes: ICustomType[];
  widgets: IWidget[];
}

export interface IWidget {
  exportPath: string;
  isEditor: boolean;
  isExtension: boolean;
  name: string;
  options: IProp[];
  templates: string[];
}

export interface IProp {
  isSubscribable: boolean;
  name: string;
  props: IProp[];
  types: ITypeDescr[];
}

export interface ICustomType {
  name: string;
  props: IProp[];
}

export interface ITypeDescr {
  acceptableValues: string[];
  isCustomType: boolean;
  type: string;
}

export interface IArrayDescr extends ITypeDescr {
  itemTypes: ITypeDescr[];
}

export interface IFunctionDescr extends ITypeDescr {
  params: {
    name: string;
    types: ITypeDescr[];
  }[];
  returnValueType: ITypeDescr;
}

export interface IObjectDescr extends ITypeDescr {
  fields: {
    name: string;
    types: ITypeDescr[];
  }[];
}
