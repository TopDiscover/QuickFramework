/*
 * @Author: your name
 * @Date: 2019-11-20 19:04:21
 * @LastEditTime: 2020-04-10 16:03:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\assets\common\base\CommonService.ts
 */

import { Service } from "../../framework/base/Service";
import { CommonConnector } from "./CommonConnector";
import { GameEventInterface } from "../../framework/base/GameEventInterface";

/**
 * @description service公共基类
 */

export class CommonService extends Service implements GameEventInterface {

    constructor() {
        super();
        //初始化连接器
        this.connector = new CommonConnector();
    }

    onEnterBackground() {
        
    }

    onEnterForgeground(inBackgroundTime: number) {

    }
}