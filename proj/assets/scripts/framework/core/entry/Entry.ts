import ResourceLoader from "../asset/ResourceLoader";
import { js, Node } from "cc";
import { DEBUG } from "cc/env";
import { LanguageDelegate } from "../language/LanguageDelegate";
import GameView from "../ui/GameView";

export abstract class Entry {

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
    onEnter(userData?: any): void {
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
            this.openGameView();
        });
    }

    /**@description 这个位置说明自己GameView 进入onLoad完成 */
    onEnterGameView(gameViw: GameView): void {
        this._gameView = gameViw;
        let viewType = App.uiManager.getViewType(gameViw);
        if (viewType) {
            if (viewType.logicType) {
                viewType.logicType.module = gameViw.bundle as string;
                let logic = App.logicManager.get(viewType.logicType, true);
                if (logic) {
                    gameViw.setLogic(logic);
                }
            } else {
                if (DEBUG) {
                    Log.w(`${js.getClassName(viewType)}未指定logictype`);
                }
            }
        }
    }

    onShowGameView(gameView: GameView) {

    }

    onDestroyGameView(gameView: GameView) {
        this._gameView = null as any;
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        //自己bundle初始卸载前要关闭当前bundle的所有界面
        App.uiManager.closeBundleView(this.bundle);
        //移除入口语言包数据
        App.language.removeDelegate(this.language);
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
    protected openGameView(): void{
        App.uiManager.open({type : this.gameViewType , bundle : this.bundle});
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
}