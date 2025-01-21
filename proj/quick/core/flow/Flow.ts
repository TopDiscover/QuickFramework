/**
 * @description 流量控制中间件
 */

import { DEBUG } from "cc/env";

/**
 * @description 流程数据类型，从Flow泛型中推断实际类型
 */
export type FlowData<T extends Flow<any>> = T extends Flow<infer R> ? R : unknown;

/**
 * @description 流程节点函数类型，接收输入并返回处理结果
 */
export type FlowNode<T> = (item: T) => FlowNodeReturn<T> | Promise<FlowNodeReturn<T>>;

/**
 * @description 流程节点返回类型，可以是原始类型、null或undefined
 */
export type FlowNodeReturn<T> = T | null | undefined;

/**
 * @description 流程控制类，管理一系列节点的执行
 */
export class Flow<T> {

    /**
     * @description 是否只能允许一个节点函数,如果push多个，只会以最后一个为准
     */
    isUnique: boolean = false;
    constructor(isUnique: boolean = false) {
        this.isUnique = isUnique;
    }
    /**
     * @description 所有节点函数的集合，可以通过修改此数组调整执行顺序
     */
    nodes: FlowNode<T>[] = [];

    /**
     * @description 当节点函数抛出错误时触发的事件处理函数
     * @param e 捕获的错误对象
     * @param last 最后一次成功处理的结果
     * @param input 初始输入
     */
    onError: (e: Error, last: T, input: T) => void = null!;

    /**
     * @description 依次执行所有节点函数，前一个节点的输出作为下一个节点的输入
     * 
     * @remarks
     * 如果任何节点函数返回 `null | undefined`，或抛出错误，
     * 后续节点函数将不再执行。
     * 将立即返回 `null | undefined` 给调用者，
     * 告诉调用者意味着中断，
     * 让调用者停止后续行为。
     *
     * @param input 第一个节点的输入
     * @returns 处理结果
     */
    async exec(input: T): Promise<FlowNodeReturn<T>> {
        let res: any = input;
        for (let i = 0; i < this.nodes.length; i++) {
            try {
                res = await this.nodes[i](res);

                // 返回非真值意味着立即停止后续处理
                if (res === null || res === undefined) {
                    return res;
                }
            } catch (e) {
                this.onError(e as Error, res, input);
                return undefined;
            }
        }

        return res;
    }

    /**
     * @description 在末尾追加一个节点函数
     * @param node 要追加的节点函数
     * @returns 追加的节点函数
     */
    push<K extends T>(node: FlowNode<K>): FlowNode<K> {
        if (this.isUnique) {
            DEBUG && this.nodes.length > 0 && Log.w('Flow isUnique,只能生效最后一个节点');
            this.nodes = [];
        }
        this.nodes.push(node as any);
        return node;
    }

    /**
     * @description 移除指定的节点函数
     * @param node 要移除的节点函数
     * @returns 移除后的节点函数数组
     */
    remove<K extends T>(node: FlowNode<K>): FlowNode<T>[] {
        let index = this.nodes.indexOf(node as any);
        if (index >= 0) {
            this.nodes.splice(index, 1);
        }
        return this.nodes;
    }
}