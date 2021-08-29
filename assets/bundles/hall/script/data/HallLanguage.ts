/**@description 语言包具体的代码实现 */
import { i18n } from "../../../../scripts/common/language/CommonLanguage";
import { HallData } from "./HallData";
import { HALL_EN } from "./HallLanguageEN";
import { HALL_ZH } from "./HallLanguageZH";


export class HallLanguage implements td.Language.DataSourceDelegate{
    name = HallData.bundle;
    data( language : string ): td.Language.Data {
        let data : any = i18n;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return i18n;
        }
        let lan = HALL_ZH;
        if (language == HALL_EN.language) {
            lan = HALL_EN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        return i18n;
    }
}