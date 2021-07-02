/**
 * @description 所有子管理器，必须继承，由管理器统一给各管理器注入总管理器，解除代码的循环引用
 */
import { Node } from "cc";
export interface ISingleManager {
    onLoad(node: Node): void;
    onDestroy(node:Node): void;
}
