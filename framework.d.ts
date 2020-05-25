
declare module cc {
	export function dump(...args);
	//相当于console.info //引擎已经设置为只读，没办法在取一个一样的名字
	export function message(...args);

	/**@description 相当于console.time */
	export function time(...args);

	/**@description 相当于console.timeEnd */
	export function timeEnd(...args);

	export interface Node {
		/**@description 用户自定义数据 */
		userData: any;
	}

	/**@description 通过预置体路径创建节点 
 	 * @param config 配置信息
 	 * @param config.url 预置体路径
	 * @param config.view 预置视图资源管理器，继承自UIView
	 * @param config.completeCallback 创建完成回调 
	 * @example 
	 * cc.createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,completeCallback:(node)=>{
	 *     if ( node ){
	 *         // to do 
	 *     }
	 * }});
	 */
	export function createPrefab(config: { url: string, view: any, completeCallback: (node: cc.Node) => void });

	export interface Sprite {
        /**
		 * @description 从网络加载图片，推荐使用第二种方式
		 * @param url 网络地址，如 : http://tools.itharbors.com/res/logo.png
		 * @param completeCallback 加载完成回调
		 * @param defaultSpriteFrame 加载图片失败后，使用的默认图片,当传入string时，会动态加载该默认图片
		 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
		 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
		 * @example
		 * 示例1：
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("avatar_default_0.png"), view : this,completeCallback : (data)=>{
		 * 		if ( data ) { do something }
		 * }});
		 * 
		 * 示例2:
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("avatar_default_0.png"), view : this});
		 * 
		 * 示例3：
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", view : this});
		 * }
		 */
		loadRemoteImage(config: { url: string, view: any, completeCallback?: (data: cc.SpriteFrame) => void, defaultSpriteFrame?: string, isNeedCache?: boolean , retain? : boolean});

        /**
		 * @description 加载本地图片
		 * @param url 图片路径 {urls:string[],key:string} urls 为纹理名如果有此纹理会打包成多张，此时需要传入所有纹理的地址，key指纹理中名字
		 * @param view 所属视图，UIView的子类
		 * @param completeCallback 完成回调
		 * @example
		 * 示例1：
		 * sprite.getComponent(cc.Sprite).loadImage({url:{urls:["plist/fish_30","plist/fish_30_1","plist/fish_30_2"],key:"fishMove_030_28"},view:this});
		 * 示例2：
		 * sprite.getComponent(cc.Sprite).loadImage({url:"hall/a",view:this});
		 */
		loadImage(config: { url: string | { urls: string[], key: string }, view: any, completeCallback?: (data: SpriteFrame) => void });
	}

	export interface Button {
        /**
		 * @description 加载按钮
		 * @example
		 * 示例1：
		 * let button = cc.find("button",this.node);
		 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/a",view:this});
		 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/b",pressedSprite : "hall/c",view:this});
		 * 示例2：
		 * button.getComponent(cc.Button).loadButton({view:this,
		 *	normalSprite:{urls:["gameComm/chipsetting/chipInfo"],key:"chip0_1"},
		 *	pressedSprite:{urls:["gameComm/chipsetting/chipInfo"],key:"chip0_2"},
		 *	hoverSprite : {urls:["gameComm/chipsetting/chipInfo"],key:"chip1_1"},
		 *	disabledSprite : {urls:["gameComm/chipsetting/chipInfo"],key:"chip1_2"},
		 * }); 
		 * completeCallback.type => ButtonSpriteFrameType
		 */
		loadButton(config: {
			normalSprite?: string | { urls: string[], key: string },
			view: any,//UIView的子类
			pressedSprite?: string | { urls: string[], key: string },
			hoverSprite?: string | { urls: string[], key: string },
			disabledSprite?: string | { urls: string[], key: string },
			completeCallback?: (type: string, spriteFrame: SpriteFrame) => void
		});
	}

	export interface Label {
		/**
		  * @description 加载字体
		  * @example
		  * let content = cc.find("content",this.node); 
		  * content.getComponent(cc.Label).loadFont({font:"font/DFYUANW7-GB2312",view:this});
		  */
		loadFont(config: { font: string, view: any, completeCallback?: (font: Font) => void });

		/**@description 强制label在当前帧进行绘制 */
		forceDoLayout();
	}


	/**
 	 * @description 强制节点在当前帧进行一次布局 
 	 * @example
	 * cc.updateAlignment(this.node);
	 * */
	export function updateAlignment(node: cc.Node): void;

	export interface ParticleSystem {

		/**
 		 * @description 加载特效文件 view 为null时，加载之前不会释
		 * @example
		 * let node = new cc.Node();
		 * let par = node.addComponent(cc.ParticleSystem);
		 * par.loadFile({url:GAME_RES( "res/action/DDZ_win_lizi" ),view:null});
		 * this.node.addChild(node);
		 */
		loadFile(config: { url: string, view: any, completeCallback?: (file: ParticleAsset) => void });

	}
}

declare namespace sp {
	export interface Skeleton {
        /**
 		 * @description 扩展方法
 		 * @param remotePath 远程资源路径
 		 * @param name 远程Spine文件名，不再后缀
 		 * @param completeCallback 完成回调
		 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
		 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
 		 * @example
 		 * var skeleton = node.addComponent(sp.Skeleton);
         *
         * let path = "https://bc-test1.oss-cn-shenzhen.aliyuncs.com/image/action";
         * let name = "nnoh_v4";
         * skeleton.loadRemoteSkeleton({view : this , path : path, name : name, completeCallback : (data:sp.SkeletonData)=>{
         *    if (data) {
         *        skeleton.animation = 'loop';
         *        skeleton.premultipliedAlpha = false;
         *    }
         * }});
         */
		loadRemoteSkeleton(config: { view: any, path: string, name: string, completeCallback: (data: sp.SkeletonData) => void, isNeedCache?: boolean,retain? :boolean });

		/**
		 * @description 加载动画
		 * @example
		 * action.loadSkeleton({url:"hall/vip/vipAction/vip_10",view:this,completeCallback:(data)=>{
		 *	if ( data ){
		 *		action.animation = "loop";
		 *		action.loop = true;
		 *		action.premultipliedAlpha = false;
		 *	}
		 * }});
		 */
		loadSkeleton(config: { url: string, view: any, completeCallback: (data: sp.SkeletonData) => void });
	}
}

declare function require(any);

/**
		 * @description 发事件 参考framework/extentions/extentions dispatch 方法
		 * @param name 
		 * @param data 
		 */
declare function dispatch(name: string, data?: any);

declare interface Date {
	/**
	 * @description 格式当前时间 
	 * @example 
	 * let now = new Date();
	 * let str = now.format("yyyy:MM:dd hh:mm:ss"); //2019:11:07 10:19:51
	 * str = now.format("yyyy/MM/dd");//2019/11/07
	 * str = now.format("hh:mm:ss");//10:19:51
	 * */
	format(format: string): string;
}

declare interface DateConstructor {
	/**
	 * @description 返回当前时间的秒数
	 * @example 
	 * Date.timeNow()
	 *  */
	timeNow(): number;
	/**
	 * @description 返回当前时间的毫秒数 
	 * @example 
	 * Date.timeNowMillisecons()
	 * */
	timeNowMillisecons(): number;
}

declare interface StringConstructor {
	/**
	 * @description 格式化字符串
	 * @example
	 * String.format("{0}-->{1}-->{2}","one","two","three")
	 * => "one-->two-->three"
	 * */
	format(...args): string;
}

declare function md5(data: any): any;