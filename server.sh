#!/bin/bash
# Colors
ESC_SEQ="\x1b["
COL_RESET=$ESC_SEQ"39;49;00m"
COL_RED=$ESC_SEQ"31;01m"
COL_GREEN=$ESC_SEQ"32;01m"
COL_YELLOW=$ESC_SEQ"33;01m"


echo -e "$COL_RED 
    {on|stop|status|so|confirm|screen}
	$COL_RESET"

if [ "$1" = "on" ] 
    then 
        screen -dmS rtmp ./start.sh
        echo -e "Info: $COL_GREEN SinusBot fatto Reload $COL_RESET"
    fi
if [ "$1" = "stop" ] 
    then 
        pkill -f rtmp
        echo -e "Info: $COL_GREEN stop OFF $COL_RESET"
    fi	
if [ "$1" = "so" ] 
    then 
        screen -r rtmp
        echo -e "Info: $COL_GREEN On Bot $COL_RESET"
    fi	
