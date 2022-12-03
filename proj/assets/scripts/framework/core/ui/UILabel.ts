
/**
 * @description 支持多语言
 */
const {ccclass, property,menu} = cc._decorator;

const Bundles = cc.Enum(Manager.Bundles);

type LANTYPE = typeof String | typeof Number

@ccclass
@menu("ui/UILabel")
export default class UILabel extends cc.Label {

    /**@description 多谗言包 */
    @property
    _lan : LANTYPE[] = [];

    @property
    _bundle = Bundles.resources;

    @property({displayName:"语言包Bundle",type:Bundles})
    get bundle(){
        return this._bundle;
    }
    set bundle(v){
        this._bundle = v;
        this.doDraw();
    }

    @property({displayName:"语言" ,type : cc.String})
    get language(){
        return this._lan;
    }
    set language(v){
        this._lan = v;
        this.doDraw(); 
    }

    protected doDraw(){
        let bundle = this.bundle;
        let realBundle = Bundles[bundle]
        let str = Manager.getLanguage(`${this._lan}`,realBundle)
        this.string = str;
    }

    protected onLoad(): void {
        this.doDraw();
    }

    protected onDestroy(): void {
        
    }
}
