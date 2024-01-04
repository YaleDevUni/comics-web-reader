"use client";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Book } from "../../db/db";
import Image from "next/image";
export function BookList() {
  const books = useLiveQuery(() => db.books.toArray());

  return (
    <ul>
      {books?.map((book) => (
        <li key={book.id}>
          <div>
            {book.title} by {book.author}{" "}
          </div>
          <Image
            src={URL.createObjectURL(
              new Blob([book.image as BlobPart], {
                type: "image/webp",
              })
            )}
            alt="book cover"
            width={200}
            height={200}
          />
        </li>
      ))}
    </ul>
  );
}
