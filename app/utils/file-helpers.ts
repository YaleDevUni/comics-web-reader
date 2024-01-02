import type { FileData } from "./interfaces";
/**
 * @param pickerOpts
 * @returns {Promise<FileData>}
 */
export const readFileByPicker = async (pickerOpts: any): Promise<FileData> => {
  try {
    const [handle] = await window.showOpenFilePicker(pickerOpts);
    const file = await handle.getFile();
    const reader = new FileReader();
    return new Promise<FileData>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fileData: FileData = {
          base64String,
          name: file.name,
          handle,
        };
        resolve(fileData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  } catch (error: any) {
    throw new Error("Error selecting file: " + error.message);
  }
};

export const readByFileHandle = async (
  handle: FileSystemFileHandle | undefined
): Promise<FileData> => {
  try {

    const file = await handle?.getFile();
    const reader = new FileReader();
    return new Promise<FileData>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fileData: FileData = {
          base64String,
          name: file?.name || "",
          handle,
        };
        resolve(fileData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file as Blob);
    });
  } catch (error: any) {
    throw new Error("Error selecting file: " + error.message);
  }
};
