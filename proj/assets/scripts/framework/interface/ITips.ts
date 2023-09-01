import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class ITips implements ISingleton {
    static module: string = "【ITips】";
    module: string = null!;
    isResident = true;
    public show(msg: string) {

    }

    public finishShowItem(item: Node) {

    }

    public clear() {

    }
}

