
/** 热更新代码 开始*/
var hotUpdateSearchPaths = sys.localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}
/** 热更新代码 结束*/
