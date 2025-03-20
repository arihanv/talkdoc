import { atom } from "jotai";

export interface AudioModelSettings {
  voice: {
    name: string;
    accent: string;
    gender: string;
    value: string;
    language?: string;
    languageCode?: string;
    sample?: string;
    style?: string;
  };
  temperature: number;
  model: string;
  speed: number;
}

const defaultAudioModelSettings: AudioModelSettings = {
  voice: {
    name: "Deedee",
    accent: "american",
    gender: "female",
    value: "s3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json",
    language: "English (US)",
    languageCode: "EN-US",
    style: "Conversational"
  },
  temperature: 0.5,
  model: "Play3.0-mini",
  speed: 1
};

const fileUrlAtom = atom<string | null>(null);
const pageContentAtom = atom<string | null>(null);
const fileNameAtom = atom<string | null>();
const pageCountAtom = atom<number | null>(null);
const audioModelSettingsAtom = atom<AudioModelSettings>(defaultAudioModelSettings);

export { fileUrlAtom, pageContentAtom, fileNameAtom, pageCountAtom, audioModelSettingsAtom };
