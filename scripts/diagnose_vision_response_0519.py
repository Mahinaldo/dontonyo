from __future__ import annotations

import base64
import json
from pathlib import Path

from openai import OpenAI


image = Path("/home/ubuntu/dontonyo-work/batch-0519-0523/rendered/page_0519.jpg")
payload = base64.b64encode(image.read_bytes()).decode("ascii")
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {"role": "system", "content": "You are a Bangla OCR diagnostic. Return a short plain-text description of whether the supplied scanned page is readable."},
        {"role": "user", "content": [{"type": "text", "text": "Is this page readable? Reply with one short sentence."}, {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{payload}", "detail": "high"}}]},
    ],
    max_completion_tokens=200,
)
print(json.dumps({"choices": len(response.choices or []), "content": response.choices[0].message.content if response.choices else None, "finish_reason": response.choices[0].finish_reason if response.choices else None}, ensure_ascii=False))
