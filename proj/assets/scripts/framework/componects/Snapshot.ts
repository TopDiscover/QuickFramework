import { _decorator, Component, Camera, RenderTexture, view, UITransform, ImageAsset, Texture2D, SpriteFrame, Sprite, sys, Size, native, assetManager, instantiate, Vec3, size, gfx } from 'cc';
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

    protected start() {
        this._camera = Manager.uiManager.screenShotCamera;
        super.start && super.start();
        this._texture = new RenderTexture();
        this._texture.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height,
        });
        this._camera.targetTexture = this._texture;
        this.scheduleOnce(() => {
            this.capture();
        }, 0.2)
    }

    private capture() {
        let trans = this.node.getComponent(UITransform);
        if (!trans) {
            return;
        }
        let width = trans.width;
        let height = trans.height;
        let worldPos = this.node.getWorldPosition();
        let x = worldPos.x + (0 - trans.anchorX) * trans.width;
        let y = worldPos.y + (0 - trans.anchorY) * trans.height;
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
        if (sys.isNative && (sys.os == sys.OS.IOS || sys.os == sys.OS.OSX)) {
            sf.flipUVY = false;
        }
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
            Manager.canvasHelper.saveAsPNG(this._canvas, width, height);
            Manager.tips.show(Manager.getLanguage("capture_success"));
            this.onCaptureFinish(width, height);
        } else if (sys.isNative) {
            let date = new Date()
            let fileName = date.format("yyyy_MM_dd_hh_mm_ss_SS") + ".png";
            let filePath = `${Manager.platform.screenshotsPath}/${fileName}`;

            // let success = native.fileUtils.writeDataToFile(this._buffer, filePath);

            // if (success) {
            //     this._buffer = native.fileUtils.getDataFromFile(filePath) as any;

            //     if (this.onCaptureComplete) {
            //         let sp = this.genSpriteFrame(width, height);
            //         this.onCaptureComplete(sp, new Size(width, height));
            //     }
            //     Log.d("save image data success, file: " + filePath);
            //     Manager.tips.show(`成功保存在设备目录: ${filePath}`);
            // } else {
            //     Log.e("save image data failed!");
            //     Manager.tips.show(`保存图片失败`);
            // }

            // 目前 3.0.0 ~ 3.4.0 版本还不支持 jsb.saveImageData ,引擎计划在 3.5.0 支持, 要保存 imageData 为本地 png 文件需要参考下方的 pr 定制引擎
            // https://gitee.com/zzf2019/engine-native/commit/1ddb6ec9627a8320cd3545d353d8861da33282a8
            //@ts-ignore
            if (native.saveImageData) {
                //@ts-ignore
                let buffer = this.flipImageY(this._buffer,width,height);
                (native as any).saveImageData(buffer, width, height, filePath)
                .then(()=>{
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
                                spriteFrame.flipUVY = true;
                                if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
                                    spriteFrame.flipUVY = false;
                                }
                                this.onCaptureComplete && this.onCaptureComplete(spriteFrame, new Size(width, height));
                                Manager.tips.show(Manager.getLanguage("capture_save_local_success1", [filePath]));
                            }
                        });
                    }
                    Log.d("save image data success, file: " + filePath);
                    Manager.tips.show(Manager.getLanguage("capture_save_local_success2", [filePath]));
                })
                .catch(()=>{
                    Log.e("save image data failed!");
                    Manager.tips.show(Manager.getLanguage("capture_save_failed"));
                })
            }else{
                Log.e("该版本不支持，creator版本需要>=3.6.1")
            }
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
                        title: Manager.getLanguage("capture_success")
                    });
                    Manager.tips.show(Manager.getLanguage("capture_success"));
                    //@ts-ignore
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: (res: any) => {
                            //@ts-ignore              
                            wx.showToast({
                                title: Manager.getLanguage("capture_save_photo_album"),
                            });
                            Manager.tips.show(Manager.getLanguage("capture_save_local_success2", [res.tempFilePath]));
                        },
                        fail: () => {
                            Manager.tips.show(Manager.getLanguage("capture_save_failed"));
                        }
                    })
                },
                fail: () => {
                    //@ts-ignore
                    wx.showToast({
                        title: Manager.getLanguage("capture_failed")
                    });
                    Manager.tips.show(Manager.getLanguage("capture_failed"));
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