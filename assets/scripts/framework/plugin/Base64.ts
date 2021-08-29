class Base64 {
    revLookup = []
    lookup = []

    constructor() {
        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        for (var i = 0, len = code.length; i < len; ++i) {
            this.lookup[i] = code[i]
            this.revLookup[code.charCodeAt(i)] = i
        }

        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        this['-'.charCodeAt(0)] = 62
        this['_'.charCodeAt(0)] = 63
    }

    public toByteArray(b64: string): Uint8Array {
        let tmp: number = 0
        let lens = this.getLens(b64)
        let validLen = lens[0]
        let placeHoldersLen = lens[1]

        let arr: Uint8Array = new Uint8Array(this._byteLength(b64, validLen, placeHoldersLen))

        let curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        let len = placeHoldersLen > 0 ? validLen - 4 : validLen

        let i: number = 0
        for (i = 0; i < len; i += 4) {
            tmp = (this.revLookup[b64.charCodeAt(i)] << 18)
                | (this.revLookup[b64.charCodeAt(i + 1)] << 12)
                | (this.revLookup[b64.charCodeAt(i + 2)] << 6)
                | this.revLookup[b64.charCodeAt(i + 3)]
            arr[curByte++] = (tmp >> 16) & 0xFF
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
            tmp = (
                this.revLookup[b64.charCodeAt(i)] << 2)
                | (this.revLookup[b64.charCodeAt(i + 1)] >> 4)
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
            tmp = (
                this.revLookup[b64.charCodeAt(i)] << 10)
                | (this.revLookup[b64.charCodeAt(i + 1)] << 4)
                | (this.revLookup[b64.charCodeAt(i + 2)] >> 2)
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        return arr
    }

    public fromByteArray(uint8: Uint8Array) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(this.encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1]
            parts.push(
                this.lookup[tmp >> 2] +
                this.lookup[(tmp << 4) & 0x3F] +
                '=='
            )
        } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + uint8[len - 1]
            parts.push(
                this.lookup[tmp >> 10] +
                this.lookup[(tmp >> 4) & 0x3F] +
                this.lookup[(tmp << 2) & 0x3F] +
                '='
            )
        }

        return parts.join('')
    }


    public byteLength(b64) {
        var lens = this.getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    private _byteLength(b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }


    private getLens(b64: string) {
        let len = b64.length
        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len
        let placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)
        return [validLen, placeHoldersLen]
    }


    private encodeChunk(uint8: Uint8Array, start: number, end: number): any {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
            tmp =
                ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF)
            output.push(this.tripletToBase64(tmp))
        }
        return output.join('')
    }

    private tripletToBase64(num) {
        return this.lookup[num >> 18 & 0x3F] + this.lookup[num >> 12 & 0x3F] + this.lookup[num >> 6 & 0x3F] + this.lookup[num & 0x3F]
    }


}
export const base64 = new Base64