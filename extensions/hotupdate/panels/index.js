"use strict";
const fs = require("fs");
const path = require("path");
//样式文本
exports.style = fs.readFileSync(path.join(__dirname, "./index.css"), "utf8");

const elements = {
    version : "#version",//版本号
    serverIP : "#serverIP",//服务器地址
    useLocalIP : "#useLocalIP",//使用本地地址
    historyServerIPSelect : "#historyServerIPSelect",//服务器历史地址
    buildDir : "#buildDir",//构建目录
    outManifestDir : "#outManifestDir",//Manifest输出目录
    delBunles : "#delBunles",//删除bundle
    createManifest : "#createManifest",//生成Manifest
    openManifestDir : "#openManifestDir",//打开Manifest目录
    bundlesProp : "bundlesProp",//bundles Manifest配置
}

//html文本
function GenerateTemplate() {
    //读取界面
    let _template = fs.readFileSync(path.join(__dirname, "./index.html"), "utf8");
    //先读取子游戏配置
    let _gamesConfig = fs.readFileSync(path.join(__dirname,"../../config/bundles.json"));
    _gamesConfig = JSON.parse(_gamesConfig);
    console.log(_gamesConfig);
    let _subGameVersion = {};
    //生成子游戏版本控制界面
    //生成子游戏测环境版本号
    let _subGameServerVersionView = ``;
    let _subGameVersionView = ``;
    let _subGameServerVersion = {};
    let _hallVersion = `1`;
    //子游戏是否包含
    let _subGameInclude = {};
    for (let i = 0; i < _gamesConfig.bundles.length; i++) {
        let gameInfo = _gamesConfig.bundles[i];
        if (gameInfo.dir && gameInfo.dir.length > 0) {
            _subGameVersionView += `
        <ui-prop id = "bundle${gameInfo.dir}">
            <ui-label slot="label" class="titleColor" tooltip="${gameInfo.name}版本配置">${gameInfo.name}(${gameInfo.dir})</ui-label>
            <ui-checkbox slot="content" class="titleColor" value="${gameInfo.includeApk}">是否包含在原始包内</ui-checkbox>
            <ui-input slot="content" class="contentColor"></ui-input>
        </ui-prop>`;
            _subGameVersion[`${gameInfo.dir}`] = gameInfo.version;
            _subGameInclude[`${gameInfo.dir}`] = gameInfo.includeApk;
            _subGameServerVersion[`${gameInfo.dir}`] = '-';
            _subGameServerVersionView += `
        <ui-prop>
            <ui-label slot="label" class="titleColor" tooltip="${gameInfo.name}(${gameInfo.dir})测试环境地址">${gameInfo.name}(${gameInfo.dir})</ui-label>
            <ui-label slot="content" class="titleColor">${_gamesConfig.packageUrl}</ui-label>
            <ui-button slot="content">刷新</ui-button>
        </ui-prop>
        `;
        }
        if (gameInfo.id == "0") {
            _hallVersion = gameInfo.version;
        }
    }

    let templateReplaceManifest = function templateReplace() {
        return arguments[1] + _subGameVersionView + arguments[3];
    }
    //添加子游戏版本配置
    _template = _template.replace(/(<!--subgame start-->)([\s\w\S]*)(<!--subgame end-->)/g, templateReplaceManifest);

    let templateReplaceTestManifest = function templateReplace() {
        return arguments[1] + _subGameServerVersionView + arguments[3];
    }
    //添加子游戏测试环境版本号
    _template = _template.replace(/(<!--subgame test start-->)([\s\w\S]*)(<!--subgame test end-->)/g, templateReplaceTestManifest);

    return _template;
}

exports.template = GenerateTemplate();
//渲染html选择器
exports.$ = elements;
//面板上的方法,似乎不响应，郁闷
exports.methods = {
    //点击了使用本机
    click() {
        console.log("使用本机");
    }
}
//面板上的解发事件
exports.listeners = {

};

/**
 * 
 * <ui-label slot="label" class="titleColor" tooltip="大厅">大厅</ui-label>
            <ui-checkbox slot="content" class="contentColor" value="true">是否包含在原始包内</ui-checkbox>
            <ui-input slot="content" class="contentColor"></ui-input> 
 */

// 当面板渲染成功后触发
exports.ready = async function () {
    console.log(this.$["useLocalIP"]);
    console.log("ready");
    // console.log(document);
    // const element = document.getElementById("#useLocalIP")
    // this.$.useLocalIP.addEventListener("confirm", () => {
    //     console.log("使用本机");
    // });

};
// 尝试关闭面板的时候触发
exports.beforeClose = async function () {
    console.log("beforeClose");
};
// 当面板实际关闭后触发
exports.close = async function () {
    console.log("close");
};
