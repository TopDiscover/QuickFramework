/**
 * @description 网络Service服务管理
 */

import { Macro } from "../../../defines/Macros";

export class ServiceManager implements GameEventInterface , ISingleton {
    static module: string = "【Service管理器】";
    module: string = null!;

    /**@description 所有的网络 */
    protected services: Service[] = [];

    /**@description 等级重连的网络 */
    protected waitReconnect: Service[] = [];

    /**@description 当前正在重连的Service */
    protected curReconnect: Service | undefined = undefined;

    /**@description 获取service */
    get<T extends Service>(classOrModule: ServiceClass<T> | string, isCreate = false) {
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
                service = new classOrModule();
                service.module = module;
                this.services.push(service);
                return service;
            }
        }
        return null;
    }

    /**@description 销毁Service */
    destory<T extends Service>(classOrName?: ServiceClass<T> | string) {
        if (classOrName) {
            let name = this.getModule(classOrName);
            let i = this.services.length;
            while (i--) {
                if (this.services[i].module == name) {
                    //销毁前先关闭网络
                    this.services[i].close();
                    this.services[i].destory();
                    this.services.splice(i, 1);
                }
            }
        }else{
            this.clear();
        }
       
    }

    /**@description 清除Service */
    clear<T extends Service>(exclude?: (ServiceClass<T> | string)[]) {
        let i = this.services.length;
        while (i--) {
            if (!this.isInExclude(this.services[i], exclude)) {
                //销毁前先关闭网络
                this.services[i].close();
                this.services[i].destory();
                this.services.splice(i, 1);
            }
        }
    }

    private isInExclude<T extends Service>(data: T, exclude?: (ServiceClass<T> | string)[]) {
        if (!exclude) return false;
        for (let i = 0; i < exclude.length; i++) {
            let name = this.getModule(exclude[i]);
            if (name == data.module) {
                return true;
            }
        }
        return false;
    }

    private getModule<T extends Service>(classOrModule: ServiceClass<T> | string) {
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
        this.clear();
    }

    update() {
        this.services.forEach((service) => {
            if (service) {
                service.handMessage();
            }
        });
    }

    close() {
        this.services.forEach((service) => {
            if (service) {
                service.close();
            }
        });
    }

    onLoad() {

    }

    onError(ev: Event, service: Service) {
        Log.d(`${service.module} 网络错误!!!`);
        //连接错误，如果有重连组件，且为允许重连情况下，放入到重连队列中
        if (!this.isWaiReconnect(service) && service.reconnectHandler && service.reconnectHandler.enabled) {
            //在等级重连队列中
            this.waitReconnect.push(service);
        }
        this.sortWait()
        //如果有正常连接的，直接返回
        if (this.curReconnect) {
            if (this.curReconnect == service && service.reconnectHandler && service.reconnectHandler.enabled) {
                service.reconnectHandler.onError(ev);
            }
            return;
        }
        //如果当前没有正在重连的，取出第一个进入重连
        while (this.waitReconnect.length > 0) {
            if (!this.curReconnect) {
                this.curReconnect = this.waitReconnect.shift();
                if (this.curReconnect && this.curReconnect.reconnectHandler && this.curReconnect.enabled) {
                    this.curReconnect.reconnectHandler.onError(ev);
                    break;
                }
                //该连接对象不满足重连条件，继续找下一个
                this.curReconnect = undefined;
            }
        }
    }

    onClose(ev: Event, service: Service) {
        if (ev.type == Macro.ON_CUSTOM_CLOSE) {
            Log.d(`${service.module} 应用层主动关闭Socket`);
            return;
        }
        Log.d(`${service.module} 网络关闭!!!`);
        if (!this.isWaiReconnect(service) && service.reconnectHandler && service.reconnectHandler.enabled) {
            this.waitReconnect.push(service);
        }
        this.sortWait();
        //如果有正常连接的，直接返回
        if (this.curReconnect) {
            if (this.curReconnect == service && service.reconnectHandler && service.reconnectHandler.enabled) {
                service.reconnectHandler.onClose(ev);
            }
            return;
        }
        //如果当前没有正在重连的，取出第一个进入重连
        while (this.waitReconnect.length > 0) {
            if (!this.curReconnect) {
                this.curReconnect = this.waitReconnect.shift();
                if (this.curReconnect && this.curReconnect.reconnectHandler && this.curReconnect.enabled) {
                    this.curReconnect.reconnectHandler.onClose(ev);
                    break;
                }
                //该连接对象不满足重连条件，继续找下一个
                this.curReconnect = undefined;
            }
        }
    }

    onOpen(ev: Event, service: Service) {
        //连接成功，从重连队列中移除
        let isFind = false;
        for (let i = 0; i < this.waitReconnect.length; i++) {
            if (this.waitReconnect[i] == service) {
                if (service.reconnectHandler) {
                    service.reconnectHandler.onOpen(ev);
                }
                isFind = true;
                this.waitReconnect.splice(i, 1);
                break;
            }
        }
        if ( !isFind && service && service.reconnectHandler && service.reconnectHandler.enabled ){
            service.reconnectHandler.onOpen(ev);
        }

        Log.d(`${service.module}重连成功...`);

        //每次只连接一个，这里面直接把当前重连的赋值为undefined就可以了
        this.curReconnect = undefined;

        //如果当前没有正在重连的，取出第一个进入重连
        while (this.waitReconnect.length > 0) {
            if (!this.curReconnect) {
                this.curReconnect = this.waitReconnect.shift();
                if (this.curReconnect && this.curReconnect.reconnectHandler && this.curReconnect.enabled) {
                    this.curReconnect.reconnectHandler.reconnect();
                    Log.d(`${this.curReconnect.module}进入重连...`);
                    break;
                }
                //该连接对象不满足重连条件，继续找下一个
                this.curReconnect = undefined;
            }
        }
        if (!this.curReconnect) {
            App.uiReconnect.hide();
        }
    }

    onEnterBackground(): void {
        this.services.forEach((service) => {
            service.onEnterBackground();
        });
    }

    onEnterForgeground(inBackgroundTime: number): void {
        this.services.forEach((service) => {
            service.onEnterForgeground(inBackgroundTime);
        });
    }

    /**@description 网络心跳超时 */
    reconnect(service: Service) {
        if (!this.isWaiReconnect(service) && service.reconnectHandler && service.reconnectHandler.enabled) {
            this.waitReconnect.push(service);
        }
        this.sortWait();
        //如果当前有正在连接的，直接返回
        if (this.curReconnect) {
            if (this.waitReconnect.length > 1) {
                if (this.waitReconnect[0] != this.curReconnect) {
                    //优化级低的正在连接中
                    if (this.curReconnect.reconnectHandler && this.curReconnect.reconnectHandler.enabled && this.curReconnect.reconnectHandler.isConnecting) {
                        Log.w(`优先级低的网络正常连接中 : ${this.curReconnect.module},正在连接中，将不会按照优先级进行重连`);
                        return;
                    } else {
                        //把当前的放入重连队列重新排序
                        if ( !this.isWaiReconnect(service) && service.reconnectHandler && service.reconnectHandler.enabled ){
                            this.waitReconnect.push();
                        }
                        this.sortWait();
                        Log.w(`当前网络:${this.curReconnect.module}不是优先级最高的，将为您重新切换到优先级高的网络进行重连!!!`);
                        this.curReconnect = undefined;

                        //如果当前没有正在重连的，取出第一个进入重连
                        while (this.waitReconnect.length > 0) {
                            if (!this.curReconnect) {
                                this.curReconnect = this.waitReconnect.shift();
                                if (this.curReconnect && this.curReconnect.reconnectHandler && this.curReconnect.enabled) {
                                    Log.w(`已为您切换优先级高的:${this.curReconnect.module}进行重连!!!`);
                                    this.curReconnect.reconnectHandler.reconnect();
                                    break;
                                }
                                //该连接对象不满足重连条件，继续找下一个
                                this.curReconnect = undefined;
                            }
                        }
                    }
                }
            }

            if (this.curReconnect == service && service.reconnectHandler && service.reconnectHandler.enabled) {
                service.reconnectHandler.reconnect();
            }
            return;
        }
        //如果当前没有正在重连的，取出第一个进入重连
        while (this.waitReconnect.length > 0) {
            if (!this.curReconnect) {
                this.curReconnect = this.waitReconnect.shift();
                if (this.curReconnect && this.curReconnect.reconnectHandler && this.curReconnect.enabled) {
                    this.curReconnect.reconnectHandler.reconnect();
                    break;
                }
                //该连接对象不满足重连条件，继续找下一个
                this.curReconnect = undefined;
            }
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

    private getService(name: string): Service | null {
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i].module == name) {
                return this.services[i];
            }
        }
        return null;
    }

    private isWaiReconnect(service: Service) {
        if (this.waitReconnect.indexOf(service) != -1) {
            return true;
        }
        return false;
    }

    debug() {
        Log.d(`-----------网络管理器中相关网络信息------------`);
        this.services.forEach((service) => {
            let content = `Module : ${service.module} , 进入后台的最大允许时间 : ${service.maxEnterBackgroundTime} , 优先级 : ${service.priority}`;
            Log.d(content);
            content = "重连信息 : "
            if (service.reconnectHandler) {
                content = `是否允许重连 : ${service.reconnectHandler.enabled}`
            } else {
                content += "无重连Handler";
            }
            Log.d(content);
            content = `状态信息 , 是否允许连接网络 : ${service.enabled} 是否连接 : ${service.isConnected} 网络数据类型 : ${service.serviceType}`
            Log.d(content);
        });
    }
}