import { GamePathDelegate } from "../../../script/common/base/ResPath";

export default class GameOneResPath extends GamePathDelegate {
    res(path:string){
        return "games/gameOne/" + path;
    }
}
