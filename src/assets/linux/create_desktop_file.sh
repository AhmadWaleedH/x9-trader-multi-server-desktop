#!/bin/sh
set -e
WORKING_DIR=`pwd`
THIS_PATH=`readlink -f $0`
cd `dirname ${THIS_PATH}`
FULL_PATH=`pwd`
cd ${WORKING_DIR}
cat <<EOS > X9.desktop
[Desktop Entry]
Name=X9 Trader Multi-Server
Comment=X9 Trader Multi-Server Desktop application for Linux
Exec="${FULL_PATH}/x9-trader-multi-server-desktop" %U
Terminal=false
Type=Application
MimeType=x-scheme-handler/mattermost
Icon=${FULL_PATH}/app_icon.png
Categories=Network;InstantMessaging;
EOS
chmod +x X9.desktop
