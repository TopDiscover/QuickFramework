import NetHelper from "../../../../scripts/framework/support/net/service/NetHelper";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { TestProtoMessage } from "../../../hall/script/protocol/TestProtoMessage";

class _TestChatNetHelper extends NetHelper<ChatService>{

    constructor() {
        super(ChatService.instance);
    }

    sendProtoMessage(hello: string) {
        let testProto = new TestProtoMessage();
        testProto.data.hello = hello;
        testProto.data.afvalue = 4.5;
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
export let TestChatNetHelper = new _TestChatNetHelper();
