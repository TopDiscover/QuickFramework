
import { MainCmd } from "../../../../script/common/protocol/CmdDefines";
import { ProtoMessage } from "../../../../script/framework/net/ProtoMessage";

export enum AwesomeEnum{
    ONE = 1,
    TWO = 2,
}

//写的时候先打开，引用声明的，好提示,写完之前使用下面的正确引用
// import { Type ,Message,Field, parse } from "../../../../../protobuf";
import { Type ,Message,Field, parse } from "../../../../script/framework/external/protobuf";
import { SUB_CMD_LOBBY } from "./LobbyCmd";

@Type.d("TestProtoData") 
export class TestProtoData extends Message {

    @Field.d(1, "string", "required", "awesome default string")
    public awesomeField: string;

    @Field.d(2, AwesomeEnum,"required",AwesomeEnum.ONE)
    public awesomeEnum: AwesomeEnum;

    @Field.d(3,"float","required",3.3)
    public afvalue : number = 3.3;

    constructor(){
        super()
        
    }
}

export class TestProtoMessage extends ProtoMessage<TestProtoData>{
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.TEST_PROTO_MSG;
    constructor(){
        super(TestProtoData)
    }
}