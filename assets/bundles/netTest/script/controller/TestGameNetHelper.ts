import NetHelper from "../../../../scripts/framework/core/net/service/NetHelper";
import { GameService } from "../../../../scripts/common/net/GameService";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { SUB_CMD_LOBBY } from "../../../hall/script/protocol/LobbyCmd";

class _TestGameNetHelper extends NetHelper<GameService>{

    constructor() {
        super(GameService.instance);
    }

    sendProtoMessage(hello: string) {
        let result = Manager.protoTypeManager.getParserResult(String(MainCmd.CMD_LOBBY) + String(SUB_CMD_LOBBY.TEST_PROTO_MSG));
        type TestType = typeof awesomepackage.TestType;
        let TestType : TestType = result.root.lookup("awesomepackage.TestType") ;
        
        let testProto = new CmmProto<awesomepackage.TestType>(TestType);
        testProto.data = TestType.create();
        testProto.mainCmd = MainCmd.CMD_LOBBY;
        testProto.subCmd = SUB_CMD_LOBBY.TEST_PROTO_MSG;
        testProto.cmd = String(MainCmd.CMD_LOBBY) + String(SUB_CMD_LOBBY.TEST_PROTO_MSG);
        testProto.data.awesomeField = "这只是一个测试";
        testProto.data.myStr = "这是另一个测试的字符串";
        type AwesomeMessage = typeof awesomepackage.AwesomeMessage;
        let AwesomeMessage : AwesomeMessage = result.root.lookup("awesomepackage.AwesomeMessage") ;
        let message = AwesomeMessage.create();
        message.testValue = "40000";
        message.testOne = "wiouiou";
        testProto.data.value = [];
        testProto.data.value.push(message);
        this.service.send(testProto);
    }

    sendJsonMessage(hello: string) {
        let msg = new TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
    }

    sendBinaryMessage(hello: string) {
        let binaryMessage = new TestBinaryMessage();
        binaryMessage.hello = hello;
        this.service.send(binaryMessage);
    }
}
export let TestGameNetHelper = new _TestGameNetHelper();
