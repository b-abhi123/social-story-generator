import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from story import generate_story
from images import generate_images

# Load .env before anything else touches env vars
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)


@app.route("/", methods=["GET"])
def index():
    """Serve the frontend UI."""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api", methods=["GET"])
def api_status():
    return jsonify({"message": "StoryPath API is running 🌟"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()

        situation = data["situation"]
        child_name = data["childName"]
        age = data["age"]
        gender = data["gender"]
        skin_tone = data["skinTone"]
        hair = data["hair"]
        outfit = data["outfit"]
        interests = data["interests"]
        color_palette = data["colorPalette"]

        # Step 1 — generate the 6-panel story text via Groq
        story = generate_story(situation, child_name, age, gender, interests)

        # Step 2 — generate one illustration per panel via Hugging Face
        panel_images = generate_images(
            story["panels"], gender, age, skin_tone, hair, outfit, color_palette
        )

        # Step 3 — merge captions and images into the final response
        merged_panels = []
        for panel, image_b64 in zip(story["panels"], panel_images):
            merged_panels.append({
                "caption": panel["caption"],
                "image": image_b64,
            })

        return jsonify({
            "title": story["title"],
            "panels": merged_panels,
        })

    except KeyError as e:
        return jsonify({"error": f"Missing required field: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
