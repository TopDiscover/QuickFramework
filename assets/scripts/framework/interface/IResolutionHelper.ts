import { IFullScreenAdapt } from "../ui/IFullScreenAdapter";
import { Node } from "cc"
import { ISingleManager } from "./ISingleManager";

export interface IResolutionHelper extends ISingleManager {
    isShowKeyboard: boolean;
    fullScreenAdapt(node: Node, adpater?: IFullScreenAdapt | undefined): void;
    readonly isNeedAdapt: boolean;
    /**@description 浏览器适配初始化 */
    initBrowserAdaptor(): void;
    readonly isBrowser: boolean;
}