import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";

import { IOption, IWidget } from "../integration-data-model";
import generateComponent, { IComponent, IProp } from "./component-generator";
import { convertTypes } from "./converter";
import { removeExtension, removePrefix, toKebabCase } from "./helpers";
import generateIndex from "./index-generator";

function generate(
  rawData: IWidget[],
  baseComponent: string,
  out: {
    componentsDir: string,
    indexFileName: string
  }
) {
  const modulePaths: string[] = [];

  rawData.forEach((data) => {
    const widgetFile = mapWidget(data, baseComponent);
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component), { encoding: "utf8" });
    modulePaths.push(
      "./" + removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, "/")
    );
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: "utf8" });
}

function mapWidget(raw: IWidget, baseComponent: string): { fileName: string, component: IComponent } {
  const name = removePrefix(raw.name, "dx");

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      dxExportPath: raw.exportPath,
      props: raw.options.map(mapProp),
      hasModel: !!raw.isEditor,
    }
  };
}

function mapProp(rawOption: IOption): IProp {
  const types = convertTypes(rawOption.types);
  return {
    name: rawOption.name,
    acceptableValues: rawOption.valueRestriction && rawOption.valueRestriction.acceptableValues,
    types,
    isArray: types && types.length === 1 && types[0] === "Array"
  };
}

export default generate;
