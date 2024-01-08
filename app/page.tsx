"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db/db";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
import OpenAndSave from "./components/buttons/open-and-save";
import { useEffect } from "react";
export default function Home() {
  const books = useLiveQuery(() => db.books.toArray());
  const isLoading = !books;
  // check if there is new book added
  return (
    <div className="m-2 flex flex-col justify-between h-screen">
      {isLoading ? (
        <div className="grid grid-cols-6 gap-4 text-white">
          {Array.from(Array(5).keys())
            .map((i) => (
              <div
                key={i + "loading"}
                className="col-span-1 bg-gray-900 rounded-md p-2 w-full"
                style={{ height: 300 }}
              >
                loading...
              </div>
            ))
            .concat(
              <div
                key={"addBookLoading"}
                className=" col-span-1 bg-gray-900 rounded-md p-2 flex items-center justify-center "
              >
                <IoMdAddCircleOutline className="fill-white" size={200} />
              </div>
            )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-4 ">
            {books
              ?.map((book) => (
                <Link
                  href={{
                    pathname: "/info",
                    query: { index: book.id },
                  }}
                  key={book.id + "link"}
                  className="col-span-1 bg-gray-900 rounded-md p-2 "
                >
                  <Image
                    src={URL.createObjectURL(
                      new Blob([book.image as BlobPart], {
                        type: "image/webp",
                      })
                    )}
                    alt="book cover"
                    width={500}
                    height={200}
                    key={book.id + "image"}
                  />
                  <div
                    key={book.id + "title"}
                    className=" text-center text-lg text-white"
                  >
                    {book.title.split(".")[0]}
                  </div>
                </Link>
              ))
              .concat(
                <Link
                  className=" col-span-1 bg-gray-900 rounded-md p-2 flex items-center justify-center "
                  key={"addBookLink"}
                  href={{
                    pathname: "/viewer",
                    query: { index: books.length + 1, new: true },
                  }}
                >
                  <IoMdAddCircleOutline className="fill-white" size={200} />
                </Link>
              )}
          </div>
        </>
      )}
      <div className="text-center">
        <p>
          This version supports .jpeg, .webp, .png, and .gif images in Zip file
          and chromium based desktop browser.
        </p>
        <p>
          Upcomming Feature: Open images by folder, categorize images by tags
        </p>
        <p>
          Version 0.2.1 &copy;{" "}
          <a href="https://github.com/YaleDevUni">YaleDevUni</a>
        </p>
      </div>
    </div>
  );
}
