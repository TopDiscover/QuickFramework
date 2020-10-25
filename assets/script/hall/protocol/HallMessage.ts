import { serialize, JsonMessage } from "../../framework/net/JsonMessage";
import { MainCmd, SUB_CMD_LOBBY } from "../../common/protocol/CmdNetID";
import { ProtoMessage } from "../../framework/net/ProtoMessage";

export class TestData extends JsonMessage{

    @serialize("test",String)
    test : string = "my test";

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
// import {Type ,Message,Field} from "../../../../protobuf"
import { Type ,Field,Message} from "../../framework/external/protobuf";
@Type.d("TestMsg") 
export class TestMsgProto extends Message {

    @Field.d(1, "int32", "optional", "awesome default string")
    public mainCmd: number ;

    @Field.d(2, "int32","optional")
    public subCmd: number ;

    @Field.d(3, "string", "required", "awesome default string")
    public awesomeField: string;

    @Field.d(4, AwesomeEnum,"required",AwesomeEnum.ONE)
    public awesomeEnum: AwesomeEnum;

    constructor(){
        super()
        this.mainCmd = MainCmd.CMD_LOBBY;
        this.subCmd = SUB_CMD_LOBBY.TEST_PROTO_MSG;
    }
}

export class TestMsg extends ProtoMessage<TestMsgProto>{

    constructor(){
        super(TestMsgProto)
    }
}