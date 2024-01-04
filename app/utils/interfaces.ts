declare global {
  interface Window {
    showOpenFilePicker: any;
  }
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
