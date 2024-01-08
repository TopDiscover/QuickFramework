/**
 */

import { v3, _decorator, UITransform } from "cc";
import { EDITOR } from "cc/env";
import { Adapter } from "./Adapter";

const { ccclass, property, executeInEditMode, menu } = _decorator;
/**
 * 全屏适配
 * 用法：
 *
 * 1. 将本组件挂载在节点上即可（注意该节点不能挂在 Widget 组件）
 * 2. 3.x版本引擎旋转时不会触屏旋转事件，所以目前只能设置一个方向才是正常的
 *
 * 适配原理：
 *
 * 1. 将节点的宽高设置为安全区域的宽高
 */
@ccclass("AdapterView")
@executeInEditMode(true)
@menu("Quick适配组件/AdapterView")
export default class AdapterView extends Adapter {

    protected onChangeSize() {
        Adapter.safeArea = null as any;
        if (this.node) {
            if (App.isFullScreenAdaption) {
                // 将屏幕尺寸下的大小，转换为设计分辨率下的大小，重新给节点设置大小
                this.width = Adapter.safeArea.width / Adapter.safeArea.designPxToScreenPxRatio;
                this.height = Adapter.safeArea.height / Adapter.safeArea.designPxToScreenPxRatio;
            } else {
                // 将屏幕尺寸下的安全区域大小，转换为设计分辨率下的大小，重新给节点设置大小
                this.width = Adapter.safeArea.safe.width / Adapter.safeArea.designPxToScreenPxRatio;
                this.height = Adapter.safeArea.safe.height / Adapter.safeArea.designPxToScreenPxRatio;

                switch (this.direction) {
                    case Adapter.direction.LandscapeLeft:
                        this.node.setPosition(v3(Adapter.safeArea.outside.width / Adapter.safeArea.designPxToScreenPxRatio, 0));
                        break;
                    case Adapter.direction.LandscapeRight:
                        this.node.setPosition(v3(-Adapter.safeArea.outside.width / Adapter.safeArea.designPxToScreenPxRatio, 0));
                        break;
                    case Adapter.direction.Portrait:
                        this.node.setPosition(v3(0, -Adapter.safeArea.outside.height / Adapter.safeArea.designPxToScreenPxRatio));
                        break;
                    case Adapter.direction.UpsideDown:
                        this.node.setPosition(v3(0, Adapter.safeArea.outside.height / Adapter.safeArea.designPxToScreenPxRatio));
                        break;
                    default:
                        !EDITOR && Log.e(`获取不到设备方向，直接居中处理`);
                        this.node.setPosition(v3(0, 0));
                        break;
                }
            }
            this.doOnAdapterComplete();
        }
    }
}
