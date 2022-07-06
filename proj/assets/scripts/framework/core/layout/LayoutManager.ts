import { LayoutParam, LayoutType } from "./LayoutDefines";

let tInverseTranslate = cc.Vec2.ZERO;
let tInverseScale = cc.Vec2.ONE;
/**
 * @description 布局管理器
 */
export class LayoutManager implements ISingleton {
    static module: string = "【布局管理器】";
    module: string = null!;

    align(layoutParam: LayoutParam) {
        let node = layoutParam.node;
        let hasTarget = layoutParam.target;
        let target: cc.Node;
        let inverseTranslate: cc.Vec2, inverseScale: cc.Vec2;
        if (hasTarget) {
            target = hasTarget;
            inverseTranslate = tInverseTranslate;
            inverseScale = tInverseScale;
            this.computeInverseTransForTarget(node, target, inverseTranslate, inverseScale);
        }
        else {
            target = node.parent;
        }
        let targetSize = this.getReadonlyNodeSize(target);
        let targetAnchor = target.getAnchorPoint();

        let isRoot = !CC_EDITOR && target instanceof cc.Scene;
        let x = node.x, y = node.y;
        let anchor = node.getAnchorPoint();

        if (layoutParam.alignFlags & LayoutType.HORIZONTAL) {

            let localLeft, localRight, targetWidth = targetSize.width;
            if (isRoot) {
                localLeft = cc.visibleRect.left.x;
                localRight = cc.visibleRect.right.x;
            }
            else {
                localLeft = -targetAnchor.x * targetWidth;
                localRight = localLeft + targetWidth;
            }

            // adjust borders according to offsets
            localLeft += layoutParam.isAbsoluteLeft ? layoutParam.left : layoutParam.left * targetWidth;
            localRight -= layoutParam.isAbsoluteRight ? layoutParam.right : layoutParam.right * targetWidth;

            if (hasTarget) {
                localLeft += inverseTranslate.x;
                localLeft *= inverseScale.x;
                localRight += inverseTranslate.x;
                localRight *= inverseScale.x;
            }

            let width, anchorX = anchor.x, scaleX = node.scaleX;
            if (scaleX < 0) {
                anchorX = 1.0 - anchorX;
                scaleX = -scaleX;
            }
            if (layoutParam.isStretchWidth) {
                width = localRight - localLeft;
                if (scaleX !== 0) {
                    node.width = width / scaleX;
                }
                x = localLeft + anchorX * width;
            }
            else {
                width = node.width * scaleX;
                if (layoutParam.isAlignHorizontalCenter) {
                    let localHorizontalCenter = layoutParam.isAbsoluteHorizontalCenter ? layoutParam.horizontalCenter : layoutParam.horizontalCenter * targetWidth;
                    let targetCenter = (0.5 - targetAnchor.x) * targetSize.width;
                    if (hasTarget) {
                        localHorizontalCenter *= inverseScale.x;
                        targetCenter += inverseTranslate.x;
                        targetCenter *= inverseScale.x;
                    }
                    x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
                }
                else if (layoutParam.isAlignLeft) {
                    x = localLeft + anchorX * width;
                }
                else {
                    x = localRight + (anchorX - 1) * width;
                }
            }
        }

        if (layoutParam.alignFlags & LayoutType.VERTICAL) {

            let localTop, localBottom, targetHeight = targetSize.height;
            if (isRoot) {
                localBottom = cc.visibleRect.bottom.y;
                localTop = cc.visibleRect.top.y;
            }
            else {
                localBottom = -targetAnchor.y * targetHeight;
                localTop = localBottom + targetHeight;
            }

            // adjust borders according to offsets
            localBottom += layoutParam.isAbsoluteBottom ? layoutParam.bottom : layoutParam.bottom * targetHeight;
            localTop -= layoutParam.isAbsoluteTop ? layoutParam.top : layoutParam.top * targetHeight;

            if (hasTarget) {
                // transform
                localBottom += inverseTranslate.y;
                localBottom *= inverseScale.y;
                localTop += inverseTranslate.y;
                localTop *= inverseScale.y;
            }

            let height, anchorY = anchor.y, scaleY = node.scaleY;
            if (scaleY < 0) {
                anchorY = 1.0 - anchorY;
                scaleY = -scaleY;
            }
            if (layoutParam.isStretchHeight) {
                height = localTop - localBottom;
                if (scaleY !== 0) {
                    node.height = height / scaleY;
                }
                y = localBottom + anchorY * height;
            }
            else {
                height = node.height * scaleY;
                if (layoutParam.isAlignVerticalCenter) {
                    let localVerticalCenter = layoutParam.isAbsoluteVerticalCenter ? layoutParam.verticalCenter : layoutParam.verticalCenter * targetHeight;
                    let targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;
                    if (hasTarget) {
                        localVerticalCenter *= inverseScale.y;
                        targetMiddle += inverseTranslate.y;
                        targetMiddle *= inverseScale.y;
                    }
                    y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
                }
                else if (layoutParam.isAlignBottom) {
                    y = localBottom + anchorY * height;
                }
                else {
                    y = localTop + (anchorY - 1) * height;
                }
            }
        }

        layoutParam.result.position.x = x;
        layoutParam.result.position.y = y;
    }

    private computeInverseTransForTarget(widgetNode: cc.Node, target: cc.Node, out_inverseTranslate: cc.Vec2, out_inverseScale: cc.Vec2) {
        if ( !widgetNode.parent ){
            return;
        }
        let scaleX = widgetNode.parent.scaleX;
        let scaleY = widgetNode.parent.scaleY;
        let translateX = 0;
        let translateY = 0;
        for (let node = widgetNode.parent; ;) {
            translateX += node.x;
            translateY += node.y;
            node = node.parent;    // loop increment
            if (!node) {
                // ERROR: widgetNode should be child of target
                out_inverseTranslate.x = out_inverseTranslate.y = 0;
                out_inverseScale.x = out_inverseScale.y = 1;
                return;
            }
            if (node !== target) {
                let sx = node.scaleX;
                let sy = node.scaleY;
                translateX *= sx;
                translateY *= sy;
                scaleX *= sx;
                scaleY *= sy;
            }
            else {
                break;
            }
        }
        out_inverseScale.x = scaleX !== 0 ? (1 / scaleX) : 1;
        out_inverseScale.y = scaleY !== 0 ? (1 / scaleY) : 1;
        out_inverseTranslate.x = -translateX;
        out_inverseTranslate.y = -translateY;
    }

    private getReadonlyNodeSize(parent: cc.Node) {
        if (parent instanceof cc.Scene) {
            return cc.visibleRect;
        }
        else {
            return parent.getContentSize();
        }
    }
}