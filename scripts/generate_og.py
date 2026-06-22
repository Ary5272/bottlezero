import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
PUB = os.path.join(HERE, "..", "public")
ICONS = os.path.join(PUB, "icons")
W, H = 1200, 630


def font(names, size):
    for n in names:
        for p in (n, os.path.join("C:/Windows/Fonts", n)):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


bold = font(["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"], 100)
semi = font(["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"], 42)
small = font(["segoeuisb.ttf", "segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"], 32)

top, bot = (247, 250, 248), (220, 241, 231)
ink, muted, accent = (21, 24, 26), (88, 102, 94), (14, 159, 110)

bg = Image.new("RGB", (W, H), top)
d = ImageDraw.Draw(bg)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))

try:
    icon = Image.open(os.path.join(ICONS, "icon-512.png")).convert("RGBA").resize((184, 184), Image.LANCZOS)
    bg.paste(icon, ((W - 184) // 2, 116), icon)
except Exception:
    pass


def center(y, text, fnt, fill):
    w = d.textlength(text, font=fnt)
    d.text(((W - w) / 2, y), text, font=fnt, fill=fill)


center(330, "BottleZero", bold, ink)
center(460, "Track bottles saved. Cut single-use plastic.", semi, muted)
center(536, "bottlezero.vercel.app", small, accent)

bg.save(os.path.join(PUB, "og.png"))
print("wrote public/og.png")
