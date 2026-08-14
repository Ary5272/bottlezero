import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
PUB = os.path.join(HERE, "..", "public")
ICONS = os.path.join(PUB, "icons")
STORE = os.path.join(HERE, "..", "store")
os.makedirs(STORE, exist_ok=True)
W, H = 1024, 500


def font(names, size):
    for n in names:
        for p in (n, os.path.join("C:/Windows/Fonts", n)):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


bold = font(["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"], 72)
semi = font(["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"], 30)

top, bot = (16, 168, 115), (10, 127, 88)
white = (255, 255, 255)

bg = Image.new("RGB", (W, H), top)
d = ImageDraw.Draw(bg)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))

try:
    icon = Image.open(os.path.join(ICONS, "icon-512.png")).convert("RGBA").resize((140, 140), Image.LANCZOS)
    bg.paste(icon, (90, 180), icon)
except Exception:
    pass

d.text((260, 168), "BottleZero", font=bold, fill=white)
d.text((262, 258), "Track bottles saved.", font=semi, fill=white)
d.text((262, 300), "Cut single-use plastic waste.", font=semi, fill=white)

bg.save(os.path.join(STORE, "feature-graphic.png"))
print("wrote store/feature-graphic.png", bg.size)
