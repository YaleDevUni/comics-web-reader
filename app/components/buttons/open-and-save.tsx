import { readFileByPicker } from "../../utils/file-helpers";
import processZipData from "../../utils/zip-to-webp";

export default function OpenAndSave({
  children,
}: {
  children: React.ReactNode;
}) {
  const pickerOpts = {
    types: [
      {
        description: "Zip",
        accept: {
          "application/zip": [".zip"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  const loadFileContent = async () => {
    try {
      const fileData = await readFileByPicker(pickerOpts);
      await processZipData(
        fileData.base64String,
        fileData.name,
        fileData.handle,
        false,
        true
      );
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return <button onClick={loadFileContent}>{children}</button>;
}
