"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db/db";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
export default function Home() {
  const books = useLiveQuery(() => db.books.toArray());
  return (
    <div className="m-2">
      {/* <Link href="/page2/[dynamicString]" as={`/page2/${dynamicString}`}></Link> */}

      <div className="grid grid-cols-6 gap-4 ">
        {books
          ?.map((book) => (
            <Link
              href={{
                pathname: "/viewer",
                query: { path: book.path },
              }}
              key={book.id}
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
                objectFit="cover"
              />
              <div className=" text-center text-2xl text-white">
                {book.title.split(".")[0]}
              </div>
            </Link>
          ))
          .concat(
            <div className=" col-span-1 bg-gray-900 rounded-md p-2 flex items-center justify-center ">
              <IoMdAddCircleOutline className="fill-white" size={200} />
            </div>
          )}
      </div>
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
