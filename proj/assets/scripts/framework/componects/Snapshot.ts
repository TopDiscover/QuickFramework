import { _decorator, Component, Camera, RenderTexture, view, UITransform, ImageAsset, Texture2D, SpriteFrame, Sprite, sys, Size, native, assetManager, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @description 快照节点
 * 注意，只会截图快照摄像头下的可见节点
 * 如果需要拍照全部分，请设置screenShotCamera的Visibility
 * @example
 * ```ts
 *  let snapshot = girl.addComponent(Snapshot)
 *  snapshot.onCaptureComplete = (sp,size)=>{
 *      let sprite = girlshow.getComponent(Sprite);
 *      if ( sprite ){
 *          sprite.spriteFrame = sp;
 *      }
 *      girlshow.getComponent(UITransform)?.setContentSize(size);
 *  }
 * ```
 */
@ccclass('Snapshot')
export class Snapshot extends Component {

    private _camera: Camera = null!;

    /**@description 截图完成,调试时用来检查截图是否正确 */
    onCaptureComplete?: (spriteframe: SpriteFrame, size: Size) => void = undefined;

    private _texture: RenderTexture = null!;
    private _canvas: HTMLCanvasElement = null!;
    private _buffer: Uint8Array = null!;

    start() {
        this._camera = Manager.uiManager.screenShotCamera;
        super.start && super.start();
        this._texture = new RenderTexture();
        this._texture.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height
        });
        this._camera.targetTexture = this._texture;
        this.scheduleOnce(() => {
            this.capture();
        }, 0.2)
    }

    capture() {
        let trans = this.node.getComponent(UITransform);
        if (!trans) {
            return;
        }
        let width = trans.width;
        let height = trans.height;
        let worldPos = this.node.getWorldPosition();
        let x = worldPos.x + ( 0 - trans.anchorX ) * trans.width;
        let y = worldPos.y + ( 0 - trans.anchorY ) * trans.height;
        this._buffer = this._texture.readPixels(Math.round(x), Math.round(y), width, height) as Uint8Array;
        if (this.onCaptureComplete) {
            let sp = this.genSpriteFrame(width, height);
            this.onCaptureComplete(sp,new Size(width,height));
        }
        this.saveImage();
        this.destroy();
    }

    /**@description 生成SpriteFrame */
    private genSpriteFrame(width: number, height: number) {
        let img = new ImageAsset();
        img.reset({
            _data: this._buffer,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let texture = new Texture2D();
        texture.image = img;
        let sf = new SpriteFrame();
        sf.texture = texture;
        sf.packable = false;
        sf.flipUVY = true;
        if (sys.isNative && (sys.os == sys.OS.IOS || sys.os == sys.OS.OSX)) {
            sf.flipUVY = false;
        }
        return sf;
    }

    /**
     * @description 保存图片到本地
     * @param width 
     * @param height 
     * @param arrayBuffer 
     */
    private savaAsImage(width: number, height: number, arrayBuffer: Uint8Array) {
        if (sys.isBrowser) {
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
                this._canvas.width = width;
                this._canvas.height = height;
            } else {
                this.clearCanvas();
            }
            let ctx = this._canvas.getContext('2d')!;
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            //@ts-ignore
            Manager.canvasHelper.saveAsPNG(this._canvas, width, height);
            Manager.tips.show(`保存图片成功`);
        } else if (sys.isNative) {
            // console.log("原生平台暂不支持图片下载");
            // return;
            let filePath = native.fileUtils.getWritablePath() + 'render_to_sprite_image.png';

            // 目前 3.0.0 ~ 3.4.0 版本还不支持 jsb.saveImageData ,引擎计划在 3.5.0 支持, 要保存 imageData 为本地 png 文件需要参考下方的 pr 定制引擎
            // https://gitee.com/zzf2019/engine-native/commit/1ddb6ec9627a8320cd3545d353d8861da33282a8

            //@ts-ignore
            if (native.saveImageData) {
                //@ts-ignore
                let success = native.saveImageData(this._buffer, width, height, filePath);
                if (success) {
                    // 用于测试图片是否正确保存到本地设备路径下
                    assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset) => {
                        if (err) {
                            Log.d("show image error")
                        } else {
                            var newNode = instantiate(this.node);
                            newNode.setPosition(new Vec3(-newNode.position.x, newNode.position.y, newNode.position.z));
                            if (this.node.parent) {
                                this.node.parent.addChild(newNode);
                            }

                            const spriteFrame = new SpriteFrame();
                            const texture = new Texture2D();
                            texture.image = imageAsset;
                            spriteFrame.texture = texture;
                            let comp = newNode.getComponent(Sprite);
                            if (comp) {
                                comp.spriteFrame = spriteFrame;
                            }

                            spriteFrame.packable = false;
                            spriteFrame.flipUVY = true;
                            if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
                                spriteFrame.flipUVY = false;
                            }
                            Manager.tips.show(`成功保存在设备目录并加载成功: ${filePath}`);
                        }
                    });
                    Log.d("save image data success, file: " + filePath);
                    Manager.tips.show(`成功保存在设备目录: ${filePath}`);
                }
                else {
                    Log.e("save image data failed!,需要>=3.6.1版本");
                    Manager.tips.show(`保存图片失败`);
                }
            }
        } else if (sys.platform === sys.Platform.WECHAT_GAME) {
            if (!this._canvas) {
                //@ts-ignore
                this._canvas = wx.createCanvas();
                this._canvas.width = width;
                this._canvas.height = height;
            } else {
                this.clearCanvas();
            }
            var ctx = this._canvas.getContext('2d')!;

            var rowBytes = width * 4;

            for (var row = 0; row < height; row++) {
                var sRow = height - 1 - row;
                var imageData = ctx.createImageData(width, 1);
                var start = sRow * width * 4;

                for (var i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }

                ctx.putImageData(imageData, 0, row);
            }
            //@ts-ignore
            this._canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: this._canvas.width,
                height: this._canvas.height,
                destWidth: this._canvas.width,
                destHeight: this._canvas.height,
                fileType: "png",
                success: (res: any) => {
                    //@ts-ignore
                    wx.showToast({
                        title: "截图成功"
                    });
                    Manager.tips.show(`截图成功`);
                    //@ts-ignore
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: (res: any) => {
                            //@ts-ignore              
                            wx.showToast({
                                title: "成功保存到设备相册",
                            });
                            Manager.tips.show(`成功保存在设备目录: ${res.tempFilePath}`);
                        },
                        fail: () => {
                            Manager.tips.show(`保存图片失败`);
                        }
                    })
                },
                fail: () => {
                    //@ts-ignore
                    wx.showToast({
                        title: "截图失败"
                    });
                    Manager.tips.show("截图失败");
                }
            })
        }
    }

    /**
     * @description 清除Canvas
     */
    private clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    private saveImage() {
        let trans = this.node.getComponent(UITransform);
        if (trans) {
            this.savaAsImage(trans.width, trans.height, this._buffer)
        }
    }
}