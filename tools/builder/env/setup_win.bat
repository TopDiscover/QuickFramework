@echo off
rem {==Creator 根目录
set COCOS_CREATOR_ROOT=%~dp0
rem ==Creator 根据目录}
set SETX=setx

echo.
echo config:
echo.
echo COCOS_CREATOR_ROOT = "%COCOS_CREATOR_ROOT%"
echo.

%SETX% COCOS_CREATOR_ROOT %COCOS_CREATOR_ROOT%

echo.

pause