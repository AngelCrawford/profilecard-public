#!/bin/bash
if [ "$1" ]
  then version="$1"
else
  read -p "$(echo -e $Red"Enter Tag Version: "$Color_Off)" version
fi

rm static/version.txt
rm static/buildDate.txt
echo "$version" >> static/version.txt
echo "`date`" >> static/buildDate.txt
