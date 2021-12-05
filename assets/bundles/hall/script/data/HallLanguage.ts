/**@description 语言包具体的代码实现 */
import { HallData } from "./HallData";
import { HALL_EN } from "./HallLanguageEN";
import { HALL_ZH } from "./HallLanguageZH";


export class HallLanguage implements Language.DataSourceDelegate{
    name = HallData.bundle;
    data( language : string , source : any): Language.Data {
        let data : any = source;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return source;
        }
        let lan = HALL_ZH;
        if (language == HALL_EN.language) {
            lan = HALL_EN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        return source;
    }
}