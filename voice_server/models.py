from pydantic import BaseModel
from typing import Optional

class VoiceSettings(BaseModel):
    name: str
    accent: str
    gender: str
    value: str
    language: Optional[str] = None
    languageCode: Optional[str] = None
    sample: Optional[str] = None
    style: Optional[str] = None

class AudioModelSettings(BaseModel):
    voice: VoiceSettings
    temperature: float
    model: str
    speed: float

class StreamAudioRequest(BaseModel):
    text: str
    modelOptions: Optional[AudioModelSettings] = None