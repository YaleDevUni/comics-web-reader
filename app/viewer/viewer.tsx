"use client";
import React, { useState, useEffect, use } from "react";
import processZipData from "../utils/zip-to-webp";
import { readFileByPicker, readByFileHandle } from "../utils/file-helpers";
import type { WebPImage as WebPImageInterface } from "../utils/interfaces";
import { useSearchParams } from "next/navigation";
import { db } from "../db/db";
import { useRouter } from "next/router";
import type { FileData } from "../utils/interfaces";
import {
  FaAngleRight,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
} from "react-icons/fa";

const Viewer: React.FC = () => {
  const searchParams = useSearchParams();

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
  const defaultFileHandle: FileData = {
    name: "",
    base64String: "",
  };
  const [webpImages, setWebpImages] = useState<WebPImageInterface[]>([]);
  const [fileHandle, setFileHandle] = useState<FileData>(defaultFileHandle);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(
    searchParams.get("page")
      ? parseInt(searchParams.get("page") as string, 10) - 1
      : 0
  );
  const [jumpPage, setJumpPage] = useState<string>("");
  /**
   * load file content by handle
   */
  const loadFileContentByHandle = async () => {
    try {
      if (searchParams.get("index")) {
        const book = await db.books.get(
          parseInt(searchParams.get("index") as string, 10)
        );
        const fileData = await readByFileHandle(book?.handle);
        setFileHandle(fileData);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  /**
   * load file content
   */
  const loadFileContent = async () => {
    try {
      const fileData = await readFileByPicker(pickerOpts);
      setFileHandle(fileData);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  /**
   * jump to valid page
   */
  const handleJumpPage = () => {
    const page = parseInt(jumpPage, 10);
    if (!isNaN(page) && page >= 1 && page <= webpImages.length) {
      setCurrentImageIndex(page - 1);
    }
  };
  /**
   * set current image index
   * @param direction : prev, next, first, last
   */
  const navigateImage = (direction: string) => {
    switch (direction) {
      case "prev":
        setCurrentImageIndex(
          (prevIndex) => (prevIndex - 1 + webpImages.length) % webpImages.length
        );
        break;
      case "next":
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % webpImages.length
        );
        break;
      case "first":
        setCurrentImageIndex(0);
        break;
      case "last":
        setCurrentImageIndex(webpImages.length - 1);
        break;
      default:
        break;
    }
  };
  /**
   * for jump page input
   * @param e
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpPage();
    }
  };
  /**
   * key press handler
   * @param e
   */
  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      navigateImage("next");
    } else if (e.key === "ArrowLeft") {
      navigateImage("prev");
    } else if (e.key === "ArrowRight") {
      navigateImage("next");
    } else if (e.key === " ") {
      // Handle spacebar press (you can replace this with your logic)
      navigateImage("next");
    }
  };

  /**
   * Load the file content when the component mounts
   */
  useEffect(() => {
    if (searchParams.get("index") && fileHandle && !searchParams.get("new")) {
      loadFileContentByHandle();
    } else {
      loadFileContent();
    }
  }, [searchParams.get("index")]);

  /**
   *
   * Process the file content when fileHandle changes
   */
  useEffect(() => {
    const handleDisplayContent = async () => {
      try {
        if (fileHandle.base64String) {
          const images = await processZipData(
            fileHandle.base64String,
            fileHandle.name,
            fileHandle.handle,
            searchParams.get("new") !== "true"
          );
          setWebpImages(images);
        }
      } catch (error) {
        console.error("Error processing ZIP file:", error);
      }
    };

    // Call handleDisplayContent when fileHandle changes
    handleDisplayContent();
  }, [fileHandle]);

  /**
   * store current image index to db
   * update jump page when current image index changes
   */
  useEffect(() => {
    const resumePageHandler = async (reset: boolean = false) => {
      try {
        if (fileHandle && searchParams.get("index") && currentImageIndex >= 1) {
          if (reset) {
            db.books.update(parseInt(searchParams.get("index") as string, 10), {
              page: 1,
            });
            return;
          }
          db.books.update(parseInt(searchParams.get("index") as string, 10), {
            page: currentImageIndex + 1,
          });
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };
    // if last page, alert and set resume page to 1
    if (currentImageIndex === webpImages.length - 1) {
      alert("Last page");
      resumePageHandler(true);
    } else {
      resumePageHandler();
    }
    setJumpPage((currentImageIndex + 1).toString());
  }, [currentImageIndex]);

  /**
   * add global key press listener
   */
  useEffect(() => {
    if (fileHandle?.base64String?.length > 0) {
      // Add global key press listener
      document.addEventListener("keydown", handleGlobalKeyPress);
      // Clean up the listener on component unmount
      return () => {
        document.removeEventListener("keydown", handleGlobalKeyPress);
      };
    }
  }); // Empty dependency array to run the effect only once during component mount

  return (
    <div className="flex flex-col items-center w-full">
      {fileHandle.base64String.length > 0 && (
        <>
          <div className="flex justify-center">
            <button onClick={() => navigateImage("first")}>
              <FaAngleDoubleLeft size={40} />
            </button>
            <button onClick={() => navigateImage("prev")}>
              <FaAngleLeft size={40} />
            </button>
            <div className="flex items-center">
              {/* add input to jump page */}
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="m-2 border-0 p-2 rounded-md bg-black w-12 text-center"
              />
              <div>{webpImages.length}</div>
            </div>
            <button onClick={() => navigateImage("next")}>
              <FaAngleRight size={40} />
            </button>
            <button onClick={() => navigateImage("last")}>
              <FaAngleDoubleRight size={40} />
            </button>
          </div>
          {/* Display the current image */}
          {webpImages.length > 0 && (
            <div
              className=" h-screen "
              key={webpImages[currentImageIndex].name}
            >
              <img
                className="object-cover h-full w-full"
                src={URL.createObjectURL(
                  new Blob([webpImages[currentImageIndex].data], {
                    type: "image/webp",
                  })
                )}
                alt={webpImages[currentImageIndex].name}
              />
            </div>
          )}
          {/* Button to show the next image */}
        </>
      )}
    </div>
  );
};

export default Viewer;
