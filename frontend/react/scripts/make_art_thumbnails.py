"""
Makes the small thumbnails the Art grid shows (public/images/art/thumbs/*.webp).

The grid only ever shows a piece at most ~600x350 px, so loading the full-size
originals there made the page decode ~25 megapixels of images and lag while
scrolling. The originals are still used when a piece is opened full size.

Run it again after adding or changing a piece (needs Pillow: pip install pillow):
    python scripts/make_art_thumbnails.py
"""

from pathlib import Path

from PIL import Image, ImageOps

ART_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "art"
THUMB_DIR = ART_DIR / "thumbs"
# Twice the largest size a piece is shown in the grid, so it stays sharp on
# high-density (retina) screens.
MAX_SIZE = (1200, 720)

THUMB_DIR.mkdir(exist_ok=True)
for source in sorted(ART_DIR.glob("*.jpg")):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail(MAX_SIZE, Image.LANCZOS)
        target = THUMB_DIR / f"{source.stem}.webp"
        image.save(target, "WEBP", quality=82, method=6)
    print(f"{target.name}: {image.size[0]}x{image.size[1]}, {target.stat().st_size // 1024} KB")
