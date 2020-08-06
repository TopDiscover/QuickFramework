import { language } from "../base/Language";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILabel extends cc.Label {

    private _lanKey:string = "language";
    set lanKey( value ) {
        this._lanKey = value;
        this.string = language().get(value);
    }
    @property({ visible : false , displayName : "language key",tooltip:"语言包路径，如language,控制中String是由语言包生成的，如果使用这个控制，请使用语言包的key值"})
    get lanKey(){
        return this._lanKey;
    }

    onLoad(){
        this.string = language().get(this._lanKey);
    }
    
}
