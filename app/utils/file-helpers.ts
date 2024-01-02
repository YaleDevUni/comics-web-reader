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
    console.log(handle);
    return new Promise<FileData>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fileData: FileData = {
          base64String,
          name: file.name,
          path: file.path,
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

/**
 * @param filePath - The path of the file to read
 * @returns {Promise<FileData>}
 */
export const readFileByPath = async (filePath: string): Promise<FileData> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert Uint8Array to base64
    let binaryString = "";
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    const base64String = btoa(binaryString);

    const fileData: FileData = {
      base64String,
      name: filePath.split("/").pop() || "", // Extracting the file name from the path
      path: filePath,
    };

    return fileData;
  } catch (error: any) {
    throw new Error("Error reading file by path: " + error.message);
  }
};
