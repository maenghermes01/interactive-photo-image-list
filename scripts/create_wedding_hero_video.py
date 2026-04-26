from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "shared" / "image" / "real-test-image"
OUT_DIR = ROOT / "shared" / "video"
FRAME_DIR = ROOT / ".tmp" / "hero-frames"

WIDTH = 720
HEIGHT = 1280
FPS = 24
SECONDS_PER_IMAGE = 2.0
CROSSFADE_SECONDS = 0.45

# Hand-picked from the contact sheet for a classic/romantic 9:16 wedding opener.
SELECTED_NUMBERS = [2, 8, 5, 11, 13, 3]


def load_selected_images() -> list[Image.Image]:
    files = sorted(SOURCE_DIR.glob("*.jpeg"))
    selected = []
    for number in SELECTED_NUMBERS:
        path = files[number - 1]
        image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        selected.append(image)
    return selected


def cover_resize(image: Image.Image, width: int, height: int, zoom: float, x_bias: float, y_bias: float) -> Image.Image:
    target_ratio = width / height
    source_ratio = image.width / image.height

    if source_ratio > target_ratio:
        resize_height = math.ceil(height * zoom)
        resize_width = math.ceil(resize_height * source_ratio)
    else:
        resize_width = math.ceil(width * zoom)
        resize_height = math.ceil(resize_width / source_ratio)

    resized = image.resize((resize_width, resize_height), Image.Resampling.LANCZOS)
    max_x = max(0, resize_width - width)
    max_y = max(0, resize_height - height)
    crop_x = int(max_x * x_bias)
    crop_y = int(max_y * y_bias)
    return resized.crop((crop_x, crop_y, crop_x + width, crop_y + height))


def add_wedding_treatment(frame: Image.Image) -> Image.Image:
    frame = frame.convert("RGBA")

    # soft warm overlay matching the invitation palette
    warmth = Image.new("RGBA", frame.size, (255, 224, 219, 24))
    frame = Image.alpha_composite(frame, warmth)

    # subtle top/bottom vignettes to keep overlaid text readable
    vignette = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    pix = vignette.load()
    for y in range(HEIGHT):
        top = max(0, 1 - y / 360)
        bottom = max(0, (y - (HEIGHT - 430)) / 430)
        alpha = int(82 * max(top, bottom))
        if alpha:
            for x in range(WIDTH):
                pix[x, y] = (58, 38, 30, alpha)
    frame = Image.alpha_composite(frame, vignette)

    # faint VividVows-like heart line in the background
    line = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(line)
    heart_color = (255, 232, 236, 82)
    draw.arc((72, 126, 386, 486), 194, 348, fill=heart_color, width=3)
    draw.arc((334, 126, 648, 486), 192, 346, fill=heart_color, width=3)
    draw.line((104, 340, 360, 590, 616, 340), fill=heart_color, width=3)
    line = line.filter(ImageFilter.GaussianBlur(0.35))
    frame = Image.alpha_composite(frame, line)

    return frame.convert("RGB")


def render_frames(images: list[Image.Image]) -> None:
    if FRAME_DIR.exists():
        shutil.rmtree(FRAME_DIR)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)

    frames_per_image = int(FPS * SECONDS_PER_IMAGE)
    crossfade_frames = int(FPS * CROSSFADE_SECONDS)
    total_frames = frames_per_image * len(images) - crossfade_frames * (len(images) - 1)

    # Precompute each still segment with slightly different crop motion.
    segments: list[list[Image.Image]] = []
    for idx, image in enumerate(images):
        segment = []
        for f in range(frames_per_image):
            t = f / max(1, frames_per_image - 1)
            zoom = 1.04 + t * 0.08
            # Alternate horizontal/vertical drift so the video feels edited, not static.
            if idx % 3 == 0:
                x_bias = 0.42 + 0.12 * t
                y_bias = 0.45
            elif idx % 3 == 1:
                x_bias = 0.5
                y_bias = 0.38 + 0.14 * t
            else:
                x_bias = 0.58 - 0.14 * t
                y_bias = 0.48
            segment.append(add_wedding_treatment(cover_resize(image, WIDTH, HEIGHT, zoom, x_bias, y_bias)))
        segments.append(segment)

    output_frames: list[Image.Image] = []
    for idx, segment in enumerate(segments):
        if idx == 0:
            output_frames.extend(segment)
            continue

        previous_tail = output_frames[-crossfade_frames:]
        output_frames = output_frames[:-crossfade_frames]
        current_head = segment[:crossfade_frames]
        for f, (prev, curr) in enumerate(zip(previous_tail, current_head)):
            alpha = (f + 1) / crossfade_frames
            output_frames.append(Image.blend(prev, curr, alpha))
        output_frames.extend(segment[crossfade_frames:])

    assert len(output_frames) == total_frames
    for idx, frame in enumerate(output_frames):
        frame.save(FRAME_DIR / f"frame_{idx:04d}.jpg", quality=91, optimize=True)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output_frames[0].save(OUT_DIR / "hero-wedding-poster.jpg", quality=92, optimize=True)


def encode_video() -> None:
    output = OUT_DIR / "hero-wedding-film.mp4"
    command = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-framerate",
        str(FPS),
        "-i",
        str(FRAME_DIR / "frame_%04d.jpg"),
        "-vf",
        "format=yuv420p",
        "-c:v",
        "libx264",
        "-profile:v",
        "main",
        "-level",
        "4.0",
        "-movflags",
        "+faststart",
        "-crf",
        "23",
        "-preset",
        "medium",
        str(output),
    ]
    subprocess.run(command, check=True)


def main() -> None:
    render_frames(load_selected_images())
    encode_video()
    print(OUT_DIR / "hero-wedding-film.mp4")
    print(OUT_DIR / "hero-wedding-poster.jpg")


if __name__ == "__main__":
    main()
