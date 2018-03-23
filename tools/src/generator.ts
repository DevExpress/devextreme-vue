import { writeFileSync as writeFile } from "fs";
import { dirname as getDirName, join as joinPaths, relative as getRelativePath, sep as pathSeparator } from "path";
import generateComponent from "./component-generator";
import { removeExtension, removePrefix, toKebabCase } from "./helpers";
import generateIndex from "./index-generator";

function generate(
  rawData: any[],
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

function mapWidget(raw: any, baseComponent: string) {
  const name = removePrefix(raw.name, "dx");

  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      dxExportPath: raw.exportPath,
      templates: raw.templates,
      subscribableOptions: raw.subscribableOptions
    }
  };
}

export default generate;
