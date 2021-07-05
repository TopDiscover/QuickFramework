@echo off
set COCOS_CREATOR_ROOT=%~dp0

set SETX=setx

echo.
echo config:
echo.
echo COCOS_CREATOR_ROOT = "%COCOS_CREATOR_ROOT%"
echo.

%SETX% COCOS_CREATOR_ROOT %COCOS_CREATOR_ROOT%

echo.

pause