
import { JsonMessage, serialize } from "../../../../script/framework/net/JsonMessage";
import { MainCmd, SUB_CMD_LOBBY } from "../../../../script/common/protocol/CmdDefines";
import { ProtoMessage } from "../../../../script/framework/net/ProtoMessage";
export class TestData extends JsonMessage{

    @serialize("test",String)
    test : string = "这是一个中文的字符串测试";

}

export class UpdateMoney extends JsonMessage {
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.UPDATE_MONEY;
    @serialize("count",Number)
    count : number = 1000;

    @serialize("arr",Array,String)
    testArr: Array<string> = ["1","2","3","4"];//null;

    @serialize("mapdata",Map,Number,String)
    testMap:Map<number,string> = new Map();//null;

    @serialize("test",TestData)
    testData : TestData = new TestData();

    constructor(){
        super();
        this.testMap.set(1,"ss");
        this.testMap.set(2,"s22s");
        this.testMap.set(3,"s33s");
        this.testMap.set(4,"s44s");
        this.testMap.set(5,"s55s");
        this.testMap.set(6,"s66s");
    }
}

export enum AwesomeEnum{
    ONE = 1,
    TWO = 2,
}


//写的时候先打开，引用声明的，好提示,写完之前使用下面的正确引用
// import { Type ,Message,Field, parse } from "../../../../../protobuf";
import { Type ,Message,Field, parse } from "../../../../script/framework/external/protobuf";

@Type.d("TestMsg") 
export class TestMsgProto extends Message {

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

export class TestMsg extends ProtoMessage<TestMsgProto>{
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.TEST_PROTO_MSG;
    constructor(){
        super(TestMsgProto)
    }
}