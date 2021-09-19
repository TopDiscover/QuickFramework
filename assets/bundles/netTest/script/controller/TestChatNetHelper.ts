import NetHelper from "../../../../scripts/framework/core/net/service/NetHelper";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { HallProtoConfig } from "../../../hall/proto/HallProtoConfig";

class _TestChatNetHelper extends NetHelper<ChatService>{

    constructor() {
        super(ChatService.instance);
    }

    sendProtoMessage(hello: string) {

        type RoomInfo = typeof tp.RoomInfo;
        let RoomInfo : RoomInfo = Manager.protoManager.lookup(HallProtoConfig.CMD_ROOM_INFO.className) as any;
        let roomInfo = new CmmProto<tp.RoomInfo>(RoomInfo);
        roomInfo.data = RoomInfo.create();
        roomInfo.mainCmd = HallProtoConfig.CMD_ROOM_INFO.mainCmd;
        roomInfo.subCmd = HallProtoConfig.CMD_ROOM_INFO.subCmd;
        roomInfo.cmd = HallProtoConfig.CMD_ROOM_INFO.cmd;
        roomInfo.data.name = "高级VIP专场";
        roomInfo.data.roomID = 9999;
        type UserInfo = typeof tp.UserInfo;
        let UserInfo : UserInfo = Manager.protoManager.lookup("tp.UserInfo") as any ;
        let userInfo = UserInfo.create();
        userInfo.id = 6666;
        userInfo.level = 10;
        userInfo.money = 9900009999
        userInfo.name = "我就是玩！！！"

        let GenderType = Manager.protoManager.lookup("tp.GenderType") as protobuf.Enum;
        userInfo.gender = ((GenderType.values as any) as typeof tp.GenderType).female;
        roomInfo.data.players = [];
        roomInfo.data.players.push(userInfo);
        this.service.send(roomInfo);
    }

    sendJsonMessage(hello: string) {
        let msg = new TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
    }

    sendBinaryMessage(hello: string) {
        let binaryMessage = new TestBinaryMessage();
        binaryMessage.vHello = hello;
        this.service.send(binaryMessage);
    }
}
export let TestChatNetHelper = new _TestChatNetHelper();
