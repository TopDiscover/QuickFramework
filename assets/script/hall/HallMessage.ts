import { Message } from "../framework/net/ServerConnector"
import { CommonMessage } from "../common/net/CommonService"

export let MainCmd = {
    LOBBY_UPDATE : 100,
}

export let SubCmd = {
    UPDATE_MONEY : 100,
}

export class UpdateMoney extends CommonMessage {

    count = 0;
}