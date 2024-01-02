import React from "react";
import Viewer from "./viewer"; // adjust the path according to your file structure
import { AddBookForm } from "../components/dexie-db/add-book"; // adjust the path according to your file structure
const App: React.FC = () => {
  return (
    <div>
      <Viewer />
      <AddBookForm />
    </div>
  );
};

export default App;
