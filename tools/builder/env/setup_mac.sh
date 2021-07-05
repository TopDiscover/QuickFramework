#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASENAME=`basename "$DIR"`

COCOS_CREATOR_ROOT="$DIR"

echo ""
echo "COCOS_CREATOR_ROOT = \"$COCOS_CREATOR_ROOT\""
echo ""

# set .bash_profile or .profile
echo "> Setup evn for shell:"$SHELL
ENVSTR="export COCOS_CREATOR_ROOT=\`cat ~/.COCOS_CREATOR_ROOT\`"
if [ "$SHELL" == "/bin/bash" ]; then
	PROFILE_NAME=~/.bash_profile
elif [ "$SHELL" == "/bin/sh" ]; then
	PROFILE_NAME=~/.profile
elif [ "$SHELL" == "/bin/zsh" ]; then
	PROFILE_NAME=~/.zshrc
elif [ "$SHELL" == "/bin/csh" ]; then
	PROFILE_NAME=~/.cshrc
	ENVSTR="set COCOS_CREATOR_ROOT=\`cat ~/.COCOS_CREATOR_ROOT\`"
else
	echo "Error, unknow shell!"
	exit -1
fi

sed -e '/COCOS_CREATOR_ROOT/d' $PROFILE_NAME | sed -e '/add by quick-cocos2d-x setup/d' > $PROFILE_NAME.tmp

DATE=`date "+DATE: %Y-%m-%d TIME: %H:%M:%S"`
echo "# add by quick-cocos2d-x setup, $DATE" >> $PROFILE_NAME.tmp
echo $ENVSTR >> $PROFILE_NAME.tmp

DATE=`date "+%Y-%m-%d-%H%M%S"`
# cp $PROFILE_NAME $PROFILE_NAME-$DATE.bak
cp $PROFILE_NAME.tmp $PROFILE_NAME
rm $PROFILE_NAME.tmp

echo "> $PROFILE_NAME updated."

echo "$COCOS_CREATOR_ROOT" > ~/.COCOS_CREATOR_ROOT
echo "> ~/.COCOS_CREATOR_ROOT updated."
echo ""
echo ""
echo ""

echo "done. Please restart shell to make COCOS_CREATOR_ROOT work"
echo ""