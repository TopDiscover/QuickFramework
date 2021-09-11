import NetHelper from "../../../../scripts/framework/core/net/service/NetHelper";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
import { HttpPackage } from "../../../../scripts/framework/core/net/http/HttpClient";
import { TestJsonMessage } from "../protocol/TestJsonMessage";
import { Http } from "../../../../scripts/framework/core/net/http/Http";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../protocol/LobbyCmd";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";

class _HallNetHelper extends NetHelper<LobbyService>{

    constructor() {
        super(LobbyService.instance);
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

    sendHttpMessage() {

        let httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/post";
        httpPackage.data.type = Http.Type.POST;
        //"text/plain;charset=UTF-8""Accept-Encoding","gzip,deflate"
        //httpPackage.data.requestHeader = [{name : "Content-Type" , value : "text/plain"},{name:"Accept-Encoding",value:"gzip,deflate"}]
        httpPackage.data.requestHeader = { name: "Content-Type", value: "text/plain" }
        httpPackage.data.data = new Uint8Array([1, 2, 3, 4, 5]);
        httpPackage.send((data) => {
            cc.log("数据返回")
        }, () => {
            cc.log("数据错误")
        })

        httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/get";
        // httpPackage.data.requestHeader = {name : "Content-Type" , value : "text/plain"}
        httpPackage.params = {
            a: 100,
            b: "zheng"
        }
        httpPackage.send((data) => {
            cc.log("数据返回")
        }, () => {
            cc.log("数据错误")
        })

    }
}
export let HallNetHelper = new _HallNetHelper();
