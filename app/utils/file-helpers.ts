import type { FileData } from "./interfaces";
/**
 * Read file by file picker
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

/**
 * Read file by file handle(reopen file)
 * @param handle : FileSystemFileHandle | undefined
 * @returns {Promise<FileData>}
 */
export const readByFileHandle = async (
  handle: FileSystemFileHandle | undefined
): Promise<FileData> => {
  try {
    await verifyPermission(handle as FileSystemFileHandle, true);
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
/**
 * Verify permission, if not granted, request permission
 * @param fileHandle : FileSystemFileHandle
 * @param readWrite  : boolean
 * @returns
 */
async function verifyPermission(
  fileHandle: FileSystemFileHandle,
  readWrite: boolean
): Promise<boolean> {
  const options: any = {};

  if (readWrite) {
    options.mode = "read";
  }

  // Check if permission was already granted. If so, return true.
  //@ts-ignore
  if ((await fileHandle.queryPermission(options)) === "granted") {
    return true;
  }

  // Request permission. If the user grants permission, return true.
  //@ts-ignore
  if ((await fileHandle.requestPermission(options)) === "granted") {
    return true;
  }

  // The user didn't grant permission, so return false.
  return false;
}
