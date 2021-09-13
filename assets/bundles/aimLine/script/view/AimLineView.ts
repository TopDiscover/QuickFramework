import GameView from "../../../../scripts/framework/core/ui/GameView";
import { Graphics, _decorator ,Node, find, EventTouch, Vec2, UITransform, Vec3, PhysicsSystem2D, physics, EPhysics2DDrawFlags, ERaycast2DType, view} from "cc";
import { Config } from "../../../../scripts/common/config/Config";

/**
 * @description 瞄准线视图
 */

const {ccclass, property} = _decorator;

@ccclass
export default class AimLineView extends GameView {

    static getPrefabUrl(){
        return "prefabs/AimLineView";
    }

    /**@description 瞄准线做图 */
    private graphics : Graphics = null!;

    /**@description 当前绘制长度 */
    private curLenght : number = 0;

    private readonly AIM_LINE_MAX_LENGTH = 1800;

    private outVec = new Vec2();
    private tempVec = new Vec2();
    private outVec3 = new Vec3();
    private tempVec3 = new Vec3();

    onLoad(){
        super.onLoad();

        let goback = find("goBack",this.node);
        goback?.on(Node.EventType.TOUCH_END,this.onGoBack,this);

        this.graphics = find("graphics",this.node)?.getComponent(Graphics) as Graphics;
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;

        this.graphics.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.graphics.node.on(Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.graphics.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.graphics.node.on(Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    private onTouchStart( ev : EventTouch ){
        this.graphics.clear();
    }

    private onTouchMove( ev : EventTouch ){
        this.graphics.clear();
        this.curLenght = 0;

        const startLocation = ev.getUIStartLocation();
        const location = ev.getUILocation();

        //测试画线
        // this.drawAimLine(startLocation,location);

        //计算射线
        this.drawRayCast( startLocation , location.subtract(startLocation).normalize());
       
        this.graphics.stroke();
    }
    
    private onTouchEnd( ev : EventTouch ){
        this.graphics.clear();
    }

    private onGoBack( ){
        this.enterBundle(Config.BUNDLE_HALL);
    }

    /**
     * @description 计算射线
     * @param startLocation 起始位置，世界坐标
     * @param vectorDir 单位方向向量
     */
    private drawRayCast(startLocation: Vec2, vectorDir: Vec2) {
        //剩余长度
        const leftLength = this.AIM_LINE_MAX_LENGTH - this.curLenght;
        if(leftLength <=0 ) return;
        //计算线的终点位置
        this.tempVec.set(vectorDir);
        Vec2.add(this.outVec,startLocation,this.tempVec.multiplyScalar(leftLength));
        //射线检测
        const results = PhysicsSystem2D.instance.raycast(startLocation,this.outVec,ERaycast2DType.Closest,1<<0);
        if( results.length > 0 ){
            const result = results[0];
            //指定射线与穿过的碰撞体在哪一点相交
            const point = result.point;
            //画出当前与碰撞体相交部分的射线
            this.drawAimLine(startLocation,point);
            //计算长度
            this.tempVec.set(point);
            const lineLength = this.tempVec.subtract(startLocation).length();
            //计算已画长度
            this.curLenght += lineLength;
            //指定碰撞体在相交点的表面的法线单位向量
            const vectorN = result.normal;
            //入射单位向量
            this.tempVec.set(vectorDir);
            const vectorD = this.tempVec;
            //反射单位向量
            //参考https://blog.csdn.net/xdedzl/article/details/105074526
            //入射向量在法向量上的投影长度
            let projectionLength = vectorD.dot(vectorN);
            //利用平等四边形法则，计算出法向量在平行四边形对角线上的向量
            let diagonalVector = vectorN.multiplyScalar(projectionLength * 2);
            //计算出折射向量
            const vectorR = vectorD.subtract(diagonalVector);
            //接着计算下一段
            this.drawRayCast(point,vectorR);
        }else{
            //画出剩余部分线段
            this.drawAimLine(startLocation,this.outVec);
        }
    }

    /**
     * @description 画瞄准线
     * @param startLocation 起始位置，世界坐标系
     * @param endLocation 结束位置，世界坐标系
     */
    private drawAimLine( startLocation : Vec2 , endLocation : Vec2){
        //转换坐标
        let transform = this.graphics.node.getComponent(UITransform) as UITransform;
        this.tempVec3.set(startLocation.x,startLocation.y,0);
        transform.convertToNodeSpaceAR(this.tempVec3,this.outVec3);
        // log("start : " , this.tempVec3);
        this.graphics.moveTo(this.outVec3.x,this.outVec3.y);

        //画小圆点
        //间隔
        const delta = 20;
        //方向
        Vec2.subtract(this.outVec,endLocation,startLocation);
        //数量 
        const count = Math.round(this.outVec.length()/delta);
        //每次间隔向量
        this.outVec.normalize().multiplyScalar(delta);
        for( let i = 0 ; i < count ; i++){
            this.tempVec3.set(this.outVec.x,this.outVec.y);
            this.outVec3.add(this.tempVec3);
            this.graphics.circle(this.outVec3.x,this.outVec3.y,2);
        }
    }
}
