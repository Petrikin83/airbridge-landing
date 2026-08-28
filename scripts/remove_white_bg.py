"""Remove the white background from the AirBridge module render.

Flood-fills from the image borders, turning the connected near-white background
transparent while preserving white/highlight parts INSIDE the module.
"""
from collections import deque

from PIL import Image

SRC = r"D:\Airbridge_NEW_DeepSeek\assets\images\cdc-airbridge-technology.jpeg"
DST = r"D:\Airbridge_NEW_DeepSeek\assets\images\airbridge-module-clean.png"
THRESH = 235  # near-white threshold (JPEG-safe)


def main():
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_white(p):
        return p[3] > 0 and p[0] >= THRESH and p[1] >= THRESH and p[2] >= THRESH

    visited = set()
    q = deque()

    # seed from all four borders
    for x in range(w):
        for y in (0, h - 1):
            if is_white(px[x, y]):
                visited.add((x, y))
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_white(px[x, y]) and (x, y) not in visited:
                visited.add((x, y))
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and is_white(px[nx, ny]):
                visited.add((nx, ny))
                q.append((nx, ny))

    for x, y in visited:
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)

    im.save(DST, "PNG")
    print(f"OK {DST} size={im.size} removed_white_bg_px={len(visited)}")


if __name__ == "__main__":
    main()
