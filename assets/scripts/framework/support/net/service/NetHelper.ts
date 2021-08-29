import { Service } from "./Service";

/**@description NetHelper 
 * 子类需要继承并实现constructor,传入实例化的service，
 * 在该模块的其它地方，可直接调用
 * 可参考HallNetHelper
 */
export default class NetHelper<ServiceType> {
    private _service: Service = null;
    public get service(): ServiceType {
        return <any>(this._service);
    };

    constructor(service: Service) {
        this._service = service;
    }
}