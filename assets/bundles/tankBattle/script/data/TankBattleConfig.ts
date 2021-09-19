export namespace TankBettle {
    export enum Direction {
        MIN = 0,
        UP = MIN,
        DOWN,
        LEFT,
        RIGHT,
        MAX = RIGHT,
    }

    /**@description 最大敌人数量 */
    export const MAX_ENEMY = 20;
    /**@description 屏幕出现的最大敌人数量 */
    export const MAX_APPEAR_ENEMY = 5;
    /**@description 玩家的生命最大上限 */
    export const MAX_PLAYER_LIVE = 3;

    export enum GAME_STATUS {
        /**@description 未知*/
        UNKNOWN,
        /**@description 选择模式*/
        SELECTED,
        /**@description 游戏初始化 */
        INIT,
        /**@description 游戏中 */
        GAME,
        /**@description 游戏结束 */
        OVER,
        /**@description 过关 */
        WIN,
    }

    export enum BLOCK_TYPE {
        /**@description 墙 */
        WALL = 1,
        /**@description 石墙*/
        STONE_WALL,
        /**@description 草丛*/
        GRASS,
        /**@description 水 */
        WATER,
        /**@description 冰面 */
        ICE,
        /**@description 老巢 */
        HOME = 9,
        /**@description 老巢占位，不创建 */
        ANOTHREHOME = 8
    }

    export enum GROUP {
        Wall = "Wall",
        StoneWall = "StoneWall",
        Grass = "Grass",
        Water = "Water",
        Ice = "Ice",
        Home = "Home",
        Bullet = "Bullet",
        Player = "Player",
        /**@description 边界 */
        Boundary = "Boundary",
        Props = "Props",
    }

    /**@description 玩家状态 */
    export enum PLAYER_STATUS {
        STRONG,//这个状态下可以打白色砖块
        PROTECTED,//保护状态
    }

    /**@description 玩家状态存在时间 */
    export const PLAYER_STATUS_EXIST_TIME = 5;

    export enum ZIndex {
        TANK,
        BULLET,
        BLOCK,
        PROPS,
    }

    export enum EnemyType {
        MIN,
        /**@description 普通的，一枪一个 */
        NORMAL = MIN,
        /**@description 速度快的，一枪一个 */
        SPEED,
        /**@description 牛逼的，三枪一个 */
        STRONG,
        MAX = STRONG,
    }

    export class TankConfig {
        /** @description 坦克time时间内移动的距离 */
        distance = 5;
        /**@description 坦克每次移动distance距离需要的时间 */
        time = 0.1;
        /**@description 坦克子弹在bulletTime时间内移动的距离 */
        bulletDistance = 10;
        /**@description 坦克子弹每次移动bulletDistance距离需要的时间*/
        bulletTime = 0.1;
        /**@description 默认是只有一点生命，当受到子弹的攻击就-1 */
        live = 1;
        /**@description 射击间隔时间 */
        shootInterval = { min: 2, max: 5 };
        /**@description AI切换方向间隔时间 */
        changeInterval = { min : 4 , max : 10};
    }

    /**@description 敌人出生点位置 */
    export enum EnemyBornPosition {
        MIN,
        LEFT = MIN,
        MIDDLE,
        RIGHT,
        MAX = RIGHT,
    }

    /**@description 道具类型 */
    export enum PropsType {
        MIN,
        /**@description 添加玩家拥有坦克数量 */
        LIVE = MIN,
        /**@description 加长游戏时间 */
        TIME,
        /**@description 加强子弹威力 */
        STRONG_BULLET,
        /**@description 炸掉当前所有敌人 */
        BOOM_ALL_ENEMY,
        /**@description 添加玩家抗打能力，即玩家当前坦克生命 */
        STRONG_MY_SELF,
        /**@description 添加无敌状态 */
        GOD,
        MAX,
    }

    export enum ViewType{
        GAME_VIEW,
        START_VIEW,
    }

    export enum AUDIO_PATH {
        START = "audio/start",
        MOVE = "audio/move",
        ATTACK = "audio/attack",
        PROP = "audio/prop",
        BULLETCRACK = "audio/bulletCrack",
        PLAYERCRACK = "audio/playerCrack",
        ENEMYCRACK = "audio/tankCrack",
    }

    /**@description 道具的存在时间 */
    export const PROPS_DISAPPEAR = 10;

    /**@description 道具生成间隔时间 */
    export const PROPS_CREATE_INTERVAL = { min: 10, max: 20 };
}