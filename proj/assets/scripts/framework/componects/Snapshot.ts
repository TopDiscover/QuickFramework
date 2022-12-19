import { _decorator, Component, Node, RenderTexture, game, UITransform, screen, Camera, Vec2, math, Rect, Texture2D, SpriteFrame, Sprite, director, tween, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @description 快照
 */

@ccclass('Snapshot')
export class Snapshot extends Component {

    private _canvas: HTMLCanvasElement = null!
    private _camera: Camera = null!;
    private _texture: RenderTexture = null!;


    target: Node = null!;

    onLoad() {
        super.onLoad && super.onLoad();
        this.init();
    }

    /**
     * @description 初始化渲染纹理
     */
    private init() {
        this._canvas = game.canvas!;
        let texture = new RenderTexture;
        let trans = this.getComponent(UITransform);
        if (trans) {
            let gl = RenderTexture.PixelFormat.RGB888;
            texture.reset({
                width: trans.width,
                height: trans.height,
            });
            this._camera = this.node.addComponent(Camera);
            this._camera.targetTexture = texture;
            this._texture = texture;
        }
    }

    /**
     * @description 初始化图片
     */
    private initImage() {
        let dataUrl = this._canvas.toDataURL("image/png")
        let img = document.createElement("img");
        img.src = dataUrl;
        return img;
    }

    createSprite() {
        let width = this._texture.width;
        let height = this._texture.height;
        let ctx = this._canvas.getContext('2d')!;
        // this._camera.render();
        let data = this._texture.readPixels()!;
        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }
        return this._canvas;
    }
    getTargetArea() {
        let tran = this.target.getComponent(UITransform)!;
        let targetPos = tran.convertToWorldSpaceAR(new math.Vec3(0, 0, 0))
        let y = screen.windowSize.height - targetPos.y - tran.height / 2;
        let x = screen.windowSize.width - targetPos.x - tran.width / 2;
        return {
            x,
            y
        }
    }
    downloadImg() {
        this.createSprite();
        var img = this.initImage();
        this.showSprite(img)
        var dataURL = this._canvas.toDataURL("image/png")
        var a = document.createElement("a")
        a.href = dataURL;
        a.download = "image";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    // show on the canvas
    showSprite(img: HTMLImageElement) {
        let area = this.getTargetArea();
        let y = area.y;
        let x = area.x;
        let rect = new Rect(x, y, 770, 800)
        let texture = new Texture2D();

        let data = new ImageAsset;
        data.reset(img);
        texture.image = data;

        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        spriteFrame.rect = rect;

        let node = new Node();
        let sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;

        // node.zIndex = macro.MAX_ZINDEX;
        node.parent = director.getScene()! as any;
        // set position
        let width = screen.windowSize.width;
        let height = screen.windowSize.height;
        node.setPosition(width / 2, height / 2);
        node.on(Node.EventType.TOUCH_START, () => {
            node.parent = null;
            node.destroy();
        });
        this.captureAction(node, width, height);
    }
    // sprite action
    captureAction(capture: Node, width: number, height: number) {
        tween(capture).parallel(
            tween(capture).to(1, { scale: new math.Vec3(0.3, 0.3, 0.3) }),
            tween(capture).to(1, { position: new math.Vec3(width - width / 6, height / 4) })
        ).call(()=>{
            capture.destroy();
        }).start();
    }
}

