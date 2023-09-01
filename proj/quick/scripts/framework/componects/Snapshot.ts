import { _decorator, Component, Camera, RenderTexture, view, UITransform, ImageAsset, Texture2D, SpriteFrame, Sprite, sys, Size, native, assetManager, instantiate, Vec3, size, gfx } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @description 快照节点
 * 注意，只会截图快照摄像头下的可见节点
 * 如果需要拍照全部分，请设置screenShotCamera的Visibility
 * 
 * 目前有个bug未解决，当屏幕大小比例比设计分辨率窄时，截图底部会被截断一部分,暂时未找到原因
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

    protected start() {
        this._camera = App.uiManager.screenShotCamera;
        super.start && super.start();
        this._texture = new RenderTexture();
        this._texture.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height,
        });
        this._camera.targetTexture = this._texture;
        this._camera.node.active = true;
        this.scheduleOnce(() => {
            this.capture();
        }, 0.2)
    }

    protected onDestroy(): void {
        this._camera.node.active = false;
        super.onDestroy && super.onDestroy();
    }

    private capture() {
        let trans = this.node.getComponent(UITransform);
        if (!trans) {
            return;
        }
        let width = trans.width;
        let height = trans.height;
        let worldPos = trans.getBoundingBoxToWorld();
        let x = worldPos.x;
        let y = worldPos.y;

        this._buffer = this._texture.readPixels(Math.round(x), Math.round(y), width, height) as Uint8Array;
        this.saveImage();
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
        return sf;
    }

    private createImageData(width: number, height: number, arrayBuffer: Uint8Array) {
        if (sys.isBrowser || sys.platform === sys.Platform.WECHAT_GAME) {
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
        }
    }

    private onCaptureFinish(width: number, height: number, spriteFrame?: SpriteFrame) {
        if (this.onCaptureComplete) {
            if (spriteFrame == undefined) {
                spriteFrame = this.genSpriteFrame(width, height);
            }
            this.onCaptureComplete(spriteFrame, new Size(width, height));
        }
        this.destroy();
    }

    private flipImageY(data: Uint8Array, width: number, height: number) {
        let pixels = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        let maxRow = height - 1;
        for (let row = 0; row < height; row++) {
            let srow = maxRow - row;
            let start = srow * rowBytes;
            let reStart = row * rowBytes;
            for (let i = 0; i < rowBytes; i++) {
                pixels[i + reStart] = data[start + i];
            }
        }
        return pixels;
    }

    /**
     * @description 保存图片到本地
     * @param width 
     * @param height 
     * @param arrayBuffer 
     */
    private savaAsImage(width: number, height: number, arrayBuffer: Uint8Array) {
        if (sys.isBrowser) {
            this.createImageData(width, height, arrayBuffer);
            //@ts-ignore
            App.canvasHelper.saveAsPNG(this._canvas, width, height);
            App.tips.show(App.getLanguage("capture_success"));
            this.onCaptureFinish(width, height);
        } else if (sys.isNative) {
            //原生win32平台调度运行会造成崩溃，请直接用release模式打开，可正常工作
            let date = new Date()
            let fileName = date.format("yyyy_MM_dd_hh_mm_ss_SS") + ".png";
            let filePath = `${App.platform.screenshotsPath}/${fileName}`;
            //@ts-ignore
            let buffer = this.flipImageY(this._buffer, width, height);
            native.saveImageData(buffer, width, height, filePath).then(() => {
                if (this.onCaptureComplete) {
                    // 用于测试图片是否正确保存到本地设备路径下
                    assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset) => {
                        if (err) {
                            Log.d("show image error")
                        } else {
                            const spriteFrame = new SpriteFrame();
                            const texture = new Texture2D();
                            texture.image = imageAsset;
                            spriteFrame.texture = texture
                            spriteFrame.packable = false;
                            App.tips.show(App.getLanguage("capture_save_local_success1", [filePath]));
                            this.onCaptureFinish(width,height,spriteFrame);
                        }
                    });
                }
                Log.d("save image data success, file: " + filePath);
                App.tips.show(App.getLanguage("capture_save_local_success2", [filePath]));
            }).catch(() => {
                Log.e("save image data failed!");
                App.tips.show(App.getLanguage("capture_save_failed"));
            })
        } else if (sys.platform === sys.Platform.WECHAT_GAME) {
            this.createImageData(width, height, arrayBuffer);
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
                        title: App.getLanguage("capture_success")
                    });
                    App.tips.show(App.getLanguage("capture_success"));
                    //@ts-ignore
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: (res: any) => {
                            //@ts-ignore              
                            wx.showToast({
                                title: App.getLanguage("capture_save_photo_album"),
                            });
                            App.tips.show(App.getLanguage("capture_save_local_success2", [res.tempFilePath]));
                        },
                        fail: () => {
                            App.tips.show(App.getLanguage("capture_save_failed"));
                        }
                    })
                },
                fail: () => {
                    //@ts-ignore
                    wx.showToast({
                        title: App.getLanguage("capture_failed")
                    });
                    App.tips.show(App.getLanguage("capture_failed"));
                }
            })
            this.onCaptureFinish(width, height);
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