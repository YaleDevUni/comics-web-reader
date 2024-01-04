"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db/db";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
import OpenAndSave from "./components/buttons/open-and-save";
export default function Home() {
  const books = useLiveQuery(() => db.books.toArray());
  const isLoading = !books;

  return (
    <div className="m-2">
      {isLoading ? (
        <div className="grid grid-cols-6 gap-4 text-white">
          {Array.from(Array(5).keys())
            .map((i) => (
              <div
                key={i + "loading"}
                className="col-span-1 bg-gray-900 rounded-md p-2 w-full"
                style={{ height: 500 }}
              >
                loading...
              </div>
            ))
            .concat(
              <div
                key={"addBook"}
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
                    pathname: "/viewer",
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
                <div
                  key={"addBook"}
                  className=" col-span-1 bg-gray-900 rounded-md p-2 flex items-center justify-center "
                >
                  <IoMdAddCircleOutline className="fill-white" size={200} />
                </div>
              )}
          </div>
        </>
      )}
      <div>
        <div className=" m-2 border-0 p-2 rounded-md bg-orange-500 w-fit">
          <Link href="/viewer">Zip viewer</Link>
        </div>

        <p>This version only support Webp images in Zip file.</p>
        <p>Version 0.1.1</p>
      </div>
    </div>
  );
}
