import { EventApi } from "../event/EventApi";
import { ENABLE_CHANGE_LANGUAGE, USING_LAN_KEY } from "./Defines";
import { Manager } from "../Framework";
import { sys } from "cc";
const LANG_KEY: string = "using_language";

export interface LanguageData {
    language: string;
}

export const COMMON_LANGUAGE_NAME = "COMMON_LANGUAGE_NAME";
/**
 * @description 数据代理
 * 如果是公共总合，name使用 COMMON_LANGUAGE_NAME
 */
export interface LanguageDataSourceDelegate {
    name: string;
    data(language: string): LanguageData;
}

export class Language {

    private static _instance: Language = null!;
    public static Instance() { return this._instance || (this._instance = new Language()); }

    private _data: LanguageData = { language: "unknown" };
    private delegates: LanguageDataSourceDelegate[] = [];

    public addSourceDelegate(delegate: LanguageDataSourceDelegate) {
        if (this.delegates.indexOf(delegate) == -1) {
            this.delegates.push(delegate);
            this.updateSource(this.getLanguage());
        }
    }

    private updateSource(language: string) {
        this.delegates.forEach((delegate, index, source) => {
            this._data = delegate.data(language);
        });
    }

    public removeSourceDelegate(delegate: LanguageDataSourceDelegate) {
        let index = this.delegates.indexOf(delegate);
        if (index != -1) {
            this.delegates.splice(index, 1);
            let data: any = this._data;
            if (delegate.name != COMMON_LANGUAGE_NAME && data[delegate.name]) {
                data[delegate.name] = {};
            }
        }
    }

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    public change(language: string) {
        if (this.delegates.length <= 0) {
            //请先设置代理
            return;
        }
        if (this._data && this._data.language == language) {
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        if (ENABLE_CHANGE_LANGUAGE) {
            //先更新所有数据
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.data(language);
            });
            //通知更新
            dispatch(EventApi.CHANGE_LANGUAGE, language);
        } else {
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.data(this.getLanguage());
            });
        }
        Manager.localStorage.setItem(LANG_KEY, this._data.language);
    }

    public get(args: (string | number)[]) {
        let result: any = "";
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
                if (typeof (data) == "string") {
                    result = String.format(data, args);
                } else {
                    result = data;
                }

            } else {
                //已经是取出的正确语言包，直接格式化
                let data = args.shift();
                if (typeof (data) == "string") {
                    return String.format(data, args);
                } else {
                    result = data;
                }
            }
        } while (0);
        return result;
    }

    /**@description 获取语言包名 */
    public getLanguage() {
        return Manager.localStorage.getItem(LANG_KEY, sys.Language.CHINESE);
    }
}
