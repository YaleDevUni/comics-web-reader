"use client";
import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { FaPlusCircle, FaWrench } from "react-icons/fa";
import OpenAndSave from "../buttons/open-and-save";
import SettingsButton from "../buttons/settings";

export default function Nav() {
  return (
    <div className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
      <Link href="/">
        <IoHome size={30} className="fill-white" />
      </Link>
      <OpenAndSave>
        <FaPlusCircle size={30} className="fill-white" />
      </OpenAndSave>
	  <SettingsButton>
		<FaWrench />
	  </SettingsButton>
    </div>
  );
}
