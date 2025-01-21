/**
 * @description 网络Service服务管理
 */

import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";
import { WSService } from "../ws/WSService";

export class ServiceManager implements GameEventInterface, ISingleton {
    static module: string = "【Service管理器】";
    module: string = null!;

    /**@description 所有的网络 */
    protected services: WSService[] = [];

    /**@description 等级重连的网络 */
    protected waitReconnect: WSService[] = [];

    /**@description 当前正在重连的Service */
    protected curReconnect: WSService | undefined = undefined;

    /**@description 获取service */
    get<T extends WSService>(classOrModule: WSServiceClass<T> | string, isCreate = false) {
        let module = this.getModule(classOrModule);
        if (module == Macro.UNKNOWN) {
            return null;
        }
        let service = this.getService(module);
        if (service) {
            return service;
        }
        if (typeof classOrModule != "string") {
            if (isCreate) {
                service = new classOrModule(module);
                this.services.push(service);
                service.flows.reconnectFlow.push((service) => {
                    this.reconnect(service);
                    return service;
                })
                return service;
            }
        }
        return null;
    }

    /**@description 销毁Service */
    destory<T extends WSService>(classOrName?: WSServiceClass<T> | string) {
        if (classOrName) {
            let name = this.getModule(classOrName);
            let i = this.services.length;
            while (i--) {
                const service = this.services[i];
                if (service.module == name) {
                    //销毁前先关闭网络
                    service.destory();
                    this.services.splice(i, 1);
                }
            }
        } else {
            // 没不传入参数的情况下，清空所有
            let i = this.services.length;
            while (i--) {
                const service = this.services[i];
                //销毁前先关闭网络
                service.destory();
                this.services.splice(i, 1);
            }
        }
    }

    private getModule<T extends WSService>(classOrModule: WSServiceClass<T> | string) {
        let name = Macro.UNKNOWN;
        if (typeof classOrModule == "string") {
            name = classOrModule;
        } else {
            name = classOrModule.module;
        }
        return name;
    }

    onDestroy() {
        //场景被销毁，清除掉所有连接
        this.destory();
    }

    update(dt: number) {
        this.services.forEach((service) => {
            if (service) {
                service.update(dt);
            }
        });
    }

    stop() {
        this.services.forEach((service) => {
            if (service) {
                service.stop();
            }
        });
    }

    onLoad() {

    }

    onEnterBackground(): void {
        this.services.forEach((service) => {
            if (DEBUG) {
                if (service.flows.enterBackgroundFlow.nodes.length <= 0) {
                    Log.w(`${service.options.tag} 进入后台 enterBackgroundFlow 未注册`);
                }
            }
            service.flows.enterBackgroundFlow.exec(service);
        });
    }

    async onEnterForgeground(inBackgroundTime: number): Promise<void> {
        for (let i = 0; i < this.services.length; i++) {
            const service = this.services[i];
            if (DEBUG) {
                if (service.flows.enterForegroundFlow.nodes.length <= 0) {
                    Log.w(`${service.options.tag} 进入前台 enterForegroundFlow 未注册`);
                }
            }
            const result = await service.flows.enterForegroundFlow.exec({
                service: service,
                enterBackgroundTime: inBackgroundTime,
                isNeedReconnect: false,
            });
            if (result && result.isNeedReconnect) {
                service.stop().then(() => {
                    this.reconnect(service);
                });
            }
        }
    }


    private reconnectTimer = -1;

    /**@description 网络心跳超时 */
    private reconnect(service: WSService) {
        if (!this.isWaiReconnect(service) && service.options.enableReconnect) {
            this.waitReconnect.push(service);
        }

        this.sortWait();

        if (DEBUG) {
            for (let i = 0; i < this.waitReconnect.length; i++) {
                const service = this.waitReconnect[i];
                Log.d(`ServiceManager wait reconnect: ${service.module} , priority: ${service.priority}`);
            }
        }

        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            DEBUG && Log.d(`ServiceManager doReconnect`);
            this.doReconnect();
        }, 1000);
    }

    private onReconnected(service: WSService) {
        for (let i = 0; i < this.waitReconnect.length; i++) {
            if (this.waitReconnect[i] == service) {
                this.waitReconnect.splice(i, 1);
                this.sortWait();
                break;
            }
        }

        if (DEBUG) {
            for (let i = 0; i < this.waitReconnect.length; i++) {
                const service = this.waitReconnect[i];
                Log.d(`ServiceManager onReconnected wait reconnect: ${service.module} , priority: ${service.priority}`);
            }
        }

        this.curReconnect = undefined;
        this.doReconnect();
    }

    private async doReconnect() {

        // 如果当前有正在连接的，如果优化级更高的，就先断开
        if (this.curReconnect) {
            if (this.waitReconnect.length > 1) {
                const first = this.waitReconnect[0];
                if (first != this.curReconnect) {
                    if (this.curReconnect.priority < first.priority) {
                        await this.curReconnect.stop();
                        // 把停止的重新放入待重连队列中
                        if (!this.isWaiReconnect(this.curReconnect) && this.curReconnect.options.enableReconnect) {
                            this.waitReconnect.push(this.curReconnect);
                        }
                        this.sortWait();
                        DEBUG && Log.d(`ServiceManager 关闭了优先级不高的${this.curReconnect.module}`);
                    }else{
                        DEBUG && Log.d(`ServiceManager ${this.curReconnect.module} 正在连接2...`);
                        this.curReconnect.reconnect.start(v => this.onReconnected(v));
                        return;
                    }
                } else {
                    DEBUG && Log.d(`ServiceManager ${this.curReconnect.module} 正在连接1...`);
                    this.curReconnect.reconnect.start(v => this.onReconnected(v));
                    return;
                }
            } else {
                DEBUG && Log.d(`ServiceManager ${this.curReconnect.module} 正在连接...`);
                this.curReconnect.reconnect.start(v => this.onReconnected(v));
                return;
            }
        }

        if (this.waitReconnect.length == 0) {
            DEBUG && Log.d(`ServiceManager 没有等待重连的网络`);
            return;
        }
        //如果当前没有正在重连的，取出第一个进入重连
        this.curReconnect = this.waitReconnect.shift();
        if (this.curReconnect) {
            DEBUG && Log.d(`ServiceManager ${this.curReconnect.module} 是否在等待玩家操作 ${this.curReconnect.reconnect.isWaiting} 是否正常重连 ${this.curReconnect.reconnect.isReconnecting} 开始重连...`);
            if (this.curReconnect.reconnect.isWaiting || this.curReconnect.reconnect.isReconnecting) {
                return;
            }
            await this.curReconnect.reconnect.start(v => this.onReconnected(v));
            this.curReconnect = undefined;
        }
    }

    /**@description 返回优化级排序 */
    protected sortWait() {
        if (this.waitReconnect.length >= 1) {
            this.waitReconnect.sort((a, b) => {
                return b.priority - a.priority;
            });
        }
    }

    private getService(name: string): WSService | null {
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i].module == name) {
                return this.services[i];
            }
        }
        return null;
    }

    private isWaiReconnect(service: WSService) {
        for (let i = 0; i < this.waitReconnect.length; i++) {
            if (this.waitReconnect[i] == service) {
                return true;
            }
        }
        return false;
    }

    debug() {
        Log.d(`-----------网络管理器中相关网络信息------------`);
        this.services.forEach((service) => {
            let content = `Module : ${service.module} , 进入后台的最大允许时间 : ${service.options.maxEnterBackgroundTime} , 优先级 : ${service.priority}`;
            Log.d(content);
            content = `是否允许重连 : ${service.options.enableReconnect}`
            Log.d(content);
            content = `状态信息 是否连接 : ${service.isConnected} 网络数据类型 : ${service.serviceType}`
            Log.d(content);
        });
    }
}