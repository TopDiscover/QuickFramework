import { _decorator, Component, Node, Prefab, instantiate } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TaxiPoolManager")
export class TaxiPoolManager {
    public static handle = new Map<string, Node[]>();

    public static getNode(prefab: Prefab, parent: Node) {
        const name = prefab.data.name;
        let node: Node | null = null ;
        const pool = this.handle.get(name) as Node[];
        if (this.handle.has(name) && pool.length > 0) {
            node = this.handle.get(name)?.pop() as Node;
        } else {
            node = instantiate(prefab) as Node;
        }

        node.setParent(parent);
        return node;
    }

    public static setNode(target: Node) {
        const name = target.name;
        target.parent = null;
        if (this.handle.has(name)) {
            this.handle.get(name)?.push(target);
        } else {
            if (name.length > 0) {
                this.handle.set(name, [target]);
            } else {
                target.destroy();
            }
        }
    }
}
