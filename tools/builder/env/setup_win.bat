@echo off
set COCOS_CREATOR_ROOT="D:/CocosDashboard_1.0.14/resources/.editors/Creator/2.4.3"

set SETX=setx

echo.
echo config:
echo.
echo COCOS_CREATOR_ROOT = "%COCOS_CREATOR_ROOT%"
echo.

%SETX% COCOS_CREATOR_ROOT %COCOS_CREATOR_ROOT%

echo.

pause