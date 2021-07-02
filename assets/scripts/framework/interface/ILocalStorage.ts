import { ISingleManager } from "./ISingleManager";

export interface ILocalStorage extends ISingleManager {
    getItem(key: string, defaultValue?: any): any;
    setItem(key: string, value: string | number | boolean | object): void;
    removeItem(key: string): void;
}