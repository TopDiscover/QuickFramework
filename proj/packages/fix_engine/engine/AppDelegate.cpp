/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.
 
 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "AppDelegate.h"

#include "cocos2d.h"

#include "cocos/scripting/js-bindings/manual/jsb_module_register.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/event/EventDispatcher.h"
#include "cocos/scripting/js-bindings/manual/jsb_classtype.hpp"

USING_NS_CC;

AppDelegate::AppDelegate(int width, int height) : Application("Cocos Game", width, height)
{
}

AppDelegate::~AppDelegate()
{
}

bool AppDelegate::applicationDidFinishLaunching()
{
    se::ScriptEngine *se = se::ScriptEngine::getInstance();
    
    jsb_set_xxtea_key("");
    jsb_init_file_operation_delegate();
    
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
    // Enable debugger here
    jsb_enable_debugger("0.0.0.0", 6086, false);
#endif
    
    se->setExceptionCallback([](const char *location, const char *message, const char *stack) {
        // Send exception information to server like Tencent Bugly.
        cocos2d::log("\nUncaught Exception:\n - location :  %s\n - msg : %s\n - detail : \n      %s\n", location, message, stack);
    });
    
    jsb_register_all_modules();
    
    se->start();
    
    // 首先必须要设置缓存下载载的搜索路径，不然，会首先加载到原的代码，而不是最新缓存的代码
    auto cache = FileUtils::getInstance()->getWritablePath() + "caches/";
    auto searchPath = FileUtils::getInstance()->getSearchPaths();
	auto it = std::find_if(searchPath.begin(), searchPath.end(), [=](const std::string& value) {
		if (value == cache) {
			return true;
		}
		return false;
	});
	if (it == searchPath.end()) {
		FileUtils::getInstance()->addSearchPath(cache, true);
	}
    
    se::AutoHandleScope hs;
    jsb_run_script("jsb-adapter/jsb-builtin.js");
    jsb_run_script("main.js");
    
    se->addAfterCleanupHook([]() {
        JSBClassType::destroy();
    });
    
    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::onPause()
{
    EventDispatcher::dispatchOnPauseEvent();
}

// this function will be called when the app is active again
void AppDelegate::onResume()
{
    EventDispatcher::dispatchOnResumeEvent();
}
