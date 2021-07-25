
import { Asset } from "cc";
import UIView, { UIClass } from "../ui/UIView";
import { Service } from "./Service";

export interface ResourceData {
    /**@description resources 目录url 与 type 必须成对出现*/
    url?: string,
    /**@description 资源类型 与 url 必须成对出现 目前支持预加载的资源有cc.Prefab | cc.SpriteFrame | sp.SkeletonData*/
    type?: typeof Asset,
    /**
     * @description 预加载界面，不需要对url type赋值 
     * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
     * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
     * 从而会造成消息处理不是顺序执行 
     * */
    preloadView?: UIClass<UIView>,
    bundle?: BUNDLE_TYPE,
    /**@description 如果是加载的目录，请用dir字段 */
    dir?: string,
}

export interface ServiceEvent {
    service: Service;
    event: Event;
}
