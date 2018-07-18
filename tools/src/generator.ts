import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";

import { IComplexProp, ICustomType, IModel, IProp as IOption, ITypeDescr, IWidget } from "../integration-data-model";
import generateComponent, { IComponent, INestedComponent, IProp } from "./component-generator";
import { convertTypes } from "./converter";
import { removeExtension, removePrefix, toKebabCase, uppercaseFirst } from "./helpers";
import generateIndex, { IReExport } from "./index-generator";

function generate(
  rawData: IModel,
  baseComponentPath: string,
  configComponentPath: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: IReExport[] = [];

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponentPath, configComponentPath, rawData.customTypes);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push({
      name: widgetFile.component.name,
      path: "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    });
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
        name: raw.isExtension ? "DxExtensionComponent" : "DxComponent",
        path: baseComponentPath
      },
      configComponent: {
        name: "DxConfiguration",
        path: configComponentPath
      },
      props: raw.options.map((o) => mapProp(o, customTypeHash)),
      hasModel: !!raw.isEditor,
      nestedComponents: raw.complexOptions
        ? raw.complexOptions.map((o) => mapNestedComponent(o, customTypeHash))
        : undefined
    }
  };
}

function mapNestedComponent(complexOption: IComplexProp, customTypes: Record<string, ICustomType>): INestedComponent {
  return {
    name: `Dx${uppercaseFirst(complexOption.name)}`,
    optionName: complexOption.optionName,
    props: complexOption.props.map((o) => mapProp(o, customTypes)),
    isCollectionItem: complexOption.isCollectionItem
  };
}

function mapProp(rawOption: IOption, customTypes: Record<string, ICustomType>): IProp {
  const types = convertTypes(rawOption.types, customTypes);
  const restrictedTypes: ITypeDescr[] = rawOption.types.filter(
    (t) => t.acceptableValues && t.acceptableValues.length > 0
  );
  const valueRestriction: ITypeDescr = restrictedTypes.length > 0 ? restrictedTypes[0] : null;
  return {
    name: rawOption.name,
    acceptableValues: valueRestriction && valueRestriction.acceptableValues,
    types,
    isArray: types && types.length === 1 && types[0] === "Array",
    acceptableValueType: valueRestriction && valueRestriction.type.toLowerCase()
  };
}

export default generate;
