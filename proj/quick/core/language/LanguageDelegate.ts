import { EDITOR } from "cc/env";

/**
 * @description 语言包数据代理
 */
export abstract class LanguageDelegate{
    constructor(){
        this.init();
    }
    /**@description 语言包所在bundle */
    abstract bundle : string;
    private datas : Map<string,Language.Data | Language.BundleData> = new Map();
    /**
     * @description 数据初始化
     * @example 
     * init(): void {
     *     this.add(TANK_LAN_EN);
     *     this.add(TANK_LAN_ZH);
     * }
     */
    abstract init():void;
    add( data : Language.Data | Language.BundleData ){
        this.datas.set(data.language,data);
    }

    get( lang : string  ){
        return this.datas.get(lang);
    }

    /**
     * @description 数据合并,由管理器Language调用
     * @param language 语言
     * @param source 总语言包数据
     */
    merge( language : string , source : Language.Data): Language.Data {
        let realData = this.datas.get(language);
        if ( realData ){
            source[this.bundle] = realData.data;
        }
        return source;
    }

    /**
     * @description 合并数据,返回以 data1 为主的数据
     * @param data1
     * @param data2 
     */
    mergeData( data1 : Language.Data , data2 : Language.Data ){
        let result = data1;
        if ( data2 && data1 ){
            let _data2 = data2.data as any;
            let _data1 = data1.data as any;
            Object.keys(_data2).forEach(v=>{
                if ( !_data1[v] ){
                    _data1[v] = _data2[v];
                }
            })
        }
        return result;
    }
}

/**
 * @description 编辑器模式下注入Bundle语言包数据
 * @param type Language.DataSourceDelegate
 */
export function injectLanguageData( type : any ){
    if ( EDITOR ){
        let data = new (type as any);
        App.language.addDelegate(data);
    }
}