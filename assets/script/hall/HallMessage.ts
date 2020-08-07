import { CommonMessage } from "../common/net/CommonService"

export let MainCmd = {
    LOBBY_UPDATE : 100,
}

export let SubCmd = {
    UPDATE_MONEY : 100,
}

export class UpdateMoney extends CommonMessage {
    mainCmd = MainCmd.LOBBY_UPDATE;
    subCmd = SubCmd.UPDATE_MONEY;
    count = 10000;
    /**@description 打包数据 */
    fillData() {
        super.fillData();
        this.data.data = {};
        this.data.data.count = this.count;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        if (super.decode(data) ){
            this.count = this.data.data.count;
        }
        return true;
    }
}