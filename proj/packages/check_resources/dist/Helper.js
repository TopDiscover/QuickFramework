"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const Config_1 = __importDefault(require("./core/Config"));
const Defines_1 = require("./core/Defines");
const Electron = require("electron");
class Helper extends Config_1.default {
    constructor() {
        super();
        this.module = "【资源检测】";
        this.bundles = {};
        this.root = `${Editor.Project.path}/assets/bundles`;
        this.logger = Editor;
    }
    get path() {
        let out = (0, path_1.join)(this.configPath, `${Defines_1.Extensions.Hotupdate}.json`);
        return out;
    }
    init() {
        this.read();
        let bundles = Object.keys(this.data.bundles);
        for (let i = 0; i < bundles.length; i++) {
            let info = this.data.bundles[bundles[i]];
            if (info.dir == "hall") {
                this.logger.log(`${this.module}${info.name}(${info.dir})不参考检测`);
            }
            else {
                this.bundles[info.dir] = { name: info.dir, dir: info.dir, db: `db://assets/bundles/${info.dir}` };
            }
        }
    }
    openDir(dir) {
        if ((0, fs_1.existsSync)(dir)) {
            dir = (0, path_1.normalize)(dir);
            this.logger.log(`${this.module} 打开目录 : ${dir}`);
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.logger.error(`${this.module}不存在:${dir}`);
        }
    }
    /**@description 获取其它游戏的资源 */
    getOtherGameResources(gameName, outReults, completeCallback) {
        let games = JSON.parse(JSON.stringify(this.bundles));
        delete games[gameName];
        delete games["hall"];
        let keys = Object.keys(games);
        for (let i = 0; i < keys.length; i++) {
            let info = games[keys[i]];
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
            Editor.assetdb.queryAssets(`${info.db}/**\/*`, ["spine", "ttf-font", "font", "bitmap-font", "sprite-frame", "particle", "animation-clip"], function (err, results) {
                //Editor.log("========" + JSON.stringify(results));
                results.forEach((result) => {
                    let url = result.url;
                    if (url.indexOf("db://internal") != -1) {
                        //排除引擎自带
                        // Editor.log(`${result.url} : ${result.uuid}`);
                    }
                    else {
                        outReults.push(result);
                    }
                });
                if (i == keys.length - 1) {
                    completeCallback(outReults);
                }
            });
        }
    }
    /**@description 获取需要检测游戏的所有预置体信息 */
    getGamePrefabs(gameName, outReults, completeCallback) {
        let dbPath = this.bundles[gameName].db;
        if (dbPath) {
            Editor.assetdb.queryAssets(`${dbPath}/**\/*`, "prefab", (err, results) => {
                results.forEach((result) => {
                    outReults.push(result);
                });
                completeCallback(outReults);
            });
        }
        else {
            completeCallback(outReults);
        }
    }
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
                path = `${parentNode._name}/${path}`;
                currentNode = parentNode;
                if (currentNode._parent && currentNode._parent.__id__) {
                    parentNode = viewData[currentNode._parent.__id__];
                }
                else {
                    parentNode = null;
                }
            }
            ;
        }
        return path;
    }
    /**@description 解析视图，目前只实现了对精灵的检测 */
    parseView(viewData, url) {
        let result = [];
        viewData = JSON.parse(viewData);
        viewData.forEach((data) => {
            //精灵组件
            if (data.__type__ == "cc.Sprite") {
                let sprite = {
                    type: data.__type__,
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
                if (animation.defaultClip || animation.clips) {
                    animation.compPath = this.getComponentPath(viewData, data);
                    animation.path = url;
                    result.push(animation);
                }
            }
        });
        return result;
    }
    logWarn(res, url) {
        this.logger.warn(`${this.module}资源${res.path} => ${res.compPath}.${res.type} 引用了不属于自己游戏的资源 ${url}`);
    }
    onCheckSubGame(gameName) {
        let otherGamesTexture = [];
        this.logger.log(`${this.module}正在获取其它游戏资源列表`);
        this.getOtherGameResources(gameName, otherGamesTexture, (resources) => {
            let gamePrefabs = [];
            this.logger.log(`${this.module}获取其它游戏资源列表完成`);
            this.logger.log(`${this.module}正在获取${this.bundles[gameName].db}预置体资源`);
            this.getGamePrefabs(gameName, gamePrefabs, (results) => {
                this.logger.log(`${this.module}获取${this.bundles[gameName].db}预置体资源成功`);
                results.forEach((result) => {
                    let viewData = (0, fs_1.readFileSync)(result.path);
                    //取出该界面引用的资源
                    this.logger.log(`${this.module}正在检测${result.url}`);
                    let refResources = this.parseView(viewData, result.url);
                    for (let i = 0; i < refResources.length; i++) {
                        let res = refResources[i];
                        switch (res.type) {
                            case "cc.Sprite":
                                {
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
                            case "cc.Button":
                                {
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
                            case "cc.Label":
                                {
                                    resources.forEach((assetInfo) => {
                                        if (res.file && res.file.uuid == assetInfo.uuid) {
                                            this.logWarn(res, assetInfo.url);
                                        }
                                    });
                                }
                                break;
                            case "cc.ParticleSystem":
                                {
                                    resources.forEach((assetInfo) => {
                                        if (res.file && res.file.uuid == assetInfo.uuid) {
                                            this.logWarn(res, assetInfo.url);
                                        }
                                    });
                                }
                                break;
                            case "sp.Skeleton":
                                {
                                    resources.forEach((assetInfo) => {
                                        if (res.skeletonData && res.skeletonData.uuid == assetInfo.uuid) {
                                            this.logWarn(res, assetInfo.url);
                                        }
                                    });
                                }
                                break;
                            case "cc.Animation":
                                {
                                    resources.forEach((assetInfo) => {
                                        if (res.defaultClip && res.defaultClip.uuid == assetInfo.uuid) {
                                            this.logWarn(res, assetInfo.url);
                                        }
                                        if (res.clips && assetInfo.uuid in res.clips) {
                                            this.logWarn(res, assetInfo.url);
                                        }
                                    });
                                    if (!res.defaultClip && !res.clips) {
                                        this.logger.warn(`${this.module}资源${res.path} => ${res.compPath}.${res.type} 只添加了动画组件，但没有任何动画`);
                                    }
                                }
                                break;
                        }
                    }
                    this.logger.log(`${this.module}检测${result.url}完成!!`);
                });
            });
        });
    }
}
exports.helper = new Helper();
