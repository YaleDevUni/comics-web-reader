declare global {
  interface Window {
    showOpenFilePicker: any;
  }
}
/**
 * 
 * @param pickerOpts 
 * @returns 
 */
const getFile = async (pickerOpts: any) => {
  try {
    const [handle] = await window.showOpenFilePicker(pickerOpts);
    const file = await handle.getFile();
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  } catch (error:any) {
    throw new Error("Error selecting file: " + error.message);
  }
};

export default getFile;
