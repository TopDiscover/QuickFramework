import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TaxiMap")
export class TaxiMap extends Component {
    @property({
        type: [Node]
    })
    path: Node[] = [];

    @property
    public maxProgress = 2;
}