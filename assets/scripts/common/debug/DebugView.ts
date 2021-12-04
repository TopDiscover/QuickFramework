
import { _decorator, Component, Node, find, setDisplayStats, isDisplayStats, Toggle, js, isValid, sys, SystemEvent } from 'cc';
import { DEBUG } from 'cc/env';
import { LogLevel } from '../../framework/defines/Enums';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends Component {

    private logView: Node = null!;
    private content: Node = null!;
    onLoad() {

        this.content = find("content", this.node) as Node;
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
        this.doOther();
    }
    debug: Node = null!;

    private doOther(){
        let logView = find("logView", this.node);
        if (logView) {
            logView.active = false;
            this.logView = logView;
            this.initLogView();
        }

        let background = find("background", this.node);
        if (background) {
            background.on(SystemEvent.EventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug) this.debug.active = true;
            });
        }
    }

    private bindEvent(path : string ,cb:Function){
        let node = find(path,this.content);
        if( node ){
            node.on(SystemEvent.EventType.TOUCH_END,cb,this);
        }
    }

    private initLogView() {
        let background = find("background", this.logView);
        if (background) {
            background.on(SystemEvent.EventType.TOUCH_END, () => {
                this.logView.active = false;
            });
        }

        let level = find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(Toggle);
                    if (toggle) {
                        toggle.isChecked = Manager.logger.isValid(this.getLogLevel(i));
                    }
                    node.on("toggle", (toggle: Toggle) => {
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
                Log.d(js.getClassName(data));
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
                if ( sys.isNative ){
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
                Log.d(`是否有加载中Bundle : ${data.isLoading}`);
                let bundles = [];
                for (let i = 0; i < data.loaded.length; i++) {
                    bundles.push(data.loaded[i].name);
                }
                Log.d(`当前所有加载完成的bundle : ${bundles.toString()}`);
                if ( sys.isNative ){
                    Log.dump(data.curBundle,"当前运行bundle:")
                }else{
                    Log.d("当前运行bundle:", data.curBundle);
                }
                if ( sys.isNative ){
                    Log.dump(data.areadyLoaded,"加载过保存下的bundle信息：")
                }else{
                    Log.d("加载过保存下的bundle信息：", data.areadyLoaded)
                }
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
        setDisplayStats(!isDisplayStats())
    }

    private onShowUI(){
        Log.d(`-----------当前所有视图------------`);
        Manager.uiManager.print({
            printViews: (value, key) => {
                Log.d(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${js.getClassName(value.view)} active : ${value.view && value.view.node ? value.view.node.active : false}`);
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
                if (DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息开始----------------`)
                let content: any[] = [];
                let invalidContent: any[] = [];
                caches.forEach((data, key, source) => {
                    let itemContent = {
                        url: data.info.url,
                        isLoaded: data.isLoaded,
                        isValid: isValid(data.data),
                        assetType: js.getClassName(data.info.type),
                        data: data.data ? js.getClassName(data.data) : null,
                        status: data.status
                    }
                    let item = { url: key, data: itemContent };

                    if (data.isLoaded && data.data && !isValid(data.data)) {
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
                if (DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`)
            },
            printRemote: (spCaches, caches, infos) => {
                Log.d(`---- 远程加载资源缓存信息 ----`);

                let content: any[] = [];
                let invalidContent: any[] = [];
                spCaches.forEach((data, key, source) => {
                    let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: isValid(data.data), assetType: js.getClassName(data.info.type), data: data.data ? js.getClassName(data.data) : null, status: data.status };
                    let item = { url: key, data: itemContent };
                    if (data.isLoaded && ((data.data && !isValid(data.data)) || !data.data)) {
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
                    let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: isValid(data.data), assetType: js.getClassName(data.info.type), data: data.data ? js.getClassName(data.data) : null, status: data.status }
                    let item = { url: key, data: itemContent };
                    if (data.isLoaded && data.data && !isValid(data.data)) {
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
                Log.d(js.getClassName(data));
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
}

