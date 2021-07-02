import { ISingleManager } from "./ISingleManager";

export const COMMON_LANGUAGE_NAME = "COMMON_LANGUAGE_NAME";
export interface LanguageData {
    language: string;
}
/**
 * @description 数据代理
 * 如果是公共总合，name使用 COMMON_LANGUAGE_NAME
 */
export interface LanguageDataSourceDelegate {
    name: string;
    data(language: string): LanguageData;
}
export interface ILanguage extends ISingleManager {
    addSourceDelegate(delegate: LanguageDataSourceDelegate): void;

    removeSourceDelegate(delegate: LanguageDataSourceDelegate): void;

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    change(language: string): void;

    get(args: (string | number)[]): any;

    /**@description 获取语言包名 */
    getLanguage(): string;
}