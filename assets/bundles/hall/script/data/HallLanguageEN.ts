import { sys } from "cc";

export let HALL_EN = {

    language: sys.Language.ENGLISH,
    data: {
        hall_view_game_name: [
            `BATTLE
CITY`,
            'Load Test',
            'Net Test',
            "Aim Line",
            "Node Pool",
            "三消",
        ],
        hall_view_broadcast_content: '[broadcast] congratulations!',
        hall_view_nogame_notice: '【{0}】developing!!!',
        test: " test : {0}-->{1}-->{2}-->{3}-->",
    }
}