"use client";
import ThemeDropdown from "./dropdown";
export default function Nav() {
  return (
    <div className="flex flex-col items-center h-14 w-screen bg-black justify-center">
      <div className="text-white">Online Zip Viewer</div>
      <ThemeDropdown onSelectTheme={(theme) => console.log(theme)} />
    </div>
  );
}
