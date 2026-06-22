import math
import os
from PIL import Image, ImageDraw

ACCENT = (14, 159, 110, 255)
WHITE = (255, 255, 255, 255)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
SS = 4


def droplet(draw, size, scale=1.0):
    cx = size / 2
    by = size * 0.60
    r = size * 0.225 * scale
    tip = (cx, size * (0.60 - 0.46 * scale))
    pts = [tip]
    start, end = math.radians(-52), math.radians(232)
    steps = 60
    for i in range(steps + 1):
        a = start + (end - start) * i / steps
        pts.append((cx + r * math.cos(a), by + r * math.sin(a)))
    draw.polygon(pts, fill=WHITE)


def make(size, rounded=True, scale=1.0):
    big = size * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * 0.22), fill=ACCENT)
    else:
        d.rectangle((0, 0, big, big), fill=ACCENT)
    droplet(d, big, scale)
    return img.resize((size, size), Image.LANCZOS)


def save(img, name):
    img.save(os.path.join(OUT, name))
    print("wrote", name)


os.makedirs(OUT, exist_ok=True)
save(make(192), "icon-192.png")
save(make(512), "icon-512.png")
save(make(512, rounded=False, scale=0.78), "icon-512-maskable.png")
save(make(180, rounded=False), "apple-touch-icon.png")
