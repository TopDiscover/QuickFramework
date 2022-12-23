const { ccclass, property } = cc._decorator;

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
@ccclass
export class Snapshot extends cc.Component {

    private _camera: cc.Camera = null!;

    /**@description 截图完成,调试时用来检查截图是否正确 */
    onCaptureComplete?: (spriteframe: cc.SpriteFrame, size: cc.Size) => void = undefined;

    private _texture: cc.RenderTexture = null!;
    private _canvas: HTMLCanvasElement = null!;
    private _buffer: Uint8Array = null!;

    protected start() {
        this._camera = Manager.uiManager.screenShotCamera;
        this._camera.node.active = true;
        super.start && super.start();
        this._texture = new cc.RenderTexture();
        let context = (cc.game as any)._renderContext as WebGL2RenderingContext
        this._texture.initWithSize(
            cc.view.getVisibleSize().width,
            cc.view.getVisibleSize().height,
            context.STENCIL_INDEX8
        );
        this._camera.targetTexture = this._texture;
        this._camera.render();
        this.capture();
    }

    protected onDestroy(): void {
        this._camera.node.active = false;
        super.onDestroy && super.onDestroy();
    }

    private capture() {
        let width = this.node.width;
        let height = this.node.height;
        let worldPos = this.node.getBoundingBoxToWorld()
        let x = worldPos.x;
        let y = worldPos.y;
        this._buffer = this._texture.readPixels(this._buffer, Math.round(x), Math.round(y), width, height) as Uint8Array;
        this.saveImage();
    }

    /**@description 生成SpriteFrame */
    private genSpriteFrame(width: number, height: number) {
        let ele = Manager.canvasHelper.convertToPNG(this._canvas, width, height);
        let texture = new cc.Texture2D();
        texture.initWithElement(ele)
        let sf = new cc.SpriteFrame(texture);
        return sf;
    }

    private createImageData(width: number, height: number, arrayBuffer: Uint8Array) {
        if (cc.sys.isBrowser || cc.sys.platform === cc.sys.WECHAT_GAME) {
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

    private onCaptureFinish(width: number, height: number, spriteFrame?: cc.SpriteFrame) {
        if (this.onCaptureComplete) {
            if (spriteFrame == undefined) {
                spriteFrame = this.genSpriteFrame(width, height);
            }
            this.onCaptureComplete(spriteFrame, new cc.Size(width, height));
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
        if (cc.sys.isBrowser) {
            this.createImageData(width, height, arrayBuffer);
            //@ts-ignore
            Manager.canvasHelper.saveAsPNG(this._canvas, width, height);
            Manager.tips.show(Manager.getLanguage("capture_success"));
            this.onCaptureFinish(width, height);
        } else if (cc.sys.isNative) {
            let date = new Date()
            let fileName = date.format("yyyy_MM_dd_hh_mm_ss_SS") + ".png";
            let filePath = `${Manager.platform.screenshotsPath}/${fileName}`;
            //@ts-ignore
            let buffer = this.flipImageY(this._buffer, width, height);
            let success = jsb.saveImageData(buffer, width, height, filePath);
            if (success) {
                if (this.onCaptureComplete) {
                    // 用于测试图片是否正确保存到本地设备路径下
                    cc.assetManager.loadRemote<cc.Texture2D>(filePath, (err, texture) => {
                        if (err) {
                            Log.d("show image error")
                        } else {
                            Manager.tips.show(Manager.getLanguage("capture_save_local_success1", [filePath]));
                            let spriteFrame = new cc.SpriteFrame(texture);
                            this.onCaptureFinish(width, height, spriteFrame);
                        }
                    });
                }
                Log.d("save image data success, file: " + filePath);
                Manager.tips.show(Manager.getLanguage("capture_save_local_success2", [filePath]));
            }
            else {
                Log.e("save image data failed!");
                Manager.tips.show(Manager.getLanguage("capture_save_failed"));
            }
        } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
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
                            Manager.tips.show(Manager.getLanguage("capture_failed"));
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
        this.savaAsImage(this.node.width, this.node.height, this._buffer)
    }
}