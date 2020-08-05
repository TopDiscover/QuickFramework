/**@description 语言包具体的代码实现 */

import { LanguageDelegate, LanguageData, language } from "../../framework/base/Language";
import { LanguageCN } from "./LanguageCN";
import { LanguageEN } from "./LanguageEN";

export class LanguageImpl implements LanguageDelegate{
    data( language : string ): LanguageData {
        if ( language && language == LanguageEN.language ){
            return LanguageEN;
        }
        //默认中文
        return LanguageCN;
    }
}