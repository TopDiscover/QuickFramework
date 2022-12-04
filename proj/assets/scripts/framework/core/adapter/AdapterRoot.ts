/**
 */

import { view, _decorator ,screen } from "cc";
import { Adapter } from "./Adapter";

const { ccclass, property ,executeInEditMode,menu} = _decorator;

/**
 * 游戏主内容节点自适应所有分辨率的脚本
 * 
 * @author caizhitao
 * @created 2020-12-27 21:22:43
 * @description 该适配方案出处 https://forum.cocos.org/t/cocos-creator/74001
 *
 * 用法：
 *      1. 将本节点直接挂载到Canvas节点做为根节点的适配
 *
 * 适配原理：
 *      1. 将游戏主内容节点的宽高设置为画布的大小
 *
 * 注意：
 *      1. 挂载这个脚本的节点不能加入Widget组件，不然这个适配是没有效果的
 *      2. 目前只支持 SHOW_ALL 模式下的背景缩放适配，不支持其他模式的背景缩放
 *
 *  @example
    ```
    // e.g.
    // 代码中设置 SHOW_ALL 模式的参考代码
    cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);

    // 或者 Canvas 组件中，同时勾选 Fit Width 和 Fit Height 
    ```
 */
@ccclass
@executeInEditMode(true)
@menu("Quick适配组件/AdapterRoot")
export default class AdapterRoot extends Adapter {

    onLoad() {
        this._onResize();
    }

    onEnable() {
        let onResize = this._onResize.bind(this);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
    }

    onDisable() {
        let onResize = this._onResize.bind(this);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
    }

    /**
     * 窗口尺寸发生改变时，更新适配节点的宽高
     */
    private _onResize() {

        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        let canvasSize = screen.windowSize
        let widthRate = canvasSize.width / this.width;
        let heightRate = canvasSize.height / this.height;
        let scaleForShow = Math.min(widthRate,heightRate);
        // Log.d('scaleForShow:'+scaleForShow);
        let realWidth = this.width * scaleForShow;
        let realHeight = this.height * scaleForShow;

        // 2. 基于第一步的数据，再做缩放适配
        widthRate = canvasSize.width / realWidth;
        heightRate = canvasSize.height / realHeight;
        let scaleForShowAll = Math.max(widthRate,heightRate);

        // // 1. 计算 SHOW_ALL 模式下，本节点缩放到完全能显示节点所有内容的实际缩放值
        let designWidth = view.getVisibleSize().width;
        let designHeight = view.getVisibleSize().height;

        // Log.d('designWidth:'+designWidth);
        // Log.d('designHeight:'+designHeight);

        // Log.d('realWidth:'+realWidth);
        // Log.d('realHeight:'+realHeight);
        // Log.d('scaleForShowAll:'+scaleForShowAll);
        // // 2. 根据缩放值，重新设置节点的宽高

        this.width = realWidth * scaleForShowAll;
        this.height = realHeight * scaleForShowAll;
        // Log.d('width:' + this.width);
        // Log.d('height:' + this.height);
        // Log.d(`视图窗口可见区域分辨率: ${view.getVisibleSize().width} x ${view.getVisibleSize().height}`);
    }
}
