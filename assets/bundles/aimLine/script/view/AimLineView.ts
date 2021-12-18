import GameView from "../../../../scripts/framework/core/ui/GameView";
import { Macro } from "../../../../scripts/framework/defines/Macros";

/**
 * @description 瞄准线视图
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class AimLineView extends GameView {

    static getPrefabUrl(){
        return "prefabs/AimLineView";
    }

    /**@description 瞄准线做图 */
    private graphics : cc.Graphics = null;

    /**@description 当前绘制长度 */
    private curLenght : number = 0;

    private readonly AIM_LINE_MAX_LENGTH = 1800;

    onLoad(){
        super.onLoad();

        let goback = cc.find("goBack",this.node);
        goback.on(cc.Node.EventType.TOUCH_END,this.onGoBack,this);

        this.graphics = cc.find("graphics",this.node).getComponent(cc.Graphics);

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = 
        // cc.PhysicsManager.DrawBits.e_aabbBit | 
        // cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit;

        this.graphics.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    private onTouchStart( ev : cc.Event.EventTouch ){
        this.graphics.clear();
    }

    private onTouchMove( ev : cc.Event.EventTouch ){
        this.graphics.clear();
        this.curLenght = 0;
        const startLocation = ev.getStartLocation();
        const location = ev.getLocation();

        //测试画线
        //this.drawAimLine(startLocation,location);

        //计算射线
        this.drawRayCast( startLocation , location.subSelf(startLocation).normalizeSelf());
       
        this.graphics.stroke();
    }
    
    private onTouchEnd( ev : cc.Event.EventTouch ){
        this.graphics.clear();
    }

    private onGoBack( ){
        this.enterBundle(Macro.BUNDLE_HALL);
    }

    /**
     * @description 计算射线
     * @param startLocation 起始位置，世界坐标
     * @param vectorDir 单位方向向量
     */
    private drawRayCast(startLocation: cc.Vec2, vectorDir: cc.Vec2) {
        //剩余长度
        const leftLength = this.AIM_LINE_MAX_LENGTH - this.curLenght;
        if(leftLength <=0 ) return;
        //计算线的终点位置
        const endLocation = startLocation.add(vectorDir.mul(leftLength));
        //射线检测
        const results = cc.director.getPhysicsManager().rayCast(startLocation,endLocation,cc.RayCastType.Closest);
        if( results.length > 0 ){
            const result = results[0];
            //指定射线与穿过的碰撞体在哪一点相交
            const point = result.point;
            //画出当前与碰撞体相交部分的射线
            this.drawAimLine(startLocation,point);
            //计算长度
            const lineLength = point.sub(startLocation).mag();
            //计算已画长度
            this.curLenght += lineLength;
            //指定碰撞体在相交点的表面的法线单位向量
            const vectorN = result.normal;
            //入射单位向量
            const vectorD = vectorDir;
            //反射单位向量
            //参考https://blog.csdn.net/xdedzl/article/details/105074526
            //入射向量在法向量上的投影长度
            let projectionLength = vectorD.dot(vectorN);
            //利用平等四边形法则，计算出法向量在平行四边形对角线上的向量
            let diagonalVector = vectorN.mul(projectionLength * 2);
            //计算出折射向量
            const vectorR = vectorD.sub(diagonalVector);
            //接着计算下一段
            this.drawRayCast(point,vectorR);
        }else{
            //画出剩余部分线段
            this.drawAimLine(startLocation,endLocation);
        }
    }

    /**
     * @description 画瞄准线
     * @param startLocation 起始位置，世界坐标系
     * @param endLocation 结束位置，世界坐标系
     */
    private drawAimLine( startLocation : cc.Vec2 , endLocation : cc.Vec2){
        //转换坐标
        const graphicsStartLocation = this.graphics.node.convertToNodeSpaceAR(startLocation);
        this.graphics.moveTo(graphicsStartLocation.x,graphicsStartLocation.y);

        //画小圆点
        //间隔
        const delta = 20;
        //方向
        const vec = endLocation.sub(startLocation);
        //数量 
        const count = Math.round(vec.mag()/delta);
        //每次间隔向量
        vec.normalizeSelf().mulSelf(delta);
        for( let i = 0 ; i < count ; i++){
            graphicsStartLocation.addSelf(vec);
            this.graphics.circle(graphicsStartLocation.x,graphicsStartLocation.y,2);
        }
    }
}
