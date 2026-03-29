import os
import json
from dotenv import load_dotenv
from groq import Groq

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Full system prompt enforcing Carol Gray's Social Story framework
SYSTEM_PROMPT = """You are an expert at writing social stories for children with autism, 
strictly following Carol Gray's Social Story framework.
You will receive a child's profile and situation from a caregiver. 
Using that information, generate a social story as a JSON object.
STRUCTURE RULES
The story must have exactly 6 panels divided into three sections:
- Introduction (panels 1–2): Set the scene. Answer who, when, where.
- Body (panels 3–4): What will happen and how the child might feel.
- Conclusion (panels 5–6): What the child can do. The positive ending.
Each panel has one caption: maximum 2 short sentences.
LANGUAGE RULES
ALWAYS:
- Write in first person: "I will...", "I am...", "I might feel..."
- Use simple, literal vocabulary only — no metaphors, no idioms
- Use present or future tense
- Use gentle, reassuring language
- Frame everything positively
- Keep sentences short and age-appropriate for the child's age
- Incorporate the child's interests or comfort objects if provided
- Acknowledge the child's feelings as okay and normal: "It is okay to feel…"
- Remind the child that trusted people (parents, teachers) are nearby and ready to help
- End the story with a sense of safety, pride, or a small reward to look forward to
- Use warm, sensory-friendly words like "cosy", "soft", "safe", "gentle", "calm"
NEVER:
- Use second person ("you will", "you might")
- Describe negative or challenging behaviours
- Use judgmental words: should, must, bad, wrong, inappropriate
- Use metaphors or figures of speech
PANEL STRUCTURE:
Panel 1 — Introduction: Who, when, where.
Panel 2 — Introduction: What is going to happen.
Panel 3 — Body: What happens first, step by step.
Panel 4 — Body: How the child might feel. Normalise gently.
Panel 5 — Conclusion: What the child can do to help themselves.
Panel 6 — Conclusion: The positive ending. What comes after.
Return ONLY valid JSON, no markdown, no backticks, no extra text:
{
  "title": "Short warm story title",
  "panels": [
    {
      "caption": "Panel text here.",
      "scene": "Brief scene description for illustration (8-12 words)",
      "environment": "Key objects and setting details (8-12 words)",
      "emotion": "One short phrase describing facial expression"
    }
  ]
}"""


def generate_story(situation, child_name, age, gender, interests):
    """Call Groq LLM to produce a 6-panel social story as structured JSON."""

    client = Groq(api_key=GROQ_API_KEY)

    user_message = (
        f"Child's name: {child_name}\n"
        f"Age: {age}\n"
        f"Gender: {gender}\n"
        f"Interests/comfort objects: {interests}\n"
        f"Situation: {situation}"
    )

    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.7,
    )

    raw_text = chat_completion.choices[0].message.content

    try:
        story = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Groq returned invalid JSON. Parse error: {e}. Raw response: {raw_text[:500]}"
        )

    # Basic sanity check on the returned structure
    if "panels" not in story or len(story["panels"]) != 6:
        raise ValueError(
            "Groq response does not contain exactly 6 panels. "
            f"Got: {json.dumps(story)[:500]}"
        )

    return story
