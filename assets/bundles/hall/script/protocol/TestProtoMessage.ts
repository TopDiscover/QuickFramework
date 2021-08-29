
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { ProtoMessage } from "../../../../scripts/framework/support/net/message/ProtoMessage";

export enum AwesomeEnum {
    ONE = 1,
    TWO = 2,
}

//写的时候先打开，引用声明的，好提示,写完之前使用下面的正确引用
import { SUB_CMD_LOBBY } from "./LobbyCmd";

@protobuf.Type.d("TestProtoData")
export class TestProtoData extends protobuf.Message {

    @protobuf.Field.d(1, "string", "required", "awesome default string")
    public hello: string;

    @protobuf.Field.d(2, AwesomeEnum, "required", AwesomeEnum.ONE)
    public awesomeEnum: AwesomeEnum;

    @protobuf.Field.d(3, "float", "required", 3.3)
    public afvalue: number = 3.3;

    constructor() {
        super()

    }
}

export class TestProtoMessage extends ProtoMessage<TestProtoData>{
    get MsgID(): string { return String(this.mainCmd) + String(this.subCmd) }

    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.TEST_PROTO_MSG;
    constructor() {
        super(TestProtoData)
    }
}