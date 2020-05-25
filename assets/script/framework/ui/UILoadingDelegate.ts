/*
 * @Author: your name
 * @Date: 2020-04-10 12:31:02
 * @LastEditTime: 2020-04-20 16:54:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\assets\framework\ui\UILoadingView.ts
 */

 /**@description 界面加载动画，web端在下载界面时，如果超过了一定时间，需要弹出动画，告诉用户当前加载界面的进度 */
export default class UILoadingDelegate {

    /**
     * @description 显示全屏幕加载动画
     * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
     */
    public show( delay : number , name : string) {
        
    }

    /**
     * @description 更新进度，0-100
     * @param progress 0-100
     */
    public updateProgress( progress : number ){
        
    }

    public hide( ) {
        
    }
}
