import { randomRangeInt, Vec2 } from "cc";
import { ANITIME, CELL_STATUS, CELL_TYPE, EliminateEffect, GRID_HEIGHT, GRID_WIDTH } from "../data/EliminateDefines";
import EliminateCellModel from "./EliminateCellModel";

export default class EliminateGameModel {

    private cells: EliminateCellModel[][] = null!;
    private lastPos = new Vec2(-1, -1);
    /**@description 保存当前所有可生成的种类的类型 */
    private cellCreateType: CELL_TYPE[] = [];
    /**@description 动画播放的当前时间 */
    private curTime = 0;

    /**@description 检索格子的方向 */
    private readonly direction = {
        row: [new Vec2(1, 0), new Vec2(-1, 0)],
        col: [new Vec2(0, -1), new Vec2(0, 1)]
    }

    /**@description 发生改变的model，将作为返回值，给view播动作 */
    private changeModels: EliminateCellModel[] = [];
    /**@description 动物消失，爆炸等特效 */
    private effectsQueue: EliminateEffect[] = [];

    constructor() {
        this.initCreateType();
    }

    /**@description 初始化可生成的类型 */
    private initCreateType() {
        this.cellCreateType = [];
        for (let i = CELL_TYPE.BEAR; i <= CELL_TYPE.HORSE; i++) {
            this.cellCreateType.push(i);
        }
    }

    getCells() {
        return this.cells;
    }

    init() {
        this.cells = [];
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            this.cells[i] = [];
            for (let j = 1; j <= GRID_WIDTH; j++) {
                this.cells[i][j] = new EliminateCellModel();
            }
        }

        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                let flag = true;
                //简单粗暴，生成一个不可消失的盘面
                while (flag) {
                    flag = false;
                    this.cells[i][j].type = this.randomCellType();
                    let result = this.checkPoint(j, i);
                    if (result.result.length > 2) {
                        flag = true;
                    }
                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }
    }

    /**@description 随机生成了一个类型 */
    private randomCellType() {
        let index = randomRangeInt(0, this.cellCreateType.length);
        return this.cellCreateType[index];
    }

    /**
     * @description 检测该格子位置是否可消除，
     * @param x 
     * @param y 
     * @returns 
     */
    private checkPoint(x: number, y: number) {
        let rowResult = this.checkPointWithDirection(x, y, this.direction.row);
        let colResult = this.checkPointWithDirection(x, y, this.direction.col);
        let result: Vec2[] = [];
        let newCellStatus = CELL_STATUS.COMMON;
        if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = CELL_STATUS.BIRD;
        } else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = CELL_STATUS.WRAP;
        } else if (rowResult.length >= 4) {
            newCellStatus = CELL_STATUS.LINE;
        } else if (colResult.length >= 4) {
            newCellStatus = CELL_STATUS.COLUMN;
        }

        if (rowResult.length >= 3) {
            result = rowResult;
        }
        if (colResult.length >= 3) {
            //合并
            let temp = result.concat();
            colResult.forEach((newEle) => {
                let flag = false;
                temp.forEach((oldEle) => {
                    if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                        flag = true;
                    }
                });
                if (!flag) {
                    result.push(newEle);
                }
            });
        }

        return {
            result: result,
            status: newCellStatus,
            type: this.cells[y][x].type
        };
    }

    /**@description 找出单一方向上跟x,y相同类型的格子 */
    private checkPointWithDirection(x: number, y: number, direction: Vec2[]) {
        let queue: Vec2[] = [];

        //计录当前格子是否已经放入过
        let record : any = {};
        record[`${x}_${y}`] = true;
        queue.push(new Vec2(x, y));

        let front = 0;
        while (front < queue.length) {
            let pos = queue[front];
            let model = this.cells[pos.y][pos.x];
            front++;
            if (!model) {
                continue;
            }

            //查找该位置的左右/上下是否与自己类型相同,如果相同，放到队列中
            for (let i = 0; i < direction.length; i++) {
                let tempX = pos.x + direction[i].x;
                let tempY = pos.y + direction[i].y;
                //检查是否超出视图边界
                if ((tempX < 1 || tempX > GRID_WIDTH) || //左右边界
                    (tempY < 1 || tempY > GRID_HEIGHT) || //上下边界
                    (record[`${tempX}_${tempY}`]) || //是否已经添加过此格子
                    (!this.cells[tempY][tempX]) //如果该格子无
                ) {
                    continue;
                }
                //如果左右/上下与该格子的类型相同
                if (model.type == this.cells[tempY][tempX].type) {
                    record[`${tempX}_${tempY}`] = true;
                    queue.push(new Vec2(tempX, tempY));
                }
            }
        }

        return queue;
    }

    selectCell(cellPos: Vec2): {
        models: EliminateCellModel[],
        effects: EliminateEffect[]
    } {
        this.changeModels = [];
        this.effectsQueue = [];
        let lastPos = this.lastPos;
        // log("cur",cellPos);
        // log("last",lastPos);
        let delta = Math.abs(cellPos.x - lastPos.x) + Math.abs(cellPos.y - lastPos.y);
        if (delta != 1) {
            //非相邻格子，直接返回
            this.lastPos = cellPos;
            return {
                models: this.changeModels,
                effects: this.effectsQueue
            };
        }

        let curClickCell = this.cells[cellPos.y][cellPos.x];//当前点击的格子
        let lastClickCell = this.cells[lastPos.y][lastPos.x];//上一次点击的格子
        this.exchangeCell(lastPos, cellPos);
        let result1 = this.checkPoint(cellPos.x, cellPos.y).result;
        let result2 = this.checkPoint(lastPos.x, lastPos.y).result;
        this.curTime = 0;
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);
        // 判断两个是否是特殊的动物
        let isCanBomb = (curClickCell.status != CELL_STATUS.COMMON &&
            lastClickCell.status != CELL_STATUS.COMMON) ||
            curClickCell.status == CELL_STATUS.BIRD ||
            lastClickCell.status == CELL_STATUS.BIRD;
        if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
            //不会发生消除的情况
            //换回之前的交换数据
            this.exchangeCell(lastPos, cellPos);
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(cellPos);
            this.lastPos = new Vec2(-1, -1);
            return {
                models: this.changeModels,
                effects: this.effectsQueue
            }
        } else {
            this.lastPos = new Vec2(-1, -1);
            curClickCell.moveTo(lastPos, this.curTime);
            lastClickCell.moveTo(cellPos, this.curTime);
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush([cellPos, lastPos]);
            return {
                models: this.changeModels,
                effects: this.effectsQueue
            }
        }
    }
    /**
     * @description 消除
     * @param checkPoint 
     */
    private processCrush(checkPoint: Vec2[] | EliminateCellModel[]) {
        let cycleCount = 0;
        while (checkPoint.length > 0) {
            let bombModels: EliminateCellModel[] = [];
            if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];
                if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
                    if (model1.status == CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        bombModels.push(model1);
                    }
                    else {
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }

                }
            }
            for (let i in checkPoint) {
                let pos = checkPoint[i];
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                let results = this.checkPoint(pos.x, pos.y);
                let result = results.result;
                if (result.length < 3) {
                    continue;
                }
                for (var j in result) {
                    var model = this.cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(pos, results.status, results.type);

            }
            this.processBomb(bombModels, cycleCount);
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
    }
    /**
     * @description 下落
     */
    private down() {
        let newCheckPoint: EliminateCellModel[] = [];
        for (var i = 1; i <= GRID_HEIGHT; i++) {
            for (var j = 1; j <= GRID_WIDTH; j++) {
                if (this.cells[i][j] == null) {
                    //消除的格子，把上方的格子向下移动
                    var curRow = i;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        if (this.cells[k][j]) {
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = <any>null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(new Vec2(j, curRow), this.curTime);
                            curRow++;
                        }
                    }
                    //补足消除后未满最大行数时，在最上方添加格子
                    var count = 1;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        this.cells[k][j] = new EliminateCellModel();
                        this.cells[k][j].type = this.randomCellType();
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(new Vec2(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }

                }
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        return newCheckPoint;
    }
    /**
     * @description bombModels去重
     * @param bombModels 
     * @param cycleCount 
     */
    private processBomb(bombModels: EliminateCellModel[], cycleCount: number) {
        while (bombModels.length > 0) {
            let newBombModel: EliminateCellModel[] = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombModels.forEach((model) => {
                if (model.status == CELL_STATUS.LINE) {
                    for (let i = 1; i <= GRID_WIDTH; i++) {
                        if (this.cells[model.y][i]) {
                            if (this.cells[model.y][i].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            this.crushCell(i, model.y, false, cycleCount);
                        }
                    }
                    this.addRowBomb(this.curTime, new Vec2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.COLUMN) {
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell(model.x, i, false, cycleCount);
                        }
                    }
                    this.addColBomb(this.curTime, new Vec2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.WRAP) {
                    let x = model.x;
                    let y = model.y;
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if (this.cells[i][j] && delta <= 2) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, false, cycleCount);
                            }
                        }
                    }
                }
                else if (model.status == CELL_STATUS.BIRD) {
                    let crushType = model.type
                    if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }
                    if (crushType == CELL_TYPE.BIRD) {
                        crushType = this.randomCellType();
                    }
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            if (this.cells[i][j] && this.cells[i][j].type == crushType) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, true, cycleCount);
                            }
                        }
                    }
                }
            });
            if (bombModels.length > 0) {
                this.curTime += bombTime;
            }
            bombModels = newBombModel;
        }
    }

    private createNewCell(pos: Vec2 | EliminateCellModel, status: string, type: CELL_TYPE) {
        if (status == "") {
            return;
        }
        if (status == CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD
        }
        let model = new EliminateCellModel();
        this.cells[pos.y][pos.x] = model
        model.type = type;
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
    }

    /**
     * @description 消除逻辑
     * @param x 
     * @param y 
     * @param needShake 
     * @param step 
     */
    private crushCell(x: number, y: number, needShake: boolean, step: number) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        if (needShake) {
            model.toShake(this.curTime)
        }

        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, new Vec2(model.x, model.y), step);
        this.cells[y][x] = <any>null;
    }

    private addCrushEffect(playTime: number, pos: Vec2, step: number) {
        this.effectsQueue.push({
            playTime: playTime,
            pos: pos,
            action: "crush",
            step: step
        });
    }

    private addRowBomb(playTime: number, pos: Vec2) {
        this.effectsQueue.push({
            playTime: playTime,
            pos: pos,
            action: "rowBomb"
        });
    }

    private addColBomb(playTime:number, pos:Vec2) {
        this.effectsQueue.push({
            playTime: playTime,
            pos: pos,
            action: "colBomb"
        });
    }

    /**@description 交换数据模型数据 */
    private exchangeCell(left: Vec2, right: Vec2) {
        var temp = this.cells[left.y][left.x];
        this.cells[left.y][left.x] = this.cells[right.y][right.x];
        this.cells[left.y][left.x].x = left.x;
        this.cells[left.y][left.x].y = left.y;
        this.cells[right.y][right.x] = temp;
        this.cells[right.y][right.x].x = right.x;
        this.cells[right.y][right.x].y = right.y;
    }

    private pushToChangeModels(mode: EliminateCellModel) {
        if (this.changeModels.indexOf(mode) != -1) {
            return;
        }
        this.changeModels.push(mode);
    }

    cleanCmd() {
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
    }
}
