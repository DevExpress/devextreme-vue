export interface IModel {
  customTypes: ICustomType[];
  widgets: IWidget[];
}

export interface IWidget {
  complexOptions: IComplexProp[];
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

export interface IComplexProp {
  isCollectionItem: boolean;
  name: string;
  optionName: string;
  owner: string;
  props: IProp[];
}

export interface ICustomType {
  name: string;
  props: IProp[];
  types: ITypeDescr[];
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
  // tslint:disable-next-line:array-type
  params: {
    name: string;
    types: ITypeDescr[];
  }[];
  returnValueType: ITypeDescr;
}

export interface IObjectDescr extends ITypeDescr {
  // tslint:disable-next-line:array-type
  fields: {
    name: string;
    types: ITypeDescr[];
  }[];
}
