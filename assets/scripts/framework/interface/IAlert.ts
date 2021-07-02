
import { Node } from 'cc';
import { ISingleManager } from './ISingleManager';

export /**@description 提示弹出框配置 */
interface AlertConfig {
    /**@description 用来标识弹出框，后面可指定tag进行关闭所有相同tag的弹出框 */
    tag?: string | number,
    /**@description 提示内容 richText只能二先1 */
    text?: string,
    /**@description 标题,默认为 : 温馨提示 */
    title?: string,
    /**@description 确定按钮文字 默认为 : 确定*/
    confirmString?: string,
    /**@description 取消按钮文字 默认为 : 取消*/
    cancelString?: string,
    /**@description 确定按钮回调 有回调则显示按钮，无回调则不显示*/
    confirmCb?: (isOK: boolean) => void,
    /**@description 取消按钮回调 有回调则显示按钮，无回调则不显示*/
    cancelCb?: (isOK: boolean) => void,
    /**@description 富文件显示内容 跟text只能二选1 */
    richText?: string,
    /**@description true 回调后在关闭弹出 false 关闭弹出框在回调 默认为 : false */
    immediatelyCallback?: boolean,
    /**@description 是否允许该tag的弹出框重复弹出，默认为true 会弹出同类型的多个 */
    isRepeat?: boolean,
    /**@description 用户自定义数据 */
    userData?: any,
}

export interface IAlert extends ISingleManager {
    preloadPrefab():void;
    /**
     * @description 显示弹出框
     * @param config 配置信息
     */
     show(config: AlertConfig):boolean;

     /**@description 当前显示的弹出框是否是tag */
    isCurrentShow(tag: string | number):boolean;

    /**@description 获取当前显示弹出的配置 */
    currentShow(tag?: string | number | undefined): AlertConfig | null | undefined;

    /**@description 是否有该类型的弹出框 */
    isRepeat(tag: string | number):boolean;
    /**
     * @description 关闭当前显示的 
     * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
     */
    close(tag?: string | number | undefined): void;

    /**@description 关闭所有弹出框 */
    closeAll():void;

    /**@description 关闭当前弹出框，如果还有要显示的，继续显示下一个 */
    finishAlert():void;

}
