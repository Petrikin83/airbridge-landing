"""Prepare authentic AirBridge® images: flatten RGBA onto white, copy to assets/images/."""
import os
import shutil

from PIL import Image

EXTRACT = r"D:\Airbridge_NEW_DeepSeek\scripts\_extract"
IMG = r"D:\Airbridge_NEW_DeepSeek\assets\images"

# (source_filename, target_filename)
MAPPING = [
    # Passenger Ropeways — tracked module + passenger cabins
    ("pptx_95ddd6035831.jpg", "airbridge-passenger-1.jpg"),  # image10 boarding
    ("pptx_cf6b8926ba43.jpg", "airbridge-passenger-2.jpg"),  # image9  passenger ropeways
    ("pptx_605939245ba7.jpg", "airbridge-passenger-3.jpg"),  # image4  self-propelled mechanism
    # Material Ropeways — module + cargo containers/skips
    ("pptx_cd4332da8157.png", "airbridge-material-1.png"),   # image11
    ("pptx_7f06ba539284.png", "airbridge-material-2.png"),   # image12
    ("pptx_3da109031287.png", "airbridge-material-3.png"),   # image13
    ("pptx_1ca161038ee3.jpg", "airbridge-material-4.jpg"),   # image14 operational
    # Cable Cranes — module + heavy machinery
    ("pptx_859ae034d509.png", "airbridge-cable-1.png"),      # image7 schematic (RGBA -> white)
    ("pptx_1e6e2601649c.jpg", "airbridge-cable-2.jpg"),      # image8  cable crane
    ("pptx_2df31302bfc6.jpg", "airbridge-cable-3.jpg"),      # image18 safety/installation
    # Additional authentic frames (urban, environmental, field)
    ("pptx_8fc04245f992.jpg", "airbridge-passenger-4.jpg"), # image6  certified urban mobility
    ("pptx_88280ee325a7.jpg", "airbridge-cable-4.jpg"),     # image15 environmental/installation
    ("pptx_fbf6242b1516.jpg", "airbridge-cable-5.jpg"),     # image17 field operation
]


def main():
    for src_name, dst_name in MAPPING:
        src = os.path.join(EXTRACT, src_name)
        dst = os.path.join(IMG, dst_name)
        im = Image.open(src)
        if im.mode in ("RGBA", "LA", "P") and dst_name.endswith(".png"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            bg.save(dst, "PNG")
            print(f"FLATTEN {dst_name} ({bg.size[0]}x{bg.size[1]})")
        else:
            shutil.copyfile(src, dst)
            print(f"COPY    {dst_name} ({im.size[0]}x{im.size[1]})")


if __name__ == "__main__":
    main()
