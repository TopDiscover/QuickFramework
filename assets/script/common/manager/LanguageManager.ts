import { LanguageCN } from "../data/LanguageCN";
import { LanguageEN } from "../data/LanguageEN";

export let LANG = LanguageCN;

const { ccclass, property } = cc._decorator;

const LANG_KEY: string = "using_language";

@ccclass
export default class LanguageManager {

    //获取语言包，游戏初始化时调用
    public static getLanguage(){
        let value: string = cc.sys.localStorage.getItem(LANG_KEY);
        if (!value || value === '') {
            LanguageManager.setLanguage('CN');
        } else {
            LanguageManager.setLanguage(value);
        }
    }

    //设置语言包，变更语言时调用
    public static setLanguage(lang: string){
        if (lang === 'EN') {
            LANG = LanguageEN;
        } else if (lang === 'CN') {
            LANG = LanguageCN;
        } else {
            return;
        }
        
        cc.sys.localStorage.setItem(LANG_KEY, lang);
    }
}