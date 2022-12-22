
export class CanvasHelper {
    static module: string = "【CanvasHelper】";
    module: string = null!;

    private downloadMime = "image/octet-stream";
    /**
     * @description 判断平台是否支持
     */
    private get support() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        return {
            canvas: !!ctx,
            imageData: !!ctx?.getImageData,
            dataURL: !!canvas.toDataURL,
            btoa: !!window.btoa
        }
    }

    private scaleCanvas(canvas: HTMLCanvasElement, width?: number, height?: number) {
        let w = canvas.width;
        let h = canvas.height;
        if (width == undefined) {
            width = w;
        }
        if (height == undefined) {
            height = h;
        }

        let retCanvas = document.createElement("canvas");
        let retCtx = retCanvas.getContext("2d");
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx?.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    }

    private getDataURL(canvas: HTMLCanvasElement, type: string, width: number, height: number) {
        canvas = this.scaleCanvas(canvas, width, height);
        return canvas.toDataURL(type);
    }

    private saveFile(strData: string, type: string, fileName: string) {
        // document.location.href = strData;
        this.fileDownload(strData, type, fileName);
    }

    private genImage(strData: string) {
        var img = document.createElement('img');
        img.src = strData;
        return img;
    }

    private fixType(type: string) {
        type = type.toLowerCase().replace(/jpg/i, "jpeg");
        var r = type.match(/png|jpeg|bmp|gif/)![0];
        return 'image/' + r;
    }

    private encodeData(data: string | number[]) {
        if (!window.btoa) { throw 'btoa undefined' }
        var str = '';
        if (typeof data == 'string') {
            str = data;
        } else {
            for (var i = 0; i < data.length; i++) {
                str += String.fromCharCode(data[i]);
            }
        }

        return btoa(str);
    }

    private getImageData(canvas: HTMLCanvasElement) {
        let w = canvas.width;
        let h = canvas.height;
        return canvas.getContext("2d")?.getImageData(0, 0, w, h);
    }

    private makeURL(strData: string, type: string) {
        return 'data:' + type + ';base64,' + strData;
    }

    private genBitmapImage(oData: ImageData) {
        // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
        // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
        //

        var biWidth = oData.width;
        var biHeight = oData.height;
        var biSizeImage = biWidth * biHeight * 3;
        var bfSize = biSizeImage + 54; // total header size = 54 bytes

        //
        //  typedef struct tagBITMAPFILEHEADER {
        //  	WORD bfType;
        //  	DWORD bfSize;
        //  	WORD bfReserved1;
        //  	WORD bfReserved2;
        //  	DWORD bfOffBits;
        //  } BITMAPFILEHEADER;
        //
        var BITMAPFILEHEADER = [
            // WORD bfType -- The file type signature; must be "BM"
            0x42, 0x4D,
            // DWORD bfSize -- The size, in bytes, of the bitmap file
            bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
            // WORD bfReserved1 -- Reserved; must be zero
            0, 0,
            // WORD bfReserved2 -- Reserved; must be zero
            0, 0,
            // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
            54, 0, 0, 0
        ];

        //
        //  typedef struct tagBITMAPINFOHEADER {
        //  	DWORD biSize;
        //  	LONG  biWidth;
        //  	LONG  biHeight;
        //  	WORD  biPlanes;
        //  	WORD  biBitCount;
        //  	DWORD biCompression;
        //  	DWORD biSizeImage;
        //  	LONG  biXPelsPerMeter;
        //  	LONG  biYPelsPerMeter;
        //  	DWORD biClrUsed;
        //  	DWORD biClrImportant;
        //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
        //
        var BITMAPINFOHEADER = [
            // DWORD biSize -- The number of bytes required by the structure
            40, 0, 0, 0,
            // LONG biWidth -- The width of the bitmap, in pixels
            biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
            // LONG biHeight -- The height of the bitmap, in pixels
            biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
            // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
            1, 0,
            // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
            // has a maximum of 2^24 colors (16777216, Truecolor)
            24, 0,
            // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
            0, 0, 0, 0,
            // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
            biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
            // LONG biXPelsPerMeter, unused
            0, 0, 0, 0,
            // LONG biYPelsPerMeter, unused
            0, 0, 0, 0,
            // DWORD biClrUsed, the number of color indexes of palette, unused
            0, 0, 0, 0,
            // DWORD biClrImportant, unused
            0, 0, 0, 0
        ];

        var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

        var aImgData = oData.data;

        var strPixelData = '';
        var biWidth4 = biWidth << 2;
        var y = biHeight;
        var fromCharCode = String.fromCharCode;

        do {
            var iOffsetY = biWidth4 * (y - 1);
            var strPixelRow = '';
            for (var x = 0; x < biWidth; x++) {
                var iOffsetX = x << 2;
                strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) +
                    fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) +
                    fromCharCode(aImgData[iOffsetY + iOffsetX]);
            }

            for (var c = 0; c < iPadding; c++) {
                strPixelRow += String.fromCharCode(0);
            }

            strPixelData += strPixelRow;
        } while (--y);

        var strEncoded = this.encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + this.encodeData(strPixelData);

        return strEncoded;
    }

    savaAsImage(canvas: HTMLCanvasElement | string, width: number, height: number, type: string = "png", fileName: string = "defaultpng") {
        /**
         * canvas.toBlob 的第三个参数。当请求图片格式为image/jpeg或者image/webp时用来指定图片展示质量。
         * 如果这个参数的值不在指定类型与范围之内，则使用默认值，其余参数将被忽略。
         * 此处暂时默认设置为 1
         */
        let quality = 1.0;
        let _canvas: HTMLCanvasElement = null!;
        if (this.support.canvas && this.support.dataURL) {
            if (typeof canvas == "string") {
                let _ele = document.getElementById(canvas)
                if (_ele) {
                    _canvas = _ele as HTMLCanvasElement;
                }
            } else {
                _canvas = canvas;
            }
            if (!_canvas) {
                return;
            }

            type = this.fixType(type);
            if (/bmp/.test(type)) {
                let data = this.getImageData(this.scaleCanvas(_canvas, width, height));
                if (data) {
                    let strData = this.genBitmapImage(data);
                    this.saveFile(this.makeURL(strData, this.downloadMime), type.replace("image/", ""), fileName);
                }
            } else {
                _canvas = this.scaleCanvas(_canvas, width, height);

                let self = this;
                _canvas.toBlob(function (blob) {
                    let url = URL.createObjectURL(blob as any);
                    self.saveFile(url, type.replace("image/", ""), fileName);
                }, type, quality)
            }
        }
    }

    convertToImage(canvas: HTMLCanvasElement | string, width: number, height: number, type: string = "png") {
        let _canvas: HTMLCanvasElement = null!;
        if (this.support.canvas && this.support.dataURL) {
            if (typeof canvas == "string") {
                let _ele = document.getElementById(canvas)
                if (_ele) {
                    _canvas = _ele as HTMLCanvasElement;
                }
            } else {
                _canvas = canvas;
            }
            if (!_canvas) {
                return;
            }

            if (/bmp/.test(type)) {
                var data = this.getImageData(this.scaleCanvas(_canvas, width, height));
                var strData = this.genBitmapImage(data as ImageData);
                return this.genImage(this.makeURL(strData, 'image/bmp'));
            } else {
                var strData: string = this.getDataURL(_canvas, type, width, height);
                return this.genImage(strData);
            }
        }
    }

    private fileDownload(downloadUrl: string, type: string, fileName: string) {
        let aLink = document.createElement('a');
        aLink.style.display = 'none';
        aLink.href = downloadUrl;
        aLink.download = fileName + "." + type;
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
    }

    saveAsPNG(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.savaAsImage(canvas,width,height,"png","defaultpng");
    }

    saveAsJPEG(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.savaAsImage(canvas,width,height,"jpeg","defaultjpg");
    }

    saveAsGIF(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.savaAsImage(canvas,width,height,"gif","defaultgif");
    }

    saveAsBMP(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.savaAsImage(canvas,width,height,"bmp","defaultbmp");
    }

    convertToPNG(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.convertToImage(canvas,width,height,"png");
    }

    convertToJPEG(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.convertToImage(canvas,width,height,"jpeg");
    }

    convertToGIF(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.convertToImage(canvas,width,height,"gif");
    }

    convertToBMP(canvas : HTMLCanvasElement , width : number , height : number ){
        return this.convertToImage(canvas,width,height,"bmp");
    }
}