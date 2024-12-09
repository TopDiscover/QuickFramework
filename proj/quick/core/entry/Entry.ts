import ResourceLoader from "../asset/ResourceLoader";
import { js, Node } from "cc";
import { DEBUG } from "cc/env";
import { LanguageDelegate } from "../language/LanguageDelegate";
import GameView from "../ui/GameView";
import { Update } from "../update/Update";
import { UpdateItem } from "../update/UpdateItem";

/**@description 入口数据 */
export class EntryData {
    constructor(data:BundleData){
        this.data = data;
        this.update = new Update.Config(this.getLanguage(data.bundle),data.bundle);
    }

    /**@description bundle 名 */
    get bundle(){
        return this.data.bundle;
    }

    /**@description 返回语言包 key */
    get language(){
        return this.update.name;
    }

    get name(){
        return this.data.name;
    }

    /**
     * @description 通过bundle名获取语言包key
     * @param bundle 
     * @returns 
     */
    private getLanguage(bundle: string) {
        return `bundles.${bundle}`;
    }

	/**@description bundle 数据 */
	data : BundleData = null!;
	/**@description 更新配置,由stage */
	update : Update.Config = null!;
}

export abstract class Entry {
    /**@description 子类可直接指定bundle 该值会设置到成员变量 bundle 上 */
    static bundle = "";
    gameViewType : typeof GameView = null!;
    /**@description 是否是主包入口，只能有一个主包入口 */
    isMain = false;
    /**@description 当前bundle名,由管理器指定 */
    bundle: string = "";
    /**@description 当前语言包数据源代码，可为null */
    protected language: LanguageDelegate | null = null;

    /**@description 模块资源加载器 */
    protected loader: ResourceLoader = null!;

    /**@description 当前MainController所在节点 */
    protected node: Node = null!;

    /**@description 当胆入口是否已经运行中 */
    isRunning: boolean = false;

    protected _gameView: GameView = null!;
    set gameView(gameView: GameView) {
        this._gameView = gameView;
    }
    get gameView() {
        return this._gameView;
    }

    constructor() {
        this.loader = new ResourceLoader();
    }

    /**@description init之后触发,由管理器统一调度 */
    onLoad(node: Node): void {
        this.node = node;
        this.isRunning = true;
    }

    /**@description 场景销毁时触发,管理器统一调度 */
    onDestroy(): void {
        this.isRunning = false;
    }

    /**@description 管理器通知自己进入GameView */
    onEnter( userData?:EntryUserData): void {
        //语言包初始化
        App.language.addDelegate(this.language);
        //初始化游戏数据
        this.initData();
        //添加网络事件
        this.addNetHandler();
        //暂停当前网络处理队列，等资源加载完成后打开界面
        this.pauseMessageQueue();
        //加载资源
        this.loadResources(() => {
            if ( userData && userData.isPreload ){
                //预加载资源，不打开界面
                this.onPreload();
            }else{
                this.onStartGameView(userData);
            }
        });
    }

    /**@description 预加载资源 */
    protected onPreload(){

    }

    /**@description 打开游戏主场景视图 */
    protected onStartGameView(userData?:EntryUserData){
        this.openGameView(userData);
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        DEBUG && Log.d(`${this.bundle} : onUnloadBundle`)
        //自己bundle初始卸载前要关闭当前bundle的所有界面
        App.uiManager.closeBundleView(this.bundle);
        //移除本模块网络事件
        this.removeNetHandler();
        //卸载资源
        this.unloadResources();
    }

    /**@description 添加该模块网络事件 */
    protected abstract addNetHandler(): void;
    protected abstract removeNetHandler(): void;

    /**@description 加载模块资源 */
    protected abstract loadResources(completeCb: () => void): void;
    protected unloadResources(): void {
        this.loader.unLoadResources();
    }

    /**@description 打开游戏主场景视图 */
    protected openGameView(userData?: any): void{
        App.uiManager.open({type : this.gameViewType , bundle : this.bundle,args:userData});
    }

    protected closeGameView(): void{
        App.uiManager.close(this.gameViewType)
    }

    /**@description 初始化游戏数据 */
    protected abstract initData(): void;

    /**@description 暂停网络 */
    protected abstract pauseMessageQueue(): void;

    protected abstract resumeMessageQueue(): void;

    /**@description 外部模块可直接指定bund进行去bundle内调用 */
    public call(eventName: string, args: any[]): void {

    }



    /**@description 这个位置说明自己GameView 进入onLoad完成 */
    onEnterGameView(gameView: GameView): void {
        this._gameView = gameView;
    }

    /**
     * @description GameView 销毁 
     * @param gameView 
     */
    onDestroyGameView(gameView: GameView) {
        //界面真正销毁时，才移除语言包(防止在释放队列中时，更新界面获取语言包数据出错)
        App.language.removeDelegate(this.language);
        this._gameView = null as any;
    }

    /**
     * @description GameView  显示
     * @param gameView 
     */
    onShowGameView(gameView: GameView) {
        this._gameView = gameView;
    }

    /**@description GameView 关闭 */
    onCloseGameView(gameView: GameView) {
        this._gameView = null!;
    }

    /**@description 主包更新完成 */
    onMainUpdateComplete(item: UpdateItem) {

    }

}