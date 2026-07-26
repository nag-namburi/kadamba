#!/usr/bin/env python3
"""Generate the PWA icons into icons/.

Draws the app glyph — a gold sun (ring + center dot) on deep indigo —
at 4x supersampling for smooth edges, then downscales.

    python3 generate-icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent / "icons"
BG = (16, 18, 31, 255)        # --bg #10121f
GOLD = (217, 180, 91, 255)    # --gold #d9b45b
SS = 4                        # supersampling factor


def draw_sun(draw, cx, cy, glyph_r):
    """Draw the sun glyph: outer ring + filled center dot."""
    ring_w = max(2, int(glyph_r * 0.22))
    dot_r = glyph_r * 0.30
    bbox = [cx - glyph_r + ring_w / 2, cy - glyph_r + ring_w / 2,
            cx + glyph_r - ring_w / 2, cy + glyph_r - ring_w / 2]
    draw.ellipse(bbox, outline=GOLD, width=ring_w)
    draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=GOLD)


def make_icon(size, maskable=False):
    canvas = size * SS
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if maskable:
        # Full-bleed background; glyph smaller to respect the safe zone.
        d.rectangle([0, 0, canvas, canvas], fill=BG)
        glyph_r = canvas * 0.20
    else:
        # Rounded-square background with transparent corners.
        d.rounded_rectangle([0, 0, canvas - 1, canvas - 1],
                            radius=canvas * 0.22, fill=BG)
        glyph_r = canvas * 0.27

    draw_sun(d, canvas / 2, canvas / 2, glyph_r)
    return img.resize((size, size), Image.LANCZOS)


def main():
    ROOT.mkdir(exist_ok=True)
    outputs = [
        ("icon-192.png", make_icon(192)),
        ("icon-512.png", make_icon(512)),
        ("icon-maskable-512.png", make_icon(512, maskable=True)),
        ("apple-touch-icon.png", make_icon(180, maskable=True)),
    ]
    for name, img in outputs:
        img.save(ROOT / name, "PNG")
        print(f"icons/{name} {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()
