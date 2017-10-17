#!/bin/bash

read -p "Last release version: " lastVersion
read -p "Pending release version: " pendingVersion
echo "Changes between reslease ${lastVersion} and ${pendingVersion}:"
echo ""

git shortlog release/${lastVersion}..release/${pendingVersion} | grep -E -i -o "(API|FRONTEND|BINDOPOS)[-_]\d+" | tr "[:lower:]" "[:upper:]" | tr "_" "-" | sort | uniq
