import React from "react";
import Viewer from "./viewer"; // adjust the path according to your file structure
import { useRouter } from "next/navigation";
import { BookList } from "../components/books/book-list"; // adjust the path according to your file structure
const App: React.FC = () => {
  return (
    <div>
      <Viewer />
      {/* <BookList /> */}
    </div>
  );
};

export default App;
