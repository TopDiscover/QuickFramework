/**@description 语言包具体的代码实现 */

import { LanguageZH } from "./LanguageZH";
import { LanguageEN } from "./LanguageEN";
import { Macro } from "../../framework/defines/Macros";
import { LanguageDelegate } from "../../framework/core/language/LanguageDelegate";

export class CommonLanguage extends LanguageDelegate{
    init(): void {
        this.add(LanguageEN);
        this.add(LanguageZH);
    }
    bundle = Macro.BUNDLE_RESOURCES;
}