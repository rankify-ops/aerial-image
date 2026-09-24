#!/usr/bin/env bash
# Cuts web loops from the client's 1080p YouTube masters in assets-raw/youtube.
# Swap in the 4K SharePoint originals later by pointing SRC at them.
set -e
cd "$(dirname "$0")/.."
FF=node_modules/ffmpeg-static/ffmpeg.exe
Y=assets-raw/youtube
O=public/video
REEL="$Y/2024 Website Main [bDZVGZLOdZA].mp4"
enc="-c:v libx264 -preset slow -pix_fmt yuv420p -movflags +faststart -an"

# Hero montage: coast skim, stadium, boat, canola rip, lighthouse orbit.
segs=( "0.5 7.5" "47.5 51.5" "52 56" "58.5 63.5" "66 71.5" )
fc=""; n=0
for s in "${segs[@]}"; do set -- $s; fc+="[0:v]trim=$1:$2,setpts=PTS-STARTPTS,crop=1920:972:0:54[v$n];"; n=$((n+1)); done
fc+="$(for i in $(seq 0 $((n-1))); do printf "[v$i]"; done)concat=n=$n:v=1:a=0[c];[c]split[a][b];[a]scale=1920:-2[hd];[b]scale=960:-2[sd]"
"$FF" -loglevel error -y -i "$REEL" -filter_complex "$fc" -map "[hd]" $enc -crf 28 -r 30 $O/hero-1080.mp4 -map "[sd]" $enc -crf 28 -r 30 $O/hero-540.mp4
"$FF" -loglevel error -y -ss 2 -i "$REEL" -frames:v 1 -vf crop=1920:972:0:54,scale=1920:-2 -q:v 3 $O/hero-poster.jpg

clip() { # name src start dur [crop]
  local C="${5:-crop=1920:972:0:54}"
  "$FF" -loglevel error -y -ss "$3" -t "$4" -i "$2" -vf "$C,scale=960:-2,fps=30" $enc -crf 27 "$O/$1.mp4"
  "$FF" -loglevel error -y -ss "$3" -i "$2" -frames:v 1 -vf "$C,scale=960:-2" -q:v 4 "$O/$1.jpg"
}
# FPV reel tiles
clip fpv-coast "$REEL" 0.5 6
clip fpv-interior "$REEL" 10 6
clip fpv-bar "$REEL" 22 6
clip fpv-school "$REEL" 33 6
clip fpv-stadium "$REEL" 47.5 5
clip fpv-boat "$REEL" 52 5
clip fpv-canola "$REEL" 59 5.5
clip fpv-lighthouse "$REEL" 66 6
# Project previews
clip p-cbre-l8 "$Y/CBRE - 818 Bourke St - Level 8 [y08uG9t57uo].mp4" 4 6
clip p-cbre-l6 "$Y/CBRE   818 Bourke St   Level 6 (Suite 2) [l8oCeA8U-48].mp4" 60 6
clip p-flinders "$Y/452 Flinders St - Commercial Office Space Promo [H4qmCY8Zn8I].mp4" 44 6
clip p-portmelb "$Y/Port Melbourne Primary Promo [8m8P0btFU2c].mp4" 62 6
clip p-alpine "$Y/Alpine Hotel Warburton Promo [4PbgFEQxals].mp4" 71 6
clip p-wds "$Y/WDS Wurdi Youang [yanTU9G9Gus].mp4" 45 6
clip p-francis "$Y/Francis Winifred Promo [0e9DGg650N4].mp4" 27 6 crop=1920:896:0:92
ls -la $O
