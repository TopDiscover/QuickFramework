import { Vec2 } from "cc";

/**@@description 格子类型 */
export enum CELL_TYPE {
    EMPTY = 0,
    /**@description 熊*/
    BEAR,
    /**@description 猫头鹰*/
    CAT,
    /**@description 狐狸*/
    FOX,
    /**@description 小鸡*/
    CHICKEN,
    /**@description 青蛙*/
    FROG,
    /**@description 河马*/
    HORSE,
    /**@description 小鸟*/
    BIRD,
}

/**@description 格子类型对应prefab url */
export const CELL_PREFAB_URL = [
    null,
    "prefabs/Bear",
    "prefabs/Cat",
    "prefabs/Fox",
    "prefabs/Chicken",
    "prefabs/Frog",
    "prefabs/Horse",
    "prefabs/Bird",
];

/**@description 特效配置 */
export const EFFECTS_CONFIG = {
    crush : {
        url : "prefabs/Crush",
        action : "effect"
    },
    rowBomb : {
        url : "prefabs/BombWhite",
        action : "effect_line"
    },
    colBomb : {
        url : "prefabs/BombWhite",
        action : "effect_col"
    }
}

/**@description 格子状态 */
export const CELL_STATUS = {
    COMMON: "",
    CLICK: "click",
    /**@description 横向消息单位>=4*/
    LINE: "line",
    /**@description 纵向消息单位>=4*/
    COLUMN: "column",
    /**@description 当横向跟纵向可消息单位>=3时 */
    WRAP: "wrap",
    /**@description 当可消除的格子>=5个时，创建一个小鸟 */
    BIRD: "bird",
}

/**@description 游戏网格横向个数 */
export const GRID_WIDTH = 10;
/**@description 游戏网格纵向个数 */
export const GRID_HEIGHT = 10;

/**@description 游戏格子大小 */
export const CELL_SIZE = 70;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_SIZE;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_SIZE;

// ********************   时间表  animation time **************************
export const ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
}

export interface EliminateCmd {
    isVisible?: any;
    action: string,
    keepTime: number,
    playTime: number,
    pos?: Vec2
}

export interface EliminateEffect {
    action: string,
    pos: Vec2,
    playTime: number,
    step?: number,
}