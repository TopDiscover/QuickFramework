/**
 * @description 支持多语言精灵
 * 编辑器模式下只支持resources目录下资源，其它Bundle资源无法支持,后续考虑支持
 * 需要多语言的图标，建议项目弄一个全透明图标，都托入这个图片
 * 代码运行时框架替换
 */

import { assetManager, CCString, Enum, Sprite, SpriteFrame, _decorator } from "cc";
import { Macro } from "../../defines/Macros";
import { addExtraLoadResource, setSpriteSpriteFrame } from "../../plugin/CocosUtils";
import { Resource } from "../asset/Resource";

const { ccclass, property, menu } = _decorator;

const Bundles = Enum(App.Bundles);

@ccclass
@menu("Quick渲染组件/UISprite")
export default class UISprite extends Sprite {
    /**@description 多谗言包 */
    @property
    protected _lan: string = "";

    /**@description 语言包所在bundle */
    @property
    protected _bundle = Bundles.resources;

    @property
    protected _params: (string | number)[] = [];

    /**@description 是否是脏数据 */
    protected _isDirty: boolean = true;

    /**@description 是否启用多语言 */
    @property
    protected _mult = true;

    onLoadComplete?: (data: SpriteFrame | null) => void;

    /**@description 资源的持有人 */
    @property
    protected _user = Macro.UNKNOWN;

    /**@description 图集资源 */
    @property
    protected _lanAtlas: string = "";

    /**@description 是否是远程资源 */
    @property
    protected _remote = false;

    /**
     * @description 语言包所在bundle
     */
    @property({ displayName: "语言包所在Bundle", type: Bundles, "tooltip": "语言包所在bundle" })
    get bundle() {
        return this._bundle;
    }
    set bundle(v) {
        if (this._bundle == v) {
            return;
        }
        this._bundle = v;
        this._isDirty = true;
    }

    /**
     * @description 设置语言包Key
     * 如果语言包在Bundle内，请先用injectLanguageData装饰语言包数据代理类
     * 注意，语言包只有在编辑器模式下会加入语言包数据代理，运行实需要自己添加
     * 假设resources语言包为
     * @example 示例
     * export let i18n = {
     * language : cc.sys.LANGUAGE_CHINESE,
     *      tips : "您好",
     *      test : "测试 : {0}-->{1}-->{2}"
     * }
     * node.getComponent(cc.Label).language = "tips"; //string显示为：您好
     * */
    @property({ displayName: "语言包Key", tooltip: "所在Bundle中语言包的key,如果语言包在Bundle内，请先用injectLanguageData装饰语言包数据代理类" })
    get language() {
        return this._lan;
    }
    set language(v) {
        if (this.language == v) {
            return;
        }
        this._lan = v;
        this._isDirty = true;
    }

    /**
     * @description 图集资源
     */
    @property({ displayName: "图集资源", tooltip: "图集资源" })
    get languageAtlas() {
        return this._lanAtlas;
    }
    set languageAtlas(v) {
        if (this._lanAtlas == v) {
            return;
        }
        this._lanAtlas = v;
        this._isDirty = true;
    }

    /**
     * @description 图集资源
     */
    @property({ displayName: "远程地址", tooltip: "远程地址" })
    get isRemote() {
        return this._remote;
    }
    set isRemote(v) {
        if (this._remote == v) {
            return;
        }
        this._remote = v;
        this._isDirty = true;
    }

    /**
     * @description 附加参数 假设resources语言包为
     * @example 示例
     * export let i18n = {
     * language : cc.sys.LANGUAGE_CHINESE,
     *      tips : "您好",
     *      test : "测试 : {0}-->{1}-->{2}"
     * }
     * node.getComponent(cc.Label).language = "tips"; //string显示为：您好
     * node.getComponent(cc.Label).language = "test"; //string显示为：您好
     * node.getComponent(cc.Label).params = [100,200,300]; //string显示为：测试 : 100-->200-->300
     */
    @property({ displayName: "语言包附加参数", tooltip: "附加参数，如果语言包中有 xx{0}{1},有两个占位的参数需要替换", type: CCString })
    get params() {
        return this._params;
    }
    set params(v) {
        this._params = v;
        this._isDirty = true;
    }

    /**
     * @description 是否启用多语言,默认为启用
     */
    @property({ displayName: "是否启用多语言", tooltip: "是否启用多语言,默认为启用" })
    get isUseMultilingual() {
        return this._mult;
    }
    set isUseMultilingual(v) {
        if (v == this._mult) {
            return;
        }
        this._mult = v;
        this._isDirty = true;
    }

    /**
     * @description 资源持有人
     */
    @property({ displayName: "资源持有人", tooltip: "资源持有人" })
    get user() {
        return this._user;
    }
    set user(v) {
        this._user = v;
    }

    onLoad(): void {
        super.onLoad();
        App.language.add(this);
        this.update(0);
    }

    onDestroy(): void {
        App.language.remove(this);
        super.onDestroy();
    }

    protected update(dt: number): void {
        if (super.update) {
            super.update(dt);
        }
        if (this._isDirty) {
            this.forceDoLayout();
            this._isDirty = false;
        }
    }

    async forceDoLayout(): Promise<void> {
        if (this.isUseMultilingual) {
            let bundle = this.bundle;
            let realBundle = Bundles[bundle]
            let loaded = App.bundleManager.getBundle(realBundle);
            if (!loaded) {
                // Log.d(`${realBundle}未加载`);
                return;
            }

            let url = App.getLanguage(this.language as any,this.params, realBundle)
            if (!url) {
                return;
            }
            let view = await App.uiManager.getView(this.user);
            if (this.isRemote) {
                // Log.d("加载远程图片")
                App.asset.remote.loadImage(url, true).then((data) => {
                    if (data) {
                        setSpriteSpriteFrame(view, url, this, data, (data) => {
                            if (this.onLoadComplete) {
                                this.onLoadComplete(data);
                            }
                        }, Macro.BUNDLE_REMOTE, Resource.Type.Remote, false);
                    }
                });
            } else {
                if (this.languageAtlas.length > 0) {
                    // Log.d("设置图集",this.languageAtlas);
                    //在纹理图集中查找
                    let urls = App.getLanguage(this.languageAtlas as any,[], realBundle)
                    App.cache.getSpriteFrameByAsync(urls, url, view, addExtraLoadResource, realBundle).then((data) => {
                        if (data && data.isTryReload) {
                            //来到这里面程序已经崩溃了，无意义在处理了
                        } else if (data && data.spriteFrame) {
                            setSpriteSpriteFrame(view, data.url, this, data.spriteFrame, (data) => {
                                if (this.onLoadComplete) {
                                    this.onLoadComplete(data);
                                }
                            }, realBundle, Resource.Type.Local, false, true);
                        }
                    });
                } else {
                    url = url + "/spriteFrame";
                    // Log.d(`资源路径：${realBundle}/${url}`);
                    App.cache.getCacheByAsync(url, SpriteFrame, realBundle)
                        .then(spriteFrame => {
                            setSpriteSpriteFrame(view, url, this, spriteFrame, (data) => {
                                if (this.onLoadComplete) {
                                    this.onLoadComplete(data);
                                }
                            }, realBundle);
                        })
                }
            }
        }
    }
}
