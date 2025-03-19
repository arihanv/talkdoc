import os
from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("PLAY_HT_API_KEY")
user_id = os.getenv("PLAY_HT_USER_ID")

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
    'X-USER-ID': user_id
}

def generate_audio(text: str, model="Play3.0-mini", voice="s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json", outputFormat="mp3"):
    json_data = {
        'model': model,
        'text': text,
        'voice': voice,
        'outputFormat': outputFormat
    }
    
    response = requests.post('https://api.play.ai/api/v1/tts/stream', headers=headers, json=json_data, stream=True)

    if response.status_code == 200:
        for chunk in response.iter_content(chunk_size=4096):
            if chunk:
                yield chunk
    else:
        raise Exception(f"Request failed with status code {response.status_code}: {response.text}")

class StreamAudioRequest(BaseModel):
    text: str

@web_app.post("/stream_audio")
def stream_audio(request: StreamAudioRequest):
    from fastapi.responses import StreamingResponse

    return StreamingResponse(
        generate_audio(request.text), media_type="audio/mpeg"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(web_app, host="0.0.0.0", port=8000)