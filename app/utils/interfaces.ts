import { ReactNode } from "react";

declare global {
  interface Window {
    showOpenFilePicker: any;
  }
}

export interface Props {
  children: ReactNode;
}

export interface WebPImage {
  name: string;
  data: Uint8Array;
}

export interface FileData {
  base64String: string;
  name: string;
  handle?: FileSystemFileHandle | undefined;
}

export interface Settings {
	reversed: boolean;
	doublePage: boolean;
	darkmode: boolean;
}

export type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}