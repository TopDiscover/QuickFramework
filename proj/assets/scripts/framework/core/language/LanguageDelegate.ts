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
    private datas : Map<string,Language.Data> = new Map();
    /**
     * @description 数据初始化
     * @example 
     * init(): void {
     *     this.add(TANK_LAN_EN);
     *     this.add(TANK_LAN_ZH);
     * }
     */
    abstract init():void;
    add( data : Language.Data ){
        this.datas.set(data.language,data);
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
}

/**
 * @description 编辑器模式下注入Bundle语言包数据
 * @param type Language.DataSourceDelegate
 */
export function injectLanguageData( type : any ){
    if ( EDITOR ){
        let data = new (type as any);
        Manager.language.addDelegate(data);
    }
}