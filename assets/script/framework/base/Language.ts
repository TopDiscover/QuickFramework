import { getSingleton } from "../../framework/base/Singleton";
import { localStorage } from "../../framework/base/LocalStorage"
import { uiManager } from "./UIManager";
const LANG_KEY: string = "using_language";

export interface LanguageData{
    language : string;
}

export function language(){
    return getSingleton(Language);
}

export interface LanguageDelegate{
    data( language : string ) : LanguageData;
}

class Language{
    
    private static _instance: Language = null;
    public static Instance() { return this._instance || (this._instance = new Language()); }

    private _data : LanguageData = { language : "unknown"};
    public get data() {
        return this._data;
    }
    private _delegate : LanguageDelegate;
    public set delegate( value ){
        this._delegate = value;
        this.change(this.getLanguage());
    }
    public get delegate(){
        return this._delegate;
    }

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    public change( language : string ){
        if ( !this.delegate ){
            //请先设置代理
            return;
        }
        if ( this._data && this._data.language == language ){
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        this._data = this.delegate.data(language);
        uiManager().languageAdapt();
        localStorage().setItem(LANG_KEY,this._data.language);
    }

    public get( key : string ){
        let values = key.split(".");
        if ( values.length <= 0 ){
            cc.error(`key error`);
            return "";
        }
        let result = this._data[values[0]];
        if ( !result ){
            cc.error("data error");
            return "";
        }
        let i = 0;
        for ( i = 0 ; i < values.length ; i++ ){
            if ( result[values[i]] == undefined ){
                break;
            }
            result = result[values[i]];
        }
        if ( i != values.length-1 ){
            cc.error(`语言包不存在 : ${key}`);
        }
        return result;
    }

    /**@description 获取语言包名 */
    public getLanguage(){
        return localStorage().getItem(LANG_KEY,null);
    }
}
