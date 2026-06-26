import os
import math
from PIL import Image, ImageDraw

ACCENT = (14, 159, 110, 255)
WHITE = (255, 255, 255, 255)
HERE = os.path.dirname(__file__)
ASSETS = os.path.join(HERE, "..", "assets")
SS = 4


def droplet(d, cx, cy, r):
    pts = [(cx, cy - r * 2.05)]
    start, end = math.radians(-52), math.radians(232)
    steps = 60
    for i in range(steps + 1):
        a = start + (end - start) * i / steps
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    d.polygon(pts, fill=WHITE)


def render(size, r_frac, cy_frac):
    big = size * SS
    img = Image.new("RGBA", (big, big), ACCENT)
    d = ImageDraw.Draw(img)
    droplet(d, big / 2, big * cy_frac, big * r_frac)
    return img.resize((size, size), Image.LANCZOS)


os.makedirs(ASSETS, exist_ok=True)
render(1024, 0.16, 0.56).save(os.path.join(ASSETS, "icon.png"))
render(2732, 0.06, 0.52).save(os.path.join(ASSETS, "splash.png"))
print("wrote assets/icon.png and assets/splash.png")
