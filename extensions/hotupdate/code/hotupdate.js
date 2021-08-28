
/** 热更新代码 开始*/
var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}
function toNamespace(key,value,namespace){
    let space = createNamespace(namespace);
    if (typeof value == "object" ){
        if (!space[key]){
            space[key] = value;
        }else{
            let keys = Object.keys(value);
            keys.forEach((subKey,index,source)=>{
                space[key][subKey] = value[subKey];
            });
        }
    }else{
        space[key] = value;
    }
}
function createNamespace(namespace) {
    let _window = window;
    if (!_window.td){
        _window.td = {};
    }
    if ( namespace && namespace.length > 0 ){
        if ( !_window.td[namespace] ){
            _window.td[namespace] = {}
        }
        return _window.td[namespace];
    }
    return _window.td;
}
window.toNamespace = toNamespace;
window.createNamespace = createNamespace;
/**@description 获取根据类型获取单列 */
function getSingleton( SingletonClass){
    return SingletonClass.Instance();
}
window.getSingleton = getSingleton;
createNamespace();
/** 热更新代码 结束*/
