
/** 热更新代码 开始*/
var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}
/** 热更新代码 结束*/
