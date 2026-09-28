#!/usr/bin/env bash
# Cuts web loops from the client's 1080p YouTube masters in assets-raw/youtube.
# Swap in the 4K SharePoint originals later by pointing the sources at them
# (keep the crop= values in step with their letterboxing).
#
# Encoding is chosen for smooth playback everywhere, not just small files:
#   - H.264 High profile, yuv420p: hardware-decoded on every browser/phone
#   - -g 60 / keyint 2s, no scene-cut keyframes: seamless loops, cheap seeking
#   - +faststart: moov atom first, playback starts while downloading
#   - CRF 23–24 at "slow": visually clean without bloating
#   - mobile hero is a PORTRAIT crop at full source height, so phones get a
#     sharp picture instead of a 960px frame stretched to fill a tall screen
#   - posters as WebP (smaller than JPEG, supported by every current browser)
set -e
cd "$(dirname "$0")/.."
FF=node_modules/ffmpeg-static/ffmpeg.exe
Y=assets-raw/youtube
O=public/video
REEL="$Y/2024 Website Main [bDZVGZLOdZA].mp4"
CROP="crop=1920:972:0:54"
X264="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -g 60 -keyint_min 60 -sc_threshold 0 -movflags +faststart -an"

# ── Hero montage: coast skim, stadium, boat, canola rip, lighthouse orbit ──
segs=( "0.5 7.5" "47.5 51.5" "52 56" "58.5 63.5" "66 71.5" )
fc=""; n=0
for s in "${segs[@]}"; do set -- $s; fc+="[0:v]trim=$1:$2,setpts=PTS-STARTPTS,$CROP[v$n];"; n=$((n+1)); done
fc+="$(for i in $(seq 0 $((n-1))); do printf "[v$i]"; done)concat=n=$n:v=1:a=0,fps=30[c];[c]split=4[a][b][m][s];"
# Desktop ladder 1920×972 / 1280×648 / 960×486 — heroVideo() in ui.tsx
# measures how fast the file actually downloads while the loader is up and
# settles on the rung the connection can sustain; mobile = centred 9:16
# portrait crop at full height (548×972).
fc+="[a]scale=1920:-2[hd];[m]scale=1280:-2[md];[s]scale=960:-2[sd];[b]crop=548:972:(iw-548)/2:0[mob]"
"$FF" -loglevel error -y -i "$REEL" -filter_complex "$fc" \
  -map "[hd]" $X264 -crf 23 -level 4.1 -maxrate 7M -bufsize 14M $O/hero-1080.mp4 \
  -map "[md]" $X264 -crf 24 -level 4.0 -maxrate 2.8M -bufsize 5.6M $O/hero-720.mp4 \
  -map "[sd]" $X264 -crf 25 -level 4.0 -maxrate 1.3M -bufsize 2.6M $O/hero-540.mp4 \
  -map "[mob]" $X264 -crf 24 -level 3.1 -maxrate 2.2M -bufsize 4.4M $O/hero-mobile.mp4
# Posters = frame 0 of the encoded files, so poster → first frame never jumps.
"$FF" -loglevel error -y -i $O/hero-1080.mp4 -frames:v 1 -c:v libwebp -quality 82 $O/hero-poster.webp
"$FF" -loglevel error -y -i $O/hero-mobile.mp4 -frames:v 1 -c:v libwebp -quality 82 $O/hero-poster-mobile.webp

# ── Loops: 1280 wide (was 960 — tall reel tiles no longer upscale) ──
clip() { # name src start dur [crop]
  local C="${5:-$CROP}"
  "$FF" -loglevel error -y -ss "$3" -t "$4" -i "$2" -vf "$C,scale=1280:-2,fps=30" $X264 -crf 24 -level 4.0 -maxrate 4M -bufsize 8M "$O/$1.mp4"
  "$FF" -loglevel error -y -ss "$3" -i "$2" -frames:v 1 -vf "$C,scale=1280:-2" -c:v libwebp -quality 80 "$O/$1.webp"
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
