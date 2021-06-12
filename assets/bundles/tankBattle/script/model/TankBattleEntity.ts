
import { _decorator, Component, Node, BoxCollider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TankBattleEntity')
export class TankBattleEntity extends Component {

    start(){
        let collider = this.getComponent(BoxCollider2D) as BoxCollider2D;
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
    }
    protected onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
    }
    protected onEndContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }
    protected onPreSolve (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        // console.log('onPreSolve');
    }
    protected onPostSolve (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('onPostSolve');
    }
}
