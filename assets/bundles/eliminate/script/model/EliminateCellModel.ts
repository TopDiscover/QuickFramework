import { Vec2 } from "cc";
import { CELL_STATUS, CELL_TYPE, ANITIME, EliminateCmd, CELL_PREFAB_URL } from "../data/EliminateDefines";

export default class EliminateCellModel {

    type = CELL_TYPE.EMPTY;
    status = CELL_STATUS.COMMON;
    x = 1;
    y = 1;
    startX = 1;
    startY = 1;
    cmd: EliminateCmd[] = [];
    isDeath = false;

    get prefabUrl() {
        return CELL_PREFAB_URL[this.type];
    }

    setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setStartXY(x: number, y: number) {
        this.startX = x;
        this.startY = y;
    }

    setStatus(status: string) {
        this.status = status;
    }

    moveToAndBack(pos: Vec2) {
        let srcPos = new Vec2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    moveTo(pos: Vec2, playTime:number) {
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    toDie(playTime: number) {
        this.cmd.push({
            action: "toDie",
            playTime: playTime,
            keepTime: ANITIME.DIE
        })
        this.isDeath = true;
    }

    toShake(playTime: number) {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        })
    }

    setVisible(playTime:number, isVisible:boolean) {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }
}
