import Loading from "./Loading";
/**
 * @description 加载动画
 */

export default class UpdateLoading extends Loading {
    protected static _instance: UpdateLoading = null!;
    public static Instance() { return this._instance || (this._instance = new UpdateLoading()); }

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show( content : string | string[] , timeOutCb?:()=>void,timeout?:number ) {
        this.timeOutCb = undefined;
        this._show(999);
        this._content = [];
        if ( typeof content == "string"){
            this._content.push(content);
        }
        return this;
    }

    protected startShowContent( ){
        this.text.string = this._content[0];
    }

    public updateProgress(progress: number) {
        if (this.text) {
            if (progress == undefined || progress == null || Number.isNaN(progress) || progress < 0) {
                this.hide();
                return;
            }
            if (progress >= 0 && progress <= 100) {
                this.text.string = Manager.getLanguage(["loadingProgress",progress]);
            }
        }
    }
}
