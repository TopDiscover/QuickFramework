export interface Singleton<T> {
    new(): T;
    /**
     *@description 单例统一实现 
     */
    Instance(): T;
}

/**@description 获取根据类型获取单列 */
export function getSingleton<T>(SingletonClass: Singleton<T>) {
    return SingletonClass.Instance();
}

