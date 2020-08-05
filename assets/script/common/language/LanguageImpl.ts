/**@description 语言包具体的代码实现 */

import { LanguageDelegate, LanguageData } from "../../framework/base/Language";
import { LanguageCN } from "./LanguageCN";
import { LanguageEN } from "./LanguageEN";

export class LanguageImpl implements LanguageDelegate{
    private static _instance: LanguageImpl = null;
    public static Instance() { return this._instance || (this._instance = new LanguageImpl()); }
    data( language : string ): LanguageData {
        if ( language && language == LanguageEN.language ){
            return LanguageEN;
        }
        //默认中文
        return LanguageCN;
    }
}