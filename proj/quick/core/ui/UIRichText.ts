import { CCString, Enum, RichText, _decorator } from "cc";

/**
 * @description 支持多语言
 */
const { ccclass, property, menu } = _decorator;
const Bundles = Enum(App.Bundles);

@ccclass("UIRichText")
@menu("Quick渲染组件/UIRichText")
export default class UIRichText extends RichText {

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

    forceDoLayout(): void {
        if (this.isUseMultilingual) {
            let bundle = this.bundle;
            let realBundle = Bundles[bundle] as string;
            let str = App.getLanguage(this.language as any,this.params, realBundle)
            this.string = str;
        }
    }
}
