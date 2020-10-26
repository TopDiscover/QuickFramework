import { Service } from "../base/Service";

/**@description NetHelper */
export default class NetHelper<ServiceType> {
    private _service: Service = null;
    /**
     * @description 这个变量会在脚本onLoad时自动赋值，使用者请勿进行修改
     */
    public get service() : ServiceType{
        return <any>(this._service);
    };

    constructor( service : Service ){
        this._service = service;
    }
}