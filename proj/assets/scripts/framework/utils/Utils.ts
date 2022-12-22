/**
 * @description 公共工具
 */

import { Tween, Node, tween, Label, Vec3, UITransform, safeMeasureText } from "cc";

const VIEW_ACTION_TAG = 999;

export class Utils implements ISingleton {
    static module: string = "【Utils】";
    module: string = null!;
    /**@description 显示视图动画 */
    showView(node: Node | null, complete: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: new Vec3(0.2, 0.2, 0.2) })
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .delay(0.05)
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    hideView(node: Node | null, complete: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    /**
     * @description 判断是否是一个有效邮箱
     */
    isMail(mailAddress: string) {
        let regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        return regex.test(mailAddress);
    }

    /**
     * @description 判断是否是一个有效的电话号码
     * 注意 : 限中国地区手机号
     * 目前匹配号段
     * 中国电信号段
     * 133、149、153、173、177、180、181、189、199
     * 中国联通号段
     * 130、131、132、145、155、156、166、175、176、185、186
     * 
     * 中国移动号段
     * 134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、178、182、183、184、187、188、198
     * 
     * 其他号段
     * 14号段以前为上网卡专属号段，如联通的是145，移动的是147等等。
     * 
     * 虚拟运营商
     * 
     * 电信：1700、1701、1702
     * 
     * 移动：1703、1705、1706
     * 
     * 联通：1704、1707、1708、1709、171
     * 版权声明：本文为CSDN博主「一木未朽」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
     * 原文链接：https://blog.csdn.net/gh2537477282/article/details/125297724
     */
    isTEL(tel: string) {
        let regex = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/g;
        return regex.test(tel);
    }

    /**
     * @description 指定宽度显示字符串内容，如果超过指定宽度则显示为 xxx..的形式
     * @param label 需要限制显示的Label组件
     * @param content 显示内容
     * @param width 限制显示宽度 默认为100px
     * @param suffix 超出显示宽度时,后缀，默认为..
     * @returns 
     */
    limitString(label: Label | null | undefined, content: string, width: number = 100, suffix = "..") {
        if (label) {
            //计算内容大小
            label.string = content;
            label.forceDoLayout();
            let trans = label.getComponent(UITransform) as UITransform;
            let contentWidth = trans.width;
            if (contentWidth <= width) {
                return;
            }
            //每一个字的宽度
            let singleWidth = contentWidth / content.length;
            let overWidth = contentWidth - width;
            let overCount = overWidth / singleWidth;
            overCount = Math.floor(overCount);
            let subString = content.substring(0, content.length - overCount) + suffix;
            if (label.assemblerData && label.assemblerData.context) {
                let safeWidth = safeMeasureText(label.assemblerData.context, subString)
                while (safeWidth > width) {
                    subString = subString.substring(0, subString.length - suffix.length - 1) + suffix;
                    safeWidth = safeMeasureText(label.assemblerData.context, subString)
                }
            }
            label.string = subString;
        }
    }

    /**
     * @description 转换成千分位分隔形式
     * @example 
     * 1000000000 -->  1,000,000,000
     * */
    toThousandths(data: number) {
        let prefix: string = "";
        if (data < 0) {
            data *= -1;
            prefix = '-';
        }
        let digitParten = /(^|\s)\d+(?=\.?\d*($|\s))/g;
        let miliParten = /(?=(?!\b)(\d{3})+\.?\b)/g
        let str: string = data.toString().replace(digitParten, (m) => {
            return m.replace(miliParten, ",");
        })
        return prefix + str;
    }

    /**
     * @description 格式化成K,M,B,T计数单位
     * @param data 传入数值，支持科学计数法
     * @param point 精确小数点位数 默认为2位
     */
    toFormat(data: number, point: number = 2) {
        let K = 1000;
        let scales: { [key: string]: number } = {
            K: K,
            M: K * K,
            B: K * K * K,
            T: K * K * K * K
        }
        let units = ["K", "M", "B", "T"];
        let unit = "";
        let numberString = "";
        let tempValue = 0;
        let flag = 1;
        if (data < 0) {
            flag = -1;
        }
        data = Math.abs(data);
        if (data < K) {
            numberString = data.toFixed(point);
        } else {
            for (let i = units.length - 1; i >= 0; i--) {
                let scale = scales[units[i]];
                tempValue = data / scale;
                if (tempValue >= 1) {
                    numberString = tempValue.toFixed(point);
                    unit = units[i];
                    break;
                }
            }
        }
        tempValue = parseFloat(numberString);
        return `${tempValue * flag}${unit}`;
    }

    /**
     * @description 将K,M,B,T显示的字符串转换成数值
     * @param formatValue 传入格式化的字符串 1.2K 支持科学计数法
     * @param point 获取精确小数点位数
     * @example 
     * toNumber("1.234567K",2) = 1234.57
     * toNumber("1.e3K",2) = 1000000
     * toNumber("qqq1.e3Kee",2) = 1000000
     */
    toNumber(formatValue: string, point: number = 2) {
        let reg = /-?\d+e?[+-]?\d+[KMBT]?|-?\d*\.\d*e?[+-]?\d*[KMBT]?|-?\d+[KMBT]?/;
        let matchs = formatValue.match(reg);
        if (matchs && matchs.length > 0) {
            //摘取字符串中的数值
            let K = 1000;
            let scales: { [key: string]: number } = {
                K: K,
                M: K * K,
                B: K * K * K,
                T: K * K * K * K
            }
            let valueStr = ""
            for (let index = 0; index < matchs.length; index++) {
                valueStr += matchs[index];
            }
            let unitMatch = valueStr.match(/[KMBT]/);
            let unit: string = "";
            if (unitMatch && unitMatch.length > 0) {
                unit = unitMatch[0];
            }

            let numberPart = valueStr.substring(0, valueStr.length - unit.length);
            let numberValue = parseFloat(numberPart);
            let scale = scales[unit];
            if (scale) {
                //放在整数部分
                numberValue *= scale;
            }
            return parseFloat(numberValue.toFixed(point));
        }
        Log.e(`无法匹配${formatValue}`)
        return 0;
    }

    /**
     * @description 判断是否是一个有效的中国公民身份证号码
     * @param id 
     * @returns 
     */
    isIDNumber(id: string) {
        //18 位身份证号
        let test = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/g;
        if (test.test(id)) {
            return true;
        }
        return false;
    }

    /**
     * @description 判断是否是腾讯QQ号(腾讯QQ号从10000开始)
     * @param qq 
     */
    isTencentQQ(qq: string) {
        let test = /^[1-9][0-9]{4,}$/;
        if (test.test(qq)) {
            return true;
        }
        return false;
    }
}