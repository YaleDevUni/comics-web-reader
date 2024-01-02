import Dexie, { Table } from "dexie";

export interface Book {
  id?: number;
  title: string;
  author: string;
  category?: string[];
  genre?: string[];
  isSeries: boolean;
  seriesTitle?: string;
  seriesNumber?: number;
  path: string;
  image?: Uint8Array | Blob | string;
}

export class MySubClassedDexie extends Dexie {
  // 'books' is used to match your React component
  books!: Table<Book>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      // Change 'friends' to 'books'
      books:
        "++id, title, author, category, genre, isSeries, seriesTitle, seriesNumber, path, image",
    });
  }
}

export const db = new MySubClassedDexie();
