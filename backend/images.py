import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

HF_TOKEN = os.getenv("HF_TOKEN")


def pil_to_base64(img):
    """Convert a PIL Image to a data-URI base64 PNG string."""
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")


def generate_images(panels, gender, age, skin_tone, hair, outfit, color_palette):
    """Generate one illustration per panel via Hugging Face FLUX.1-schnell.

    Returns a list of 6 base64-encoded PNG data URIs.
    """
    client = InferenceClient(token=HF_TOKEN)
    images_b64 = []

    for idx, panel in enumerate(panels):
        prompt = (
            f"Flat children's book illustration, soft {color_palette} color palette, "
            f"clean simple lines, no shading, no outlines. A young {gender}, approximately "
            f"{age} years old, {skin_tone} skin, {hair}, round face, small button nose, "
            f"large expressive dark eyes, wearing {outfit}. "
            f"{panel['scene']} {panel['environment']}. The child's expression shows {panel['emotion']}. "
            f"Wide shot, full body visible, warm soft lighting. No text, no words, no labels."
        )

        try:
            pil_image = client.text_to_image(
                prompt,
                model="black-forest-labs/FLUX.1-schnell",
            )
        except Exception as e:
            raise RuntimeError(
                f"Image generation failed for panel {idx + 1}: {e}"
            )

        images_b64.append(pil_to_base64(pil_image))

    return images_b64
