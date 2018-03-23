import { template, templateSettings } from "dot";

const settings = {
    ...templateSettings,
    conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
    define: /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
    encode: /\<#!([\s\S]+?)#\>/g,
    evaluate: /\<#([\s\S]+?)#\>/g,
    interpolate: /\<#=([\s\S]+?)#\>/g,
    iterate: /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
    use: /\<##([\s\S]+?)#\>/g,
    strip: false,
    varname: "it"
};

const createTempate = (templateStr: string): ((model: any) => string) => template(templateStr, settings);

export default createTempate;
