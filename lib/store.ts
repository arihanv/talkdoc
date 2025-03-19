import { atom } from "jotai";

const fileUrlAtom = atom<string | null>(null);
const pageContentAtom = atom<string | null>(null);
const fileNameAtom = atom<string | null>();
const pageCountAtom = atom<number | null>(null);

export { fileUrlAtom, pageContentAtom, fileNameAtom, pageCountAtom };
