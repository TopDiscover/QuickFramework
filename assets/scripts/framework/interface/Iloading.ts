
import { Node } from 'cc';
import { ISingleManager } from './ISingleManager';

export interface Iloading extends ISingleManager {
    /**@description 显示超时回调 */
    timeOutCb ?: ()=>void;
    /**@description 预加载预置 */
    preloadPrefab():void;

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
     show( content : string | string[] , timeOutCb?:()=>void,timeout?:number ):void;

     /**@description 隐藏Loading */
     hide():void;
}