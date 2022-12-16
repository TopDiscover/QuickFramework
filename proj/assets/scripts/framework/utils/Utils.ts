/**
 * @description 公共工具
 */

const VIEW_ACTION_TAG = 999;

export class Utils implements ISingleton {
    static module: string = "【Utils】";
    module: string = null!;
    /**@description 显示视图动画 */
    showView(node: cc.Node | null, complete: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: 0.2 })
                .to(0.2, { scale: 1.15 })
                .delay(0.05)
                .to(0.1, { scale: 1 })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    hideView(node: cc.Node | null, complete: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: 1.15 })
                .to(0.1, { scale: 0.3 })
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
    limitString(label: cc.Label | null | undefined, content: string, width: number = 100, suffix = "..") {
        if (label) {
            //计算内容大小
            label.string = content;
            label.forceDoLayout();
            let contentWidth = label.node.width;
            if (contentWidth <= width) {
                return;
            }
            //每一个字的宽度
            let singleWidth = contentWidth / content.length;
            let overWidth = contentWidth - width;
            let overCount = overWidth / singleWidth;
            overCount = Math.ceil(overCount);
            let subString = content.substring(0, content.length - overCount) + suffix;
            label.string = subString;
            label.forceDoLayout();
            while (label.node.width > width) {
                subString = subString.substring(0, subString.length - suffix.length - 1) + suffix;
                label.string = subString;
                label.forceDoLayout();
            }
            label.string = subString;
        }
    }

    /**
     * @description 转换成千分位分隔形式
     * @example 
     * 1000000000 -->  1,000,000,000
     * */
    convertThousandths(data: number) {
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
     * @description 格式化成K,M,B,T计数单位显示
     * @param data 传入数值
     * @param point 精确小数点位数 默认为2位
     */
    formatValue(data: number, point: number = 2) {
        let prefix = "";
        if (data < 0) {
            data *= -1;
            prefix = "-";
        }
        if (point < 0) {
            point = 0;
        }
        let numStr = String(data);
        let results = numStr.split(".");
        if (data < 1000) {
            if (results.length > 1) {
                //带小数点
                let integerPart = results[0];
                let decimalPart = results[1];
                decimalPart = decimalPart.substring(0, point);
                if (point <= 0) {
                    return `${prefix}${integerPart}`;
                }
                return `${prefix}${integerPart}.${decimalPart}`;
            } else {
                //无小数点的整数
                return `${prefix}${data}`;
            }
        }
        //只取出整数部分
        let result = results[0];
        let len = result.length;
        let unit = (len - 1) / 3;
        unit = Math.floor(unit);
        let unitParten = "";
        switch (unit) {
            case 1: unitParten = "K"; break;
            case 2: unitParten = "M"; break;
            case 3: unitParten = "B"; break;
            case 4: unitParten = "T"; break;
            default: {
                unitParten = "T";
                unit = 4;
            } break;
        }
        let pos = len - unit * 3;
        let digit = result.substring(0, pos);
        let decimalPoint = "";
        if (point > 0) {
            decimalPoint = result.substring(pos);
            if (decimalPoint.length > point) {
                //当前小数点部分大于保留的精度
                decimalPoint = "." + decimalPoint.substring(0, point);
            } else {
                decimalPoint = "." + decimalPoint;
                if (results.length > 1) {
                    //还有小数部分
                    decimalPoint += results[1];
                    decimalPoint = decimalPoint.substring(0, point + 1);
                }
            }
        }
        return prefix + digit + decimalPoint + unitParten;
    }

    /**
     * @description 将K,M,B,T显示的字符串转换成数值
     * @param formatValue 传入格式化的字符串 1.2K 
     * @param point 获取精确小数点位数
     * @example 
     * toNumber(1.234567K,2) = 1234.57
     */
    toNumber(formatValue: string, point: number = 2) {
        let reg = /(-*\d*)(\.*)(\d+)([KMBT]*)/g;
        let value = formatValue.match(reg);
        if (value && value.length > 0) {
            let K = 1000;
            let scales: { [key: string]: number } = {
                K: K,
                M: K * K,
                B: K * K * K,
                T: K * K * K * K
            }
            //摘取字符串中的数值
            let valueStr = value[0];
            valueStr = valueStr.replace(reg, function () {
                //整数部分
                let integerPart: string = arguments[1]
                if (integerPart.length <= 0) {
                    integerPart = "0";
                }
                //小数点
                let decimalPoint: string = arguments[2];
                //小数点部分
                let decimalPart: string = arguments[3];
                if (decimalPart.length <= 0) {
                    decimalPart = "0";
                }
                //单位
                let unit: string = arguments[4];
                let integerValue = parseInt(integerPart);
                let decimalValue = parseFloat(decimalPart);
                //有整数部分，数值放大处理
                let scale = scales[unit];
                if (scale) {
                    //放在整数部分
                    integerValue *= scale;
                    decimalValue *= scale;
                    let space = String(scale).substring(1);//取出缩放中的000
                    let temp = String(decimalValue);
                    decimalPart = temp.substring(space.length);
                    integerPart += temp.substring(0, space.length);
                }
                // console.log(`整数部分:${integerPart}`);
                // console.log(`小数点:${decimalPoint}`);
                // console.log(`小数部分:${decimalPart}`);
                return `${integerPart}${decimalPoint}${decimalPart}`;
            })
            return parseFloat(parseFloat(valueStr).toFixed(point));
        }
        return 0;
    }
}