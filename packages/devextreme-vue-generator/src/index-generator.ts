import { createTempate } from "./template";

interface IReExport {
  name: string;
  path: string;
}

function generate(paths: IReExport[]): string {
  return render(paths);
}

const render: (model: IReExport[]) => string = createTempate(`
<#~ it :reExport #>export { <#= reExport.name #> } from "<#= reExport.path #>";
<#~#>
`.trim());

export default generate;
export {
  IReExport
};
