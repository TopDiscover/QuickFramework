
import { LogLevel } from '../../framework/defines/Enums';
import { Config } from '../config/Config';
const { ccclass, property } = cc._decorator;

@ccclass
export class DebugView extends cc.Component {

    private logView: cc.Node = null!;
    private content: cc.Node = null!;
    onLoad() {

        this.content = cc.find("content", this.node);
        //显示界面信息
        this.bindEvent("showUI",this.onShowUI);
        //显示节点信息
        this.bindEvent("showNode",this.onShowNode);
        //显示资源缓存信息
        this.bindEvent("showRes",this.onShowRes);
        //显示当前组件信息
        this.bindEvent("showComponent",this.onShowComp);
        //显示调试信息
        this.bindEvent("showDebugInfo",this.onShowDebugInfo);
        this.bindEvent("log",this.onLog);
        //逻辑管理器信息输出
        this.bindEvent("logic",this.onLogicManager);
        //数据中心
        this.bindEvent("dataCenter",this.onDataCenter);
        //bundle入口管理器
        this.bindEvent("entry",this.onEntry);
        //proto 信息输出 
        this.bindEvent("proto",this.onProto);
        //bundle管理器
        this.bindEvent("bundleMgr",this.onBundleMgr);
        //节点缓存池
        this.bindEvent("pool",this.onPool);
        //网络辅助类
        this.bindEvent("netHelper",this.onNetHelper);
        //网络管理器
        this.bindEvent("serviceManager",this.onServiceManager);
        //热火更新管理
        this.bindEvent("hotupdate",this.onHotUpdate);
        //内存警告
        this.bindEvent("lowMemory",this.onLowMemory);
        //释放管理器
        this.bindEvent("releaseManager",this.onReleaseManager);
        //适配器
        this.bindEvent("adaptor", this.onAdaptor);
        this.doOther();
    }
    debug: cc.Node = null!;

    private doOther(){
        let logView = cc.find("logView", this.node);
        if (logView) {
            logView.active = false;
            this.logView = logView;
            this.initLogView();
        }

        let background = cc.find("background", this.node);
        if (background) {
            background.on(cc.Node.EventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug) this.debug.active = true;
            });
        }
    }

    private bindEvent(path : string ,cb:Function){
        let node = cc.find(path,this.content);
        if( node ){
            node.on(cc.Node.EventType.TOUCH_END,cb,this);
        }
    }

    private initLogView() {
        let background = cc.find("background", this.logView);
        if (background) {
            background.on(cc.Node.EventType.TOUCH_END, () => {
                this.logView.active = false;
            });
        }

        let level = cc.find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = cc.find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(cc.Toggle);
                    if (toggle) {
                        toggle.isChecked = Manager.logger.isValid(this.getLogLevel(i));
                    }
                    node.on("toggle", (toggle: cc.Toggle) => {
                        if (toggle.isChecked) {
                            Manager.logger.attach(this.getLogLevel(i));
                        } else {
                            Manager.logger.detach(this.getLogLevel(i));
                        }
                    });
                }
            }
        }
    }

    private getLogLevel(index: number) {
        switch (index) {
            case 0: return LogLevel.DEBUG;
            case 1: return LogLevel.WARN;
            case 2: return LogLevel.ERROR;
            case 3: return LogLevel.DUMP;
            default: return LogLevel.DEBUG;
        }
    }

    private onLogicManager() {
        Log.d(`-------逻辑管理器数据-------`)
        Manager.logicManager.print({
            print: (data) => {
                Log.d(cc.js.getClassName(data));
            }
        });
    }

    private onDataCenter() {
        Log.d(`-------数据中心-------`)
        Manager.dataCenter.print({
            print: (data) => {
                Log.dump(data);
            }
        });
    }

    private onEntry() {
        Log.d(`-------Bundle入口管理器-------`)
        Manager.entryManager.print({
            print: (data) => {
                Log.d(`bundle : ${data.bundle}`);
            }
        })
    }

    private onProto() {
        Log.d(`-------Proto文件加载信息,所有proto文件都加载在同一个root下,文件加载完成后，资源文件就会初释放-------`);
        Manager.protoManager.print({
            print: (data) => {
                if ( cc.sys.isNative ){
                    Log.dump(data);
                }else{
                    Log.d(data);
                }
            }
        })
    }

    private onBundleMgr() {
        Log.d(`-------Bundle管理器状态信息-------`);
        Manager.bundleManager.print({
            print: (data) => {
                let bundles = [];
                for (let i = 0; i < data.loaded.length; i++) {
                    bundles.push(data.loaded[i].name);
                }
                Log.d(`当前所有加载完成的bundle : ${bundles.toString()}`);
            }
        })
    }

    private onPool(){
        Log.d(`-------对象池节点缓存信息-------`);
        Manager.nodePoolManager.print({
            print:( source )=>{
                source.forEach((data,key)=>{
                    Log.d(key);
                })
            }
        })
    }

    private onLog(){
        this.logView.active = true;
    }

    private onShowDebugInfo(){
        cc.debug.setDisplayStats(!cc.debug.isDisplayStats())
        Manager.localStorage.setItem(Config.SHOW_DEBUG_INFO_KEY,cc.debug.isDisplayStats());
    }

    private onShowUI(){
        Log.d(`-----------当前所有视图------------`);
        Manager.uiManager.print({
            printViews: (value, key) => {
                Log.d(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${cc.js.getClassName(value.view)} active : ${value.view && value.view.node ? value.view.node.active : false}`);
            }
        })
    }

    private onShowNode(){
        Log.d(`-----------当前所有节点信息------------`);
        Manager.uiManager.print({
            printChildren: (data) => {
                Log.d(`${data.name} active : ${data.active}`);
            }
        })
    }

    private onShowRes(){
        Manager.cacheManager.print({
            printLocal: (caches, key) => {
                if (CC_DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息开始----------------`)
                let content: any[] = [];
                let invalidContent: any[] = [];
                caches.forEach((data, key, source) => {
                    let itemContent = {
                        url: data.info.url,
                        isLoaded: data.isLoaded,
                        isValid: cc.isValid(data.data),
                        assetType: cc.js.getClassName(data.info.type),
                        data: data.data ? cc.js.getClassName(data.data) : null,
                        status: data.status
                    }
                    let item = { url: key, data: itemContent };

                    if (data.isLoaded && data.data && !cc.isValid(data.data)) {
                        invalidContent.push(item);
                    } else {
                        content.push(item);
                    }
                });
                if (content.length > 0) {
                    Log.d(`----------- 有效缓存信息 -----------`);
                    Log.d(JSON.stringify(content));
                }
                if (invalidContent.length > 0) {
                    Log.d(`----------- 无效缓存信息 -----------`);
                    Log.d(JSON.stringify(invalidContent));
                }
                if (CC_DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`)
            },
            printRemote: (spCaches, caches, infos) => {
                Log.d(`---- 远程加载资源缓存信息 ----`);

                let content: any[] = [];
                let invalidContent: any[] = [];
                spCaches.forEach((data, key, source) => {
                    let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: cc.isValid(data.data), assetType: cc.js.getClassName(data.info.type), data: data.data ? cc.js.getClassName(data.data) : null, status: data.status };
                    let item = { url: key, data: itemContent };
                    if (data.isLoaded && ((data.data && !cc.isValid(data.data)) || !data.data)) {
                        invalidContent.push(item);
                    } else {
                        content.push(item);
                    }
                });

                if (content.length > 0) {
                    Log.d(`----------------有效 spriteFrame 缓存信息------------------`);
                    Log.d(JSON.stringify(content));
                }
                if (invalidContent.length > 0) {
                    Log.d(`----------------无效 spriteFrame 缓存信息------------------`);
                    Log.d(JSON.stringify(invalidContent));
                }


                content = [];
                invalidContent = [];
                caches.forEach((data, key, source) => {
                    let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: cc.isValid(data.data), assetType: cc.js.getClassName(data.info.type), data: data.data ? cc.js.getClassName(data.data) : null, status: data.status }
                    let item = { url: key, data: itemContent };
                    if (data.isLoaded && data.data && !cc.isValid(data.data)) {
                        invalidContent.push(item);
                    } else {
                        content.push(item);
                    }
                });
                if (content.length > 0) {
                    Log.d(`----------------有效缓存信息------------------`);
                    Log.d(JSON.stringify(content));
                }
                if (invalidContent.length > 0) {
                    Log.d(`----------------无效缓存信息------------------`);
                    Log.d(JSON.stringify(invalidContent));
                }

                if (infos.size > 0) {
                    Log.d(`----------------当前资源引用计数信息------------------`);
                    content = [];
                    infos.forEach((value, key) => {
                        let item = { url: key, data: { refCount: value.refCount, url: value.url, retain: value.retain } };
                        content.push(item);
                    });
                    Log.d(JSON.stringify(content));
                }
            }
        })
    }

    private onShowComp(){
        Log.d(`-----------当前所有组件信息------------`);
        Manager.uiManager.print({
            printComp: (data) => {
                Log.d(cc.js.getClassName(data));
            }
        })
    }

    private onNetHelper(){
        Log.d(`-----------网络辅助相关信息------------`);
        Log.d(`-----------当前所有Sender------------`);
        Manager.netHelper.print({
            printSender:(data)=>{
                Log.d(data.module);
            }
        });
        Log.d(`-----------当前所有Handler------------`);
        Manager.netHelper.print({
            printHander:(data)=>{
                Log.d(data.module);
            }
        })
    }

    private onServiceManager(){
        Log.d(`-----------网络管理器中相关网络信息------------`);
        Manager.serviceManager.print({
            print:(service)=>{
                let content = `Module : ${service.module} , 进入后台的最大允许时间 : ${service.maxEnterBackgroundTime} , 优先级 : ${service.priority}`;
                Log.d(content);
                content = "重连信息 : "
                if ( service.reconnectHandler ){
                    content = `是否允许重连 : ${service.reconnectHandler.enabled}`
                }else{
                    content += "无重连Handler";
                }
                Log.d(content);
                content = `状态信息 , 是否允许连接网络 : ${ service.enabled } 是否连接 : ${service.isConnected} 网络数据类型 : ${service.serviceType}`
                Log.d(content);
            }
        })
    }

    private onHotUpdate(){
        Log.d(`-----------热火更新管理器中相关信息------------`);
        Manager.updateManager.print({
            print:(data)=>{
                Log.dump(data.data,data.name);
            }
        })
    }

    private onLowMemory(){
        Manager.onLowMemory();
    }

    private onReleaseManager(){
        Manager.releaseManger.print({
            print:(data)=>{
                if ( Manager.isLazyRelease ){
                    if ( data.bundles.length > 0 ){
                        Log.d(`待释放Bundle : ${data.bundles.toString()}`);
                    }
                    if ( data.lazyInfo.size > 0 ){
                        data.lazyInfo.forEach((value,key,source)=>{
                            Log.d(`--------------${key}待释放资源--------------`);
                            value.assets.forEach((info,key,source)=>{
                                Log.d(`${info.url}`);
                            })
                        });
                    }

                    Log.d(`远程待释放资源`);
                    data.remote.assets.forEach((info,key,source)=>{
                        Log.d(`${info.url}`);
                    });

                }else{
                    Log.w(`未开户懒释放功能!!!!`);
                }
            }
        })
    }

    private onAdaptor() {
        Log.d(`-----------------------------适配信息-----------------------------------------------`);
        Log.d(`屏幕分辨率: ${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`);
        Log.d(`视图窗口可见区域分辨率: ${cc.view.getVisibleSize().width} x ${cc.view.getVisibleSize().height}`);
        Log.d(`视图中边框尺寸: ${cc.view.getFrameSize().width} x ${cc.view.getFrameSize().height}`);
        Log.d(`设备或浏览器像素比例: ${cc.view.getDevicePixelRatio()}`);
        Log.d(`返回视图窗口可见区域像素尺寸: ${cc.view.getVisibleSizeInPixel().width} x ${cc.view.getVisibleSizeInPixel().height}`);
        Log.d(`当前场景设计分辨率: ${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`);
        let viewRate = cc.view.getFrameSize().width/cc.view.getFrameSize().height;
        let designRate = cc.view.getDesignResolutionSize().width/cc.view.getDesignResolutionSize().height;
        Log.d(`视图宽高比:${viewRate}`);
        Log.d(`设置分辨率宽高比:${designRate}`);
    }
}

