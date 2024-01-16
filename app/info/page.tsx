"use client";
import { db } from "@/db/db";
import type { Book } from "@/db/db";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

const App = () => {
  const searchParams = useSearchParams();
  const [tagInput, setTagInput] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [book, setBook] = useState<Book>({
    id: undefined,
    title: "",
    author: "",
    volume: 0,
    genre: [],
    tags: [],
    series: undefined,
    handle: undefined,
    image: undefined,
  });
  const onChangeTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const updateTags = async () => {
    const isTagExist = await db.tags.get({ name: tagInput });
    isTagExist ? db.tags.add({ name: tagInput }) : null;
  };

  const updateBookTags = () => {
    if (tagInput !== "") {
      // check if the tag already exist in the book
      const isTagExist = book.tags?.some((tag) => tag.name === tagInput);
      if (isTagExist) {
        alert("Tag already exist");
        return;
      } else {
        book.tags?.push({ name: tagInput });
        setBook({ ...book, tags: book.tags });
        db.books.update(parseInt(searchParams.get("index") as string, 10), {
          tags: book?.tags,
        });
      }
    } else {
      alert("Tag cannot be empty");
    }
    setTagInput("");
  };

  const handleUpdateTag = () => {
    updateTags();
    updateBookTags();
  };

  const listenKeyEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle the key event here
    if (event.key === "Enter") {
      handleUpdateTag();
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      const bookId = parseInt(searchParams.get("index") as string, 10);
      const fetchedBook = await db.books.get(bookId);
      setBook(fetchedBook as Book);
      // Create Blob URL once when the book is fetched
      const blobURL = URL.createObjectURL(
        new Blob([fetchedBook?.image as BlobPart], {
          type: "image/webp",
        })
      );
      setImageSrc(blobURL);
    };
    fetchBook();
  }, []);

  if (!book) {
    // Handle the case when the book is still being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="m-2 flex  gap-2 h-screen">
      <div className="bg-black rounded-lg h-min">
        <div className="relative h-[50vh] w-[20vw] m-2">
          <Link
            href={{
              pathname: "/viewer",
              query: { index: book.id, page: 1 },
            }}
          >
            {imageSrc === undefined ? (
              <></>
            ) : (
              <Image
                src={imageSrc as string}
                alt="book cover"
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="empty"
                // className="m-2"
              />
            )}
            {book.page === undefined || book.page == 1 ? (
              <></>
            ) : (
              <Link
                href={{
                  pathname: "/viewer",
                  query: { index: book.id, page: book.page || 1 },
                }}
                className="absolute bottom-0 right-0 bg-orange-500  p-1 rounded-tl-lg"
              >
                Continue Page({book.page})
              </Link>
            )}
          </Link>
        </div>
      </div>
      <div>
        <div>Title: {book.title.split(".")[0]}</div>
        <div>Author: {book.author !== "" ? book.author : "N/A"}</div>
        <div>Volume: {book.volume}</div>
        <div>
          Series: {book.series?.title !== undefined ? book.series.title : "N/A"}
        </div>
        {/* <div className="flex"> */}
        <hr className="m-2" />
        <div>Tags:</div>
        <div className="flex flex-wrap items-center gap-2 w-[70vw]">
          {book.tags !== undefined
            ? book.tags.map((tag, i) => (
                <div className=" bg-black rounded-lg p-1 " key={i + "tags"}>
                  {tag.name}
                </div>
              ))
            : null}
          <div className=" flex items-center border-2 rounded-lg ">
            <input
              className="w-24 bg-black h-6 rounded p-1"
              onChange={onChangeTagInput}
              onKeyDown={listenKeyEvent}
              value={tagInput}
              placeholder="Add Tag"
            />
            <button
              className="bg-white h-6 rounded-r"
              onClick={handleUpdateTag}
            >
              <MdAdd size={25} className="fill-black" />
            </button>
          </div>
        </div>
        {/* </div> */}
        {/* Add other properties as needed */}
      </div>
    </div>
  );
};

export default App;
