import { GameData } from "../../framework/data/GameData"
import { Macro } from "../../framework/defines/Macros"
import { UserInfo } from "./UserInfo";

export class Global extends GameData{
    static bundle = Macro.BUNDLE_RESOURCES;
    userInfo : UserInfo = new UserInfo();
}