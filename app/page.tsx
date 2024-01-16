"use client";
import { use, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaCaretDown, FaArrowUp, FaArrowDown, FaEye } from "react-icons/fa";
import { Book, db } from "./db/db";
import { useEffect } from "react";

export default function Home() {
  const DEFAULT_BOOKS_PER_PAGE = 11;
  const booksPerPageOptions = [11, 17, 23, 29, 35];
  const searchParams = useSearchParams();
  const totalBooks = useLiveQuery(() => db.books.count()) ?? 0;
  const [books, setBooks] = useState<Book[] | undefined>(undefined);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [nextBookIndex, setNextBookIndex] = useState<number | undefined>(0);
  const [booksPerPage, setBooksPerPage] = useState<number>(
    DEFAULT_BOOKS_PER_PAGE
  );
  const page =
    searchParams.get("page") !== null
      ? parseInt(searchParams.get("page") as string, 10)
      : 1;

  useLiveQuery(() => {
    if (searchParams.get("direction") === "desc") {
      db.books
        .offset(DEFAULT_BOOKS_PER_PAGE * (page - 1))
        .limit(DEFAULT_BOOKS_PER_PAGE)
        .sortBy(searchParams.get("sort") ?? "title")
        .then((result) => {
          setBooks(result);
        });
    } else {
      db.books
        .reverse()
        .offset(DEFAULT_BOOKS_PER_PAGE * (page - 1))
        .limit(DEFAULT_BOOKS_PER_PAGE)
        .sortBy(searchParams.get("sort") ?? "title")
        .then((result) => {
          setBooks(result);
        });
    }
  }, [
    totalBooks,
    searchParams.get("page"),
    searchParams.get("sort"),
    searchParams.get("direction"),
  ]);
  useEffect(() => {
    const getLastInsertedId = async () => {
      const lastRecord = await db.transaction("rw", db.books, async () => {
        return await db.books.orderBy(":id").last();
      });
      return lastRecord ? lastRecord.id : 0;
    };
    const updateLastInsertedId = async () => {
      const lastId = await getLastInsertedId();
      if (lastId !== undefined) setNextBookIndex(lastId + 1);
      else setNextBookIndex(0);
    };
    updateLastInsertedId();
  }, [books]);

  /**
   * @description create image url for each book
   */
  const bookImages = useMemo(
    () =>
      books?.map((book) => ({
        id: book.id,
        imageSrc: URL.createObjectURL(
          new Blob([book.image as BlobPart], { type: "image/webp" })
        ),
      })),
    [books]
  );
  // Function to get the last inserted ID

  const handleSetBooksPerPage = () => {};
  const handleToggleDropdown = () => {
    console.log("toggle");
    setToggleDropdown(!toggleDropdown);
  };
  const handleCloseDropdown = () => {
    setToggleDropdown(false);
  };

  const isLoading = !books;
  // check if there is new book added
  return (
    <div className="p-2">
      <div className=" flex justify-end relative mb-2 gap-2">
        <Link
          href={{
            pathname: "/",
            query: {
              page,
              sort: searchParams.get("sort"),
              direction:
                searchParams.get("direction") === "asc" ? "desc" : "asc",
            },
          }}
          // onBlur={handleToggleDropdown}
          className="bg-gray-900 rounded-md p-2 flex items-center justify-center px-4 relative hover:bg-gray-800"
        >
          <span>
            {searchParams.get("direction") === "asc" ? (
              <FaArrowUp />
            ) : (
              <FaArrowDown />
            )}
          </span>
        </Link>
        <button
          // onBlur={handleToggleDropdown}
          className="bg-gray-900 rounded-md p-2 flex items-center justify-center px-8 relative hover:bg-gray-800"
          onClick={() => handleToggleDropdown()}
        >
          Sort By{" "}
          <span>
            <FaCaretDown />
          </span>
        </button>
        {toggleDropdown ? (
          <ul className=" absolute  top-11 ">
            <li className=" w-40">
              <Link
                href={{
                  pathname: "/",
                  query: {
                    page,
                    sort: "title",
                    direction: searchParams.get("direction") ?? "desc",
                  },
                }}
                className="bg-gray-900 rounded-t-md py-1 w-full flex items-center justify-center hover:bg-gray-800"
              >
                Name{" "}
              </Link>
            </li>
            {/* <hr className=" bg-white opacity-30" /> */}
            <li className=" w-40">
              <Link
                href={{
                  pathname: "/",
                  query: {
                    page,
                    sort: "id",
                    direction: searchParams.get("direction") ?? "desc",
                  },
                }}
                className="bg-gray-900 rounded-b-md py-1 w-full flex items-center justify-center hover:bg-gray-800"
              >
                Date Added{" "}
              </Link>
            </li>
            <hr className=" bg-white opacity-10" />
          </ul>
        ) : null}
      </div>
      <div className="flex flex-col justify-between h-[98svh]">
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
                    className="col-span-1 bg-gray-900 rounded-md p-2 relative"
                  >
                    <Image
                      src={
                        bookImages?.find((image) => image.id === book.id)
                          ?.imageSrc as string
                      }
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
                    {book.page === undefined || book.page == 1 ? (
                      <></>
                    ) : (
                      <FaEye
                        className="absolute top-0 right-0 fill-white bg-orange-500 rounded-bl-lg rounded-tr-md px-1"
                        size="15%"
                      />
                    )}
                  </Link>
                ))
                .concat(
                  <Link
                    className=" col-span-1 bg-gray-900 rounded-md p-2 flex items-center justify-center "
                    key={"addBookLink"}
                    href={{
                      pathname: "/viewer",
                      query: { index: nextBookIndex, new: true },
                    }}
                  >
                    <IoMdAddCircleOutline className="fill-white" size={200} />
                  </Link>
                )}
            </div>
          </>
        )}
        <div className="text-center">
          {Array.from({
            length: Math.ceil(totalBooks / DEFAULT_BOOKS_PER_PAGE),
          }).map((_, i) => {
            const currentPage = page;
            const pageWithinRange =
              i + 1 >= currentPage - 5 && i + 1 <= currentPage + 5;

            return pageWithinRange ? (
              i + 1 === currentPage ? (
                <span key={i + "page"} className="mx-2 text-lg">
                  <b>{i + 1}</b>
                </span>
              ) : (
                <Link
                  key={i + "page"}
                  href={{
                    pathname: "/",
                    query: { page: i + 1 },
                  }}
                >
                  <button className="mx-2">{i + 1}</button>
                </Link>
              )
            ) : null;
          })}
          <hr className="m-2" />
          <p>
            This version supports .jpeg, .webp, .png, and .gif images in Zip
            file and chromium based desktop browser.
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
    </div>
  );
}
