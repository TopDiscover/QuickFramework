/**@description 请不要在此文件中引用其它文件 */
/**
 * @description 绑定对象到名字空间
 * @param key 
 * @param value 
 */
export function toNamespace(key:string,value:any):void{
    createNamespace();
    (<any>td)[key] = value;
}

export function createNamespace() {
    if (!window.td){
        (<any>window.td) = {};
    }
}