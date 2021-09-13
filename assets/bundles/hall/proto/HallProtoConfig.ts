import { MainCmd } from "../../../scripts/common/protocol/CmdDefines";
import { Net } from "../../../scripts/framework/core/net/Net";
import { GetCmdKey } from "../script/controller/GetCmdKey";
import { SUB_CMD_LOBBY } from "../script/protocol/LobbyCmd";
interface BindConfig extends Net.Proto.BindConfig {
    mainCmd : number;
    subCmd : number;
}
export let HallProtoConfig = {
    CMD_ROOM_INFO: {
        cmd: GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_PROTO_MSG),
        className: "tp.RoomInfo",
        mainCmd : MainCmd.CMD_LOBBY,
        subCmd : SUB_CMD_LOBBY.TEST_PROTO_MSG,
    }
}