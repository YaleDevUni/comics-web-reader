import JSZip from "jszip";
import { db } from "../db/db";
import { compress } from "image-conversion";
import type { WebPImage } from "../viewer/interfaces";
/**
 * Process the contents of a ZIP file and return an array of WebP images (name and binary data)
 * @param zipDatar : string
 * @param fileName : string
 * @param handle : FileSystemFileHandle | undefined
 * @param reOpen : boolean
 * @param addOnly : boolean
 * @returns
 */
async function processZipData(
  zipDatar: string,
  fileName: string,
  handle: FileSystemFileHandle | undefined,
  reOpen: boolean,
  addOnly?: boolean
): Promise<WebPImage[]> {
  const webpImages: WebPImage[] = [];
  const zipData = zipDatar.replace(/^data:.+;base64,/, "");
  try {
    // Unzip the file
    const zip = new JSZip();
    const zipInstance = await zip.loadAsync(zipData, { base64: true });
    // Process the contents of the ZIP file
    // (In this case, assuming it contains WebP images)
    const imageNames: string[] = Object.keys(zipInstance.files);
    for (const imageName of imageNames) {
      // Skip files or directories with names starting with "__MACOSX"
      if (imageName.startsWith("__MACOSX/")) {
        continue;
      }
      const imageFile = zipInstance.files[imageName];

      // Check if the file is a directory
      if (imageFile.dir) {
        // Skip directories
        continue;
      }

      const imageData: Uint8Array = await imageFile.async("uint8array");

      // Now imageData contains the binary data of the WebP image
      // Add the WebP image to the array
      webpImages.push({ name: imageName, data: imageData });
      if (webpImages.length === 1 && !reOpen) {
        const imageBlob = new Blob([imageData], { type: "image/webp" });
        const compressedImage = await compress(imageBlob, { quality: 0.1 });
        db.books.add({
          title: fileName,
          author: "",
          isSeries: false,
          handle,
          image: compressedImage,
        });
      }
      if (addOnly) break;
    }
    // Sort the array by name
    webpImages.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error processing the ZIP file:", error);
  }

  return webpImages;
}

export default processZipData;
