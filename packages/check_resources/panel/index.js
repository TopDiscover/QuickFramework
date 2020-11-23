"use strict";
const fs = require("fire-fs");
const path = require("fire-path");
const Electron = require("electron"),
    {
        remote: remote
    } = require("electron");

//读取界面
let _template = fs.readFileSync(Editor.url("packages://check_resources/panel/index.html", "utf8")) + "";
//先读取子游戏配置
let _gamesPath = `${Editor.argv.panelArgv.path}/packages/config/bundles.json`;
//_gamesPath = path.normalize(_gamesPath);
let _gamesConfig = fs.readFileSync(_gamesPath);
_gamesConfig = JSON.parse(_gamesConfig);
let _subGameVersion = {};
//生成子游戏版本控制界面
//生成子游戏测环境版本号
let _subGameServerVersionView = ``;
let _subGameDir = {};
let _subGameName = {};
for (let i = 0; i < _gamesConfig.bundles.length; i++) {
    let gameInfo = _gamesConfig.bundles[i];
    if (gameInfo.dir && gameInfo.dir.length > 0) {
        _subGameVersion[`${gameInfo.dir}`] = gameInfo.version;
        _subGameDir[`${gameInfo.dir}`] = `db://assets/bundles/${gameInfo.dir}`;
        _subGameServerVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <h4 class="flex-2">{{subGameDir.${gameInfo.dir}}}</h4>
                <ui-button class="end-justified" v-on:confirm="onCheckSubGame(null,'${gameInfo.dir}')">检测</ui-button>
            </div>
        </ui-prop>
        `;
        _subGameName[gameInfo.dir] = gameInfo.name;
    }
}

let templateReplaceTestManifest = function templateReplace() {
    return arguments[1] + _subGameServerVersionView + arguments[3];
}
//添加子游戏测试环境版本号
_template = _template.replace(/(<!--subgame test start-->)([\s\w\S]*)(<!--subgame test end-->)/g, templateReplaceTestManifest);


Editor.Panel.extend({
    style: fs.readFileSync(Editor.url("packages://check_resources/panel/index.css", "utf8")) + "",
    template: _template,
    $: {

    },
    ready() {
        window.plugin = new window.Vue({
            el: this.shadowRoot,
            created: function () {
                this._initPluginCfg()
            },
            init: function () {},
            data: {
                gameRoot: "",
                subGameDir: _subGameDir,
                subGameName: _subGameName
            },
            computed: {},
            methods: {
                _initPluginCfg() {
                    this.gameRoot = `${Editor.Project.path}/assets/bundles`;
                },
                /**@description 选择子游戏目录 */
                onSelectGameRoot(e) {
                    let assetsPath = `${Editor.Project.path}/assets/bundles`;
                    this.gameRoot && this.gameRoot.length > 0 && fs.existsSync(this.gameRoot) && (assetsPath = this.gameRoot);
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器目录",
                        defaultPath: assetsPath,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        this.gameRoot = result[0];
                    }
                },
                /**@description 打开子游戏目录 */
                onOpenGameRoot() {
                    if (fs.existsSync(this.gameRoot)) {
                        (Electron.shell.showItemInFolder(this.gameRoot), Electron.shell.beep())
                    } else {
                        Editor.error("目录不存在：" + this.gameRoot);
                    }
                },

                /**@description 获取其它游戏的资源 */
                getOtherGameResources(gameName, outReults, completeCallback) {
                    let otherGames = JSON.parse(JSON.stringify(this.subGameDir));
                    delete otherGames[`${gameName}`];
                    //排除大厅的资源,大厅资源，子游戏可讯问
                    delete otherGames["hall"];
                    

                    let otherKeys = Object.keys(otherGames);
                    Editor.log(otherKeys);
                    for (let i = 0; i < otherKeys.length; i++) {
                        let key = otherKeys[i];
                        /**
{ 'cc.Asset': 'native-asset',
'cc.AnimationClip': 'animation-clip',
'cc.AudioClip': 'audio-clip',
'cc.BitmapFont': 'bitmap-font',
'cc.CoffeeScript': 'coffeescript',
'cc.TypeScript': 'typescript',
'cc.JavaScript': 'javascript',
'cc.JsonAsset': 'json',
'cc.ParticleAsset': 'particle',
'cc.Prefab': 'prefab',
'cc.SceneAsset': 'scene',
'cc.SpriteAtlas': 'texture-packer',
'cc.SpriteFrame': 'sprite-frame',
'cc.Texture2D': 'texture',
'cc.TTFFont': 'ttf-font',
'cc.TextAsset': 'text',
'cc.LabelAtlas': 'label-atlas',
'cc.RawAsset': 'raw-asset',
'cc.Script': 'script',
'cc.Font': 'font',
'sp.SkeletonData': 'spine',
'cc.TiledMapAsset': 'tiled-map',
'dragonBones.DragonBonesAsset': 'dragonbones',
'dragonBones.DragonBonesAtlasAsset': 'dragonbones-atlas' },
//auto-atlas:自动图集
sprite-atlas:plist
                         */
                        //"spine","ttf-font","font","bitmap-font","sprite-frame","particle"
                        Editor.assetdb.queryAssets(`${otherGames[key]}/**\/*`, ["spine", "ttf-font", "font", "bitmap-font", "sprite-frame", "particle","animation-clip"], function (err, results) {
                            //Editor.log("========" + JSON.stringify(results));
                            results.forEach((result) => {
                                //Editor.log(`${result.url} : ${result.uuid}`);
                                outReults.push(result);
                            });
                            if (i == otherKeys.length - 1) {
                                completeCallback(outReults);
                            }
                        });
                    }
                },
                /**@description 获取需要检测游戏的所有预置体信息 */
                getGamePrefabs(gameName, outReults, completeCallback) {
                    let dbPath = this.subGameDir[gameName];
                    if (dbPath) {
                        Editor.assetdb.queryAssets(`${dbPath}/**\/*`, "prefab", (err, results) => {
                            results.forEach((result) => {
                                outReults.push(result);
                            });
                            completeCallback(outReults);
                        });
                    } else {
                        completeCallback(outReults);
                    }
                },

                /**@description 获取组件在预置体中路径 */
                getComponentPath(viewData, component) {
                    let path = "";
                    if (component.node && component.node.__id__) {
                        //取得node节点名
                        //Editor.log(data.node.__id__);
                        let currentNode = viewData[component.node.__id__];
                        let parentNode = null;
                        path = currentNode._name;
                        if (currentNode._parent && currentNode._parent.__id__) {
                            parentNode = viewData[currentNode._parent.__id__];
                        }

                        while (parentNode) {
                            path = `${parentNode._name}/${path}`
                            currentNode = parentNode;
                            if (currentNode._parent && currentNode._parent.__id__) {
                                parentNode = viewData[currentNode._parent.__id__];
                            } else {
                                parentNode = null;
                            }
                        };
                    }
                    return path;
                },
                /**@description 解析视图，目前只实现了对精灵的检测 */
                parseView(viewData, url) {
                    let result = [];
                    viewData = JSON.parse(viewData);
                    viewData.forEach((data) => {
                        //精灵组件
                        if (data.__type__ == "cc.Sprite") {
                            let sprite = {
                                type: data.__type__
                            };
                            if (data._atlas && data._atlas.__uuid__) {
                                sprite.atlas = {};
                                sprite.atlas.uuid = data._atlas.__uuid__;
                            }
                            if (data._spriteFrame && data._spriteFrame.__uuid__) {
                                sprite.spriteFrame = {};
                                sprite.spriteFrame.uuid = data._spriteFrame.__uuid__;
                            }
                            sprite.path = url;

                            if (sprite.atlas || sprite.spriteFrame) {
                                //至少有一个，如果没有需要检测
                                //计算出在预置体中的路径
                                sprite.compPath = this.getComponentPath(viewData, data);
                                //Editor.log(sprite.compPath);
                                result.push(sprite);
                            }
                        }
                        //按钮组件
                        else if (data.__type__ == "cc.Button") {
                            let button = {
                                type: data.__type__
                            };
                            /** 按钮transition 类型 
                             * NONE : 0  不做任何过渡
                             * COLOR : 1 颜色过渡
                             * SPRITE : 2 精灵过渡
                             * SCALE : 3 缩放过渡
                             * */
                            button.path = url;
                            let isValid = false;
                            if (data._N$normalSprite && data._N$normalSprite.__uuid__) {
                                //有普通按下状态按钮
                                button.normalSprite = {};
                                button.normalSprite.uuid = data._N$normalSprite.__uuid__;
                                isValid = true;
                            }
                            if (data._N$pressedSprite && data._N$pressedSprite.__uuid__) {
                                button.pressedSprite = {};
                                button.pressedSprite.uuid = data._N$pressedSprite.__uuid__;
                                isValid = true;
                            }
                            if (data._N$hoverSprite && data._N$hoverSprite.__uuid__) {
                                button.hoverSprite = {};
                                button.hoverSprite.uuid = data._N$hoverSprite.__uuid__;
                                isValid = true;
                            }
                            if (data._N$disabledSprite && data._N$disabledSprite.__uuid__) {
                                button.disabledSprite = {};
                                button.disabledSprite.uuid = data._N$disabledSprite.__uuid__;
                                isValid = true;
                            }
                            if (isValid) {
                                button.compPath = this.getComponentPath(viewData, data);
                                result.push(button);
                            }
                        }
                        //显示字体组件
                        else if (data.__type__ == "cc.Label") {
                            let label = {
                                type: data.__type__
                            };
                            if (data._N$file && data._N$file.__uuid__) {
                                label.file = {};
                                label.file.uuid = data._N$file.__uuid__;
                                label.path = url;
                                label.compPath = this.getComponentPath(viewData, data);
                                result.push(label);
                            }
                        }
                        //特效组件
                        else if (data.__type__ == "cc.ParticleSystem") {
                            let particalSystem = {
                                type: data.__type__
                            };
                            if (data._file && data._file.__uuid__) {
                                particalSystem.file = {};
                                particalSystem.file.uuid = data._file.__uuid__;
                                particalSystem.path = url;
                                particalSystem.compPath = this.getComponentPath(viewData, data);
                                result.push(particalSystem);
                            }
                        }
                        //spine组件
                        else if (data.__type__ == "sp.Skeleton") {
                            let spine = {
                                type: data.__type__
                            };
                            if (data._N$skeletonData && data._N$skeletonData.__uuid__) {
                                spine.skeletonData = {};
                                spine.skeletonData.uuid = data._N$skeletonData.__uuid__;
                                spine.path = url;
                                spine.compPath = this.getComponentPath(viewData, data);
                                result.push(spine);
                            }
                        }
                        //cc.Animation组件
                        else if (data.__type__ == "cc.Animation") {
                            let animation = {
                                type: data.__type__
                            };
                            if (data._defaultClip && data._defaultClip.__uuid__) {
                                animation.defaultClip = {};
                                animation.defaultClip.uuid = data._defaultClip.__uuid__;
                            }
                            if (data._clips && data._clips.length > 0) {
                                animation.clips = {};
                                for (let i = 0; i < data._clips.length; i++) {
                                    let clipItem = data._clips[i];
                                    if (clipItem) {
                                        animation.clips[clipItem.__uuid__] = true;
                                    }
                                }
                            }
                            if ( animation.defaultClip || animation.clips ){
                                animation.compPath = this.getComponentPath(viewData, data);
                                animation.path = url;
                                result.push(animation);
                            }
                        }
                    });
                    return result;
                },
                logWarn(res, url) {
                    Editor.warn(`资源${res.path} => ${res.compPath}.${res.type} 引用了不属于自己游戏的资源 ${url}`);
                },
                /**@description 子游戏检测 */
                onCheckSubGame(e, gameName) {

                    // let proto = Object.getOwnPropertyNames(Editor.assetdb);
                    // Editor.log(JSON.stringify(proto));

                    let otherGamesTexture = [];
                    Editor.log(`正在获取其它游戏资源列表`)
                    this.getOtherGameResources(gameName, otherGamesTexture, (resources) => {
                        let gamePrefabs = [];
                        Editor.log(`获取其它游戏资源列表完成`);
                        Editor.log(`正在获取${this.subGameName[gameName]}预置体资源`)
                        this.getGamePrefabs(gameName, gamePrefabs, (results) => {
                            Editor.log(`获取${this.subGameName[gameName]}预置体资源成功`);
                            results.forEach((result) => {
                                let viewData = fs.readFileSync(result.path);
                                //取出该界面引用的资源
                                Editor.log(`正在检测${result.url}`);
                                let refResources = this.parseView(viewData, result.url);

                                for (let i = 0; i < refResources.length; i++) {
                                    let res = refResources[i];
                                    switch (res.type) {
                                        case "cc.Sprite": {
                                            if (res.atlas || res.spriteFrame) {
                                                //在spriteFrames中查找是否有引用了该资源
                                                resources.forEach((assetInfo) => {
                                                    if (res.atlas) {
                                                        if (res.atlas.uuid == assetInfo.uuid) {
                                                            this.logWarn(res, assetInfo.url);
                                                        }
                                                    }
                                                    if (res.spriteFrame) {
                                                        if (res.spriteFrame.uuid == assetInfo.uuid) {
                                                            this.logWarn(res, assetInfo.url);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                        break;
                                    case "cc.Button": {
                                        resources.forEach((assetInfo) => {
                                            if (res.normalSprite && res.normalSprite.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                            if (res.pressedSprite && res.pressedSprite.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                            if (res.hoverSprite && res.hoverSprite.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                            if (res.disabledSprite && res.disabledSprite.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                        });
                                    }
                                    break;
                                    case "cc.Label": {
                                        resources.forEach((assetInfo) => {
                                            if (res.file && res.file.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                        });
                                    }
                                    break;
                                    case "cc.ParticleSystem": {
                                        resources.forEach((assetInfo) => {
                                            if (res.file && res.file.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                        });
                                    }
                                    break;
                                    case "sp.Skeleton": {
                                        resources.forEach((assetInfo) => {
                                            if (res.skeletonData && res.skeletonData.uuid == assetInfo.uuid) {
                                                this.logWarn(res, assetInfo.url);
                                            }
                                        });
                                    }
                                    break;
                                    case "cc.Animation": {
                                        resources.forEach((assetInfo)=>{
                                            if ( res.defaultClip && res.defaultClip.uuid == assetInfo.uuid ){
                                                this.logWarn(res,assetInfo.url);
                                            }
                                            if ( res.clips && assetInfo.uuid in res.clips ){
                                                this.logWarn(res,assetInfo.url);
                                            }
                                        });
                                        if ( !res.defaultClip && !res.clips ){
                                            Editor.warn(`资源${res.path} => ${res.compPath}.${res.type} 只添加了动画组件，但没有任何动画`);
                                        }
                                    }
                                    break;
                                    }
                                }

                                Editor.log(`检测${result.url}完成!!`);

                            });
                        });
                    });
                }
            }
        });
    },
    messages: {

    }
});
