/**@description 语言包具体的代码实现 */

import { LanguageZH } from "./LanguageZH";
import { LanguageEN } from "./LanguageEN";

export let i18n = LanguageZH;

export class CommonLanguage implements td.Language.DataSourceDelegate{
    name = td.Macro.COMMON_LANGUAGE_NAME;
    data( language : string ): td.Language.Data {
        if( i18n.language == language ){
            return i18n;
        }
        i18n = LanguageZH;
        if ( language == LanguageEN.language ){
            i18n = LanguageEN;
        }
        //默认中文
        return i18n;
    }
}