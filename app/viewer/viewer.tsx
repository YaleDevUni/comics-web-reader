"use client";
import React, { useState, useEffect, use } from "react";
import processZipData from "../utils/zip-to-webp";
import { readFileByPicker, readByFileHandle } from "../utils/file-helpers";
import type { WebPImage as WebPImageInterface } from "./interfaces";
import { FileData } from "../utils/interfaces";
import { useSearchParams } from "next/navigation";
import { db } from "../db/db";
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
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [jumpPage, setJumpPage] = useState<string>("");
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

  const loadFileContent = async () => {
    try {
      const fileData = await readFileByPicker(pickerOpts);
      setFileHandle(fileData);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleJumpPage = () => {
    const page = parseInt(jumpPage, 10);
    if (!isNaN(page) && page >= 1 && page <= webpImages.length) {
      setCurrentImageIndex(page - 1);
    }
  };

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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpPage();
    }
  };

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
  useEffect(() => {
    if (searchParams.get("index") && fileHandle) {
      loadFileContentByHandle();
    }
  }, [searchParams.get("index")]);

  useEffect(() => {
    const handleDisplayContent = async () => {
      try {
        if (fileHandle.base64String) {
          const images = await processZipData(
            fileHandle.base64String,
            fileHandle.name,
            fileHandle.handle,
            searchParams.get("index") ? true : false
          );
          setWebpImages(images);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error processing ZIP file:", error);
      }
    };

    // Call handleDisplayContent when fileHandle changes
    handleDisplayContent();
  }, [fileHandle]);

  useEffect(() => {
    setJumpPage((currentImageIndex + 1).toString());
  }, [currentImageIndex]);

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
    <div className="flex flex-col items-center">
      <button
        className="m-2 border-0 p-2 rounded-md bg-orange-500 w-fit"
        onClick={loadFileContent}
      >
        Open Files
      </button>
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
                className="m-2 border-0 p-2 rounded-md bg-gray-100 w-12 text-center"
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
