"use client";
import React, { useState } from "react";
import { CgDarkMode } from "react-icons/cg";
interface Theme {
  id: number;
  name: string;
  value: string;
}

interface ThemeDropdownProps {
  onSelectTheme: (theme: string) => void;
}

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ onSelectTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const themeOptions: Theme[] = [
    { id: 1, name: "Light Theme", value: "light" },
    { id: 2, name: "Dark Theme", value: "dark" },
    { id: 3, name: "Blue Theme", value: "blue" },
    // Add more theme options as needed
  ];

  const handleSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onSelectTheme(theme.value);
  };

  return (
    // <div className="theme-dropdown">
    //   <select
    //     value={selectedTheme ? selectedTheme.value : ""}
    //     onChange={(e) => {
    //       const selectedOption = themeOptions.find(
    //         (option) => option.value === e.target.value
    //       );
    //       selectedOption && handleSelect(selectedOption);
    //     }}
    //   >
    //     <option value="" disabled>
    //       Select a theme
    //     </option>
    //     {themeOptions.map((theme) => (
    //       <option key={theme.id} value={theme.value}>
    //         {theme.name}
    //       </option>
    //     ))}
    //   </select>
    // </div>
    // <div>
    // <CgDarkMode size={50}  />
    <></>
  );
};

export default ThemeDropdown;
