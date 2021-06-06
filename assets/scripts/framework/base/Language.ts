import { EventApi } from "../event/EventApi";
import { ENABLE_CHANGE_LANGUAGE, USING_LAN_KEY } from "./Defines";
import { Manager } from "../Framework";
import { sys } from "cc";
const LANG_KEY: string = "using_language";

export interface LanguageData {
    language: string;
}

export interface LanguageDelegate {
    data(language: string): LanguageData;
}

export class Language {

    private static _instance: Language = null!;
    public static Instance() { return this._instance || (this._instance = new Language()); }

    private _data: LanguageData = { language: "unknown" };
    private _delegate: LanguageDelegate | null = null;
    public set delegate(value) {
        this._delegate = value;
        this.change(this.getLanguage());
    }
    public get delegate() {
        return this._delegate;
    }

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    public change(language: string) {
        if (!this.delegate) {
            //请先设置代理
            return;
        }
        if (this._data && this._data.language == language) {
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        if (ENABLE_CHANGE_LANGUAGE) {
            this._data = this.delegate.data(language);
            dispatch(EventApi.CHANGE_LANGUAGE, language);
        } else {
            this._data = this.delegate.data(this.getLanguage());
        }
        Manager.localStorage.setItem(LANG_KEY, this._data.language);
    }

    public get(args: (string | number)[]) {
        let result = "";
        do {
            if (!!!args) break;
            if (args.length < 1) break;
            let keyString = args[0];
            if (typeof keyString != "string") {
                error("key error");
                break;
            }
            if (keyString.indexOf(USING_LAN_KEY) > -1) {

                let keys = keyString.split(".");
                if (keys.length < 2) {
                    error("key error");
                    break;
                }
                keys.shift();//删除掉i18n.的头部
                args.shift();
                let data = (<any>this._data)[keys[0]];
                if (!data) {
                    error(`语言包不存在 : ${keyString}`);
                    break;
                }
                let i = 1;
                for (; i < keys.length; i++) {
                    if (data[keys[i]] == undefined) {
                        break;
                    }
                    data = data[keys[i]];
                }
                if (i != keys.length) {
                    error(`语言包不存在 : ${keyString}`);
                }
                result = String.format(data, args);
            } else {
                //已经是取出的正确语言包，直接格式化
                keyString = args.shift() as string;
                return String.format(keyString, args);
            }
        } while (0);
        return result;
    }

    /**@description 获取语言包名 */
    public getLanguage() {
        return Manager.localStorage.getItem(LANG_KEY, sys.Language.LANGUAGE_CHINESE);
    }
}
