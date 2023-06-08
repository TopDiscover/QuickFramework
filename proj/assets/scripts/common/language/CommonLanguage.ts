/**@description 语言包具体的代码实现 */

import { LanguageZH } from "./LanguageZH";
import { LanguageEN } from "./LanguageEN";
import { Macro } from "../../framework/defines/Macros";
import { LanguageDelegate } from "../../framework/core/language/LanguageDelegate";
import { Bundles } from "../data/Bundles";

export class CommonLanguage extends LanguageDelegate{
    init(): void {

        Bundles.datas.forEach(v=>{
            LanguageEN.data.bundles[v.bundle] = v.name.EN;
            LanguageZH.data.bundles[v.bundle] = v.name.CN;
        })
        this.add(LanguageEN);
        this.add(LanguageZH);
    }
    bundle = Macro.BUNDLE_RESOURCES;
}