"use client";
import React, { useState } from "react";
import { db, Book } from "../../db/db";

export function AddBookForm({
  defaultTitle = "",
  defaultAuthor = "",
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [author, setAuthor] = useState(defaultAuthor);
  const [status, setStatus] = useState("");
  async function addBook() {
    try {
      // Add the new book!

      const id = await db.books.add({
        title,
        author,
        // handle: "",
      });

      setStatus(
        `Book "${title}" by ${author} successfully added. Got id ${id}`
      );
      setTitle(defaultTitle);
      setAuthor(defaultAuthor);
    } catch (error) {
      setStatus(`Failed to add "${title}" by ${author}: ${error}`);
    }
  }

  return (
    <>
      <p>{status}</p>
      Title:
      <input
        type="text"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      Author:
      <input
        type="text"
        value={author}
        onChange={(ev) => setAuthor(ev.target.value)}
      />
      <button onClick={addBook}>Add</button>
    </>
  );
}
