import { LobbyService } from "../../common/net/LobbyService";
import { TestBinaryMessage } from "./CmdBinaryMessage";
import { UpdateMoney, TestMsg } from "./HallMessage";
import NetHelper from "../../framework/controller/NetHelper";

class _HallNetHelper extends NetHelper<LobbyService>{

    constructor(){
        super(LobbyService.instance);
    }

    sendProtoMessage() {
        let testProto = new TestMsg();
        testProto.data.awesomeField = "这是一个中文的测试";
        this.service.send(testProto);
    }

    sendJsonMessage() {
        let msg = new UpdateMoney();
        this.service.send(msg);
    }

    sendBinaryMessage() {
        let binaryMessage = new TestBinaryMessage();
        this.service.send(binaryMessage);
    }
}
export let HallNetHelper = new _HallNetHelper();
