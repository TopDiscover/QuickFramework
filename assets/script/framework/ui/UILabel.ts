// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { language } from "../base/Language";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILabel extends cc.Label {

    private _lanKey:string = "language";
    set lanKey( value ) {
        //cc.log(`set key : ${value}`);
        this._lanKey = value;
        this.string = language().get(value);
    }
    @property({ displayName : "language key",tooltip:"语言包路径，如language,控制中String是由语言包生成的，如果使用这个控制，请使用语言包的key值"})
    get lanKey(){
        //cc.log(`get key : ${this._lanKey}`);
        return this._lanKey;
    }

    onLoad(){
        //cc.log(`onLoad key : ${this._lanKey}`);
        this.string = language().get(this._lanKey);
    }
    
}
