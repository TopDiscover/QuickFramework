import { sys } from "cc";
import { TaxiData } from "./TaxiData";

const ZH = {
    language: sys.Language.CHINESE,
    data : {
        tips : [
            '请快一点，我要起飞机',
            '最美的一天不是下雨天',
        ],
        loadingRes : "正在加载游戏资源...",
        loadingMap : "正在加载游戏地图..."
    }
}

const EN = {
    language: sys.Language.ENGLISH,
    data : {
        tips : [
            'Please hurry up.\n I have a plane to catch',
            'The most beautiful day \nis not the rainy day',
        ],
        loadingRes : "正在加载游戏资源...",
        loadingMap : "正在加载游戏地图..."
    }
}

export class TaxiLanguage implements Language.DataSourceDelegate{
    name = TaxiData.bundle
    data( language : string , source : any): Language.Data {

        let data : any = source;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return source;
        }
        let lan = ZH;
        if (language == EN.language) {
            lan = EN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        return source;
    }
}