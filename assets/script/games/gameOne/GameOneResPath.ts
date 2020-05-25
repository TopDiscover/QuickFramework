import { GamePathDelegate } from "../../common/base/ResPath";

export default class GameOneResPath extends GamePathDelegate {
    res(path:string){
        return "games/gameOne/" + path;
    }
}
