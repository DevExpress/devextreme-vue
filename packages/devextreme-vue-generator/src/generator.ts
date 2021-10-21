import {
  IComplexProp,
  IComponentRef,
  ICustomType,
  IModel,
  IProp as IOption,
  ITypeDescr,
  IWidget
} from "devextreme-internal-tools/integration-data-model";

import { writeFileSync as writeFile } from "fs";

import {
  dirname as getDirName,
  join as joinPaths,
  normalize as normalizePath,
  relative as getRelativePath,
  sep as pathSeparator
} from "path";

import generateComponent, {
  generateReExport,
  IComponent,
  IExpectedChild,
  INestedComponent,
  IProp
} from "./component-generator";

import { convertTypes } from "./converter";
import { removeExtension, removePrefix, toKebabCase, uppercaseFirst } from "./helpers";
import generateIndex, { IReExport } from "./index-generator";

function generate(
  rawData: IModel,
  baseComponentPath: string,
  configComponentPath: string,
  out: {
    componentsDir: string,
    oldComponentsDir: string,
    indexFileName: string
  },
  widgetsPackage: string,
  vueVersion: number
) {
  const modulePaths: IReExport[] = [];

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(
      data,
      baseComponentPath,
      configComponentPath,
      rawData.customTypes
    );
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(
      widgetFilePath,
      generateComponent(widgetFile.component, widgetsPackage, vueVersion),
      { encoding: "utf8" });
    modulePaths.push({
      name: widgetFile.component.name,
      path: "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    });

    writeFile(
      joinPaths(out.oldComponentsDir, widgetFile.fileName),
      generateReExport(
        normalizePath("./" + removeExtension(getRelativePath(out.oldComponentsDir, widgetFilePath)))
          .replace(pathSeparator, "/"),
        removeExtension(widgetFile.fileName)
      )
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(
  raw: IWidget,
  baseComponentPath: string,
  configComponentPath: string,
  customTypes: ICustomType[]
): {
  fileName: string,
  component: IComponent
} {
  const name = removePrefix(raw.name, "dx");

  const customTypeHash = customTypes.reduce((result, type) => {
    result[type.name] = type;
    return result;
  }, {});

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name: `Dx${name}`,
      widgetComponent: {
        name,
        path: raw.exportPath
      },
      baseComponent: {
        name: raw.isExtension ? "createExtensionComponent" : "createComponent",
        path: baseComponentPath,
      },
      configComponent: {
        name: "createConfigurationComponent",
        path: configComponentPath
      },
      props: getProps(raw.options, customTypeHash),
      hasModel: !!raw.isEditor,
      hasExplicitTypes: !!raw.optionsTypeParams?.length,
      nestedComponents: raw.complexOptions
        ? raw.complexOptions.map((o) => mapNestedComponent(o, customTypeHash))
        : undefined,
        expectedChildren: mapExpectedChildren(raw.nesteds)
    }
  };
}

function mapNestedComponent(
  complexOption: IComplexProp,
  customTypes: Record<string, ICustomType>
): INestedComponent {
  return {
    name: `Dx${uppercaseFirst(complexOption.name)}`,
    optionName: complexOption.optionName,
    props: getProps(complexOption.props, customTypes),
    isCollectionItem: complexOption.isCollectionItem,
    predefinedProps: complexOption.predefinedProps,
    expectedChildren: mapExpectedChildren(complexOption.nesteds)
  };
}

function getProps(options: IOption[], customTypes: Record<string, ICustomType>) {
  const reservedPropNames = ["key"];
  return options.filter((o) => reservedPropNames.indexOf(o.name) < 0).map((o) => mapProp(o, customTypes));
}

function buildValueRestriction(restrictedTypes) {
  const valueRestriction = restrictedTypes.length > 0 ? restrictedTypes[0] : undefined;
  const acceptableValueType = valueRestriction && valueRestriction.type.toLowerCase();
  if (!valueRestriction || acceptableValueType === "string") {
    return { };
  }

  return {
    acceptableValueType,
    acceptableValues : valueRestriction.acceptableValues,
  };
}

function mapProp(rawOption: IOption, customTypes: Record<string, ICustomType>): IProp {
  const types = convertTypes(rawOption.types, customTypes);
  const restrictedTypes: ITypeDescr[] = rawOption.types.filter(
    (t) => t.acceptableValues && t.acceptableValues.length > 0
  );

  const valueRestriction = buildValueRestriction(restrictedTypes);

  return {
    name: rawOption.name,
    acceptableValues: valueRestriction.acceptableValues,
    types,
    isArray: types && types.length === 1 && types[0] === "Array",
    acceptableValueType: valueRestriction.acceptableValueType
  };
}

function mapExpectedChildren(nesteds: IComponentRef[]): Record<string, IExpectedChild> | undefined {
  if (!nesteds || nesteds.length === 0) {
    return;
  }

  const expectedChildren = {};
  nesteds.forEach((n) => {
    expectedChildren[n.componentName] = {
      isCollectionItem: !!n.isCollectionItem,
      optionName: n.optionName
    };
  });

  return expectedChildren;
}

export default generate;
export {
  mapWidget
};
