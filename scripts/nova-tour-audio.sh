#!/bin/bash
# Voice Nova's tour narration with local Voicebox and write public/nova/tour/<id>.mp3.
# The script for each clip is the stop's `line` in content/woven.ts — the caption and the audio
# are the same words by construction. Rerun after changing any line.
#
# Usage: scripts/nova-tour-audio.sh [stop-id ...]     (no ids = every stop)
# Voice: profile Nova-Video, Nova's locked public voice (social_agent/skills/animate/characters/nova.md).
# Voicebox plays each generation aloud as it makes it. Same /generate + /history flow as
# social_agent/skills/animate/voiceover.sh; never poll /generate/<id>/status.
set -euo pipefail
cd "$(dirname "$0")/.."
VB=http://127.0.0.1:17493
PROFILE=Nova-Video
OUT=public/nova/tour
mkdir -p "$OUT"
"$HOME/.local/bin/voicebox-ensure" >/dev/null || { echo "BLOCKED: Voicebox unhealthy — voicebox-ensure --restart" >&2; exit 1; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

python3 - "$@" > "$TMP/stops" <<'PY'
import re, sys
src = open("content/woven.ts").read()
tour = src[src.index("export const TOUR"):]
stops = re.findall(r'id: "([^"]+)".*?line: "((?:[^"\\]|\\.)*)"', tour, re.S)
want = set(sys.argv[1:])
for i, line in stops:
    if not want or i in want: print(f"{i}\t{line}")
PY

while IFS=$'\t' read -r id line; do
  echo "→ $id"
  GEN=$(python3 - "$line" <<PY
import json, sys, urllib.request
vb, name = "$VB", "$PROFILE"
p = next((p for p in json.load(urllib.request.urlopen(vb + "/profiles")) if p["name"] == name), None)
if not p: sys.exit(f"BLOCKED: Voicebox profile {name!r} not found")
body = {"profile_id": p["id"], "text": sys.argv[1], "language": "en", "engine": p.get("default_engine") or "kokoro"}
req = urllib.request.Request(vb + "/generate", json.dumps(body).encode(), {"Content-Type": "application/json"})
print(json.load(urllib.request.urlopen(req, timeout=60))["id"])
PY
)
  S=""
  for _ in $(seq 1 600); do
    S=$(curl -s "$VB/history/$GEN" | python3 -c 'import json,sys;print(json.load(sys.stdin)["status"])')
    [ "$S" = completed ] && break
    [ "$S" = failed ] && { echo "BLOCKED: generation $GEN failed" >&2; exit 1; }
    sleep 1
  done
  [ "$S" = completed ] || { echo "BLOCKED: generation $GEN still '$S' after 600s" >&2; exit 1; }
  curl -s -m 60 "$VB/audio/$GEN" -o "$TMP/$id.wav"
  # trim the engine's leading/trailing silence, then a small web-sized mono mp3
  ffmpeg -v error -y -i "$TMP/$id.wav" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse,loudnorm=I=-16:TP=-1.5" -ac 1 -ar 44100 -c:a libmp3lame -b:a 96k "$OUT/$id.mp3"
done < "$TMP/stops"
ls -la "$OUT"
