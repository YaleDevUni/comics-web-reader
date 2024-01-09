import Dexie, { Table } from "dexie";
export interface Tag {
  name: string;
}
export interface Series {
  title: string;
  number: number;
  otherBooks?: number[]; // array of book ids
}
export interface Book {
  id?: number;
  title: string;
  author: string;
  volume: number;
  tags: Tag[];
  genre?: string[];
  series?: Series;
  handle?: FileSystemFileHandle;
  image?: Uint8Array | Blob | string;
}

export interface BookImage {
  id?: number;
  bookId: number;
  image: Uint8Array | Blob | string;
}
export class MySubClassedDexie extends Dexie {
  books!: Table<Book>;
  booksImages!: Table<BookImage>;
  tags!: Table<Tag>;
  constructor() {
    super("myDatabase");
    this.version(1).stores({
      books:
        "++id, title, author, category, genre, seriesTitle, seriesNumber, handle, image",
      booksImages: "++id, bookId, image",
      tags: "++id, name",
    });
  }
}

export const db = new MySubClassedDexie();
