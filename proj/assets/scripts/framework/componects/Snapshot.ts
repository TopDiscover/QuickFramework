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
        this._buffer = this._texture.readPixels(this._buffer,Math.round(x), Math.round(y), width, height) as Uint8Array;
        this.saveImage();
        this.destroy();
    }

    /**@description 生成SpriteFrame */
    private genSpriteFrame(width: number, height: number) {
        let ele = Manager.canvasHelper.convertToPNG(this._canvas,width,height);
        let texture = new cc.Texture2D();
        texture.initWithElement(ele)
        let sf = new cc.SpriteFrame(texture);
        return sf;
    }

    private createImageData(width:number,height:number,arrayBuffer: Uint8Array){
        if ( cc.sys.isBrowser || cc.sys.platform === cc.sys.WECHAT_GAME){
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

    /**
     * @description 保存图片到本地
     * @param width 
     * @param height 
     * @param arrayBuffer 
     */
    private savaAsImage(width: number, height: number, arrayBuffer: Uint8Array) {
        if (cc.sys.isBrowser) {
            this.createImageData(width,height,arrayBuffer);
            //@ts-ignore
            Manager.canvasHelper.saveAsPNG(this._canvas, width, height);
            Manager.tips.show(`保存图片成功`);
            if (this.onCaptureComplete) {
                let sp = this.genSpriteFrame(width, height);
                this.onCaptureComplete(sp, new cc.Size(width, height));
            }
        } else if (cc.sys.isNative) {
            // console.log("原生平台暂不支持图片下载");
            // return;
            let filePath = jsb.fileUtils.getWritablePath() + 'render_to_sprite_image.png';

            // let success = jsb.fileUtils.writeToFile(this._buffer, filePath);

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
            // if (this.onCaptureComplete) {
            //     let sp = this.genSpriteFrame(width, height);
            //     this.onCaptureComplete(sp, new Size(width, height));
            // }
            //@ts-ignore
            // if (native.saveImageData) {
            //     //@ts-ignore
            //     native.saveImageData(this._buffer, width, height, filePath)
            //     .then(()=>{
            //         if (this.onCaptureComplete) {
            //             // 用于测试图片是否正确保存到本地设备路径下
            //             assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset) => {
            //                 if (err) {
            //                     Log.d("show image error")
            //                 } else {
            //                     const spriteFrame = new SpriteFrame();
            //                     const texture = new Texture2D();
            //                     texture.image = imageAsset;
            //                     spriteFrame.texture = texture
            //                     spriteFrame.packable = false;
            //                     spriteFrame.flipUVY = true;
            //                     if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
            //                         spriteFrame.flipUVY = false;
            //                     }
            //                     this.onCaptureComplete && this.onCaptureComplete(spriteFrame, new Size(width, height));
            //                     Manager.tips.show(`成功保存在设备目录并加载成功: ${filePath}`);
            //                 }
            //             });
            //         }
            //         Log.d("save image data success, file: " + filePath);
            //         Manager.tips.show(`成功保存在设备目录: ${filePath}`);
            //     })
            //     .catch(()=>{
            //         Log.e("save image data failed!");
            //         Manager.tips.show(`保存图片失败`);
            //     })
            // }else{
            //     Log.e("该版本不支持，creator版本需要>=3.6.1")
            // }
        } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.createImageData(width,height,arrayBuffer);
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

            if (this.onCaptureComplete) {
                let sp = this.genSpriteFrame(width, height);
                this.onCaptureComplete(sp, new cc.Size(width, height));
            }
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