import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";

import { IComplexProp, ICustomType, IModel, IProp as IOption, ITypeDescr, IWidget } from "../integration-data-model";
import generateComponent, { IComponent, INestedComponent, IProp } from "./component-generator";
import { convertTypes } from "./converter";
import { removeExtension, removePrefix, toKebabCase, uppercaseFirst } from "./helpers";
import generateIndex from "./index-generator";

function generate(
  rawData: IModel,
  baseComponent: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: string[] = [];

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent, rawData.customTypes);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push(
      "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(raw: IWidget, baseComponent: string, customTypes: ICustomType[]): {
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
      name,
      baseComponentPath: baseComponent,
      dxExportPath: raw.exportPath,
      props: raw.options.map((o) => mapProp(o, customTypeHash)),
      hasModel: !!raw.isEditor,
      isExtension: !!raw.isExtension,
      nestedComponents: raw.complexOptions
        ? raw.complexOptions.map((o) => mapNestedComponent(o, customTypeHash))
        : undefined
    }
  };
}

function mapNestedComponent(complexOption: IComplexProp, customTypes: Record<string, ICustomType>): INestedComponent {
  return {
    name: uppercaseFirst(complexOption.name),
    optionName: complexOption.optionName,
    props: complexOption.props.map((o) => mapProp(o, customTypes))
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
