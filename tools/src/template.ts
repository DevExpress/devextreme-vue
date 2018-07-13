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

const createTempate = (templateStr: string): ((model: any) => string) => {
    const templateFunc = template(templateStr, settings);

    return (model: any) => (templateFunc(model) as string)
        .replace(/[\s\S]{1}\x08{1}|[\s\S]{2}\x08{2}|[\s\S]{3}\x08{3}/g, "")
        .replace(/\x08/, "");
};

export default createTempate;
