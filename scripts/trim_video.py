"""Trim the AirBridge motion video to skip the static intro.

Start time (5.0s) validated via ffmpeg scene detection: no scene change between
0.43s and 5.01s (static pause), then motion begins ~5.0s (people enter the cabin).
"""
import os
import subprocess

SRC = r"D:\Airbridge_NEW_DeepSeek\Materials from Galiya\WhatsApp Video 2026-08-14 at 23.37.53 (1).mp4"
DST = r"D:\Airbridge_NEW_DeepSeek\assets\videos\airbridge-motion-galiya.mp4"
START = 5.0

tmp = DST + ".tmp.mp4"
cmd = [
    "ffmpeg", "-y", "-ss", str(START), "-i", SRC,
    "-c:v", "libx264", "-preset", "fast", "-crf", "20",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    tmp,
]
subprocess.run(cmd, check=True)
os.replace(tmp, DST)
print(f"Trimmed -> {DST} (start={START}s)")
