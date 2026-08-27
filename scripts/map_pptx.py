"""Map each image in AirBridge by CDC - V7.pptx to its slide + slide text.

Helps identify which images show the AirBridge® tracked (self-propelled) unit,
vs ordinary ropeways / 3D renders, by correlating with slide context.
"""
import os
import re
import zipfile

PPTX = r"D:\Airbridge_NEW_DeepSeek\Materials from Galiya\AirBridge by CDC - V7.pptx"

z = zipfile.ZipFile(PPTX)
names = z.namelist()

slide_xmls = sorted(
    [n for n in names if re.match(r"ppt/slides/slide\d+\.xml$", n)],
    key=lambda n: int(re.search(r"slide(\d+)", n).group(1)),
)


def rel_to_media(rels_path):
    if rels_path not in names:
        return {}
    rels = z.read(rels_path).decode("utf-8", "ignore")
    mapping = {}
    for m in re.finditer(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', rels):
        rid, target = m.group(1), m.group(2)
        if "media" in target:
            mapping[rid] = os.path.basename(target)
    return mapping


for sp in slide_xmls:
    num = int(re.search(r"slide(\d+)", sp).group(1))
    xml = z.read(sp).decode("utf-8", "ignore")

    # slide text
    texts = re.findall(r"<a:t>(.*?)</a:t>", xml, flags=re.S)
    text = " | ".join(t.strip() for t in texts if t.strip())

    # image references (r:embed or r:link)
    embeds = re.findall(r'r:embed="(rId\d+)"', xml)
    links = re.findall(r'r:link="(rId\d+)"', xml)

    rels_path = f"ppt/slides/_rels/slide{num}.xml.rels"
    mapping = rel_to_media(rels_path)

    media = []
    for rid in embeds + links:
        if rid in mapping:
            media.append(mapping[rid])

    print(f"\n===== SLIDE {num} =====")
    print("TEXT:", text[:600])
    print("MEDIA:", ", ".join(sorted(set(media))) if media else "(none)")
