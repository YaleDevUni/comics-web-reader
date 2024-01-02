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
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  books!: Table<Book>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      friends:
        "++id, title, author, category, genre, isSeries, seriesTitle, seriesNumber",
    });
  }
}

export const db = new MySubClassedDexie();
