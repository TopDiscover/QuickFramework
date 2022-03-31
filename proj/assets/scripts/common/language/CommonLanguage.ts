/**@description 语言包具体的代码实现 */

import { LanguageZH } from "./LanguageZH";
import { LanguageEN } from "./LanguageEN";
import { Macro } from "../../framework/defines/Macros";

export class CommonLanguage implements Language.DataSourceDelegate{
    name = Macro.BUNDLE_RESOURCES;
    data( language : string , source : any): Language.Data {

        let data : any = source;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return source;
        }
        let lan = LanguageZH;
        if (language == LanguageEN.language) {
            lan = LanguageEN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        //默认中文
        return source;
    }
}