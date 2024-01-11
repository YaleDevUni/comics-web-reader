"use client";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import OpenAndSave from "../buttons/open-and-save";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Props, Settings, SettingsContextType } from '../../utils/interfaces';
import {
	FaPlusCircle,
	FaCog,
	FaRegWindowClose,
} from "react-icons/fa";

const defaultSettings: Settings = {
	reversed: false,
	doublePage: false,
	darkmode: false,
};

const Nav: React.FC = () => {
	const searchParams = useSearchParams();

	const [showSettings, setShowSettings] = useState<Boolean>(false);
	const [settings, setSettings] = useState<Settings>(defaultSettings);


	return (
		<>
			<div className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
				<Link href="/">
					<IoHome size={30} className="fill-white" />
				</Link>
				<OpenAndSave>
					<FaPlusCircle size={30} className="fill-white" />
				</OpenAndSave>
				<FaCog
					size={30}
					className="fill-white"
					onClick={() => setShowSettings(!showSettings)}
				/>
			</div>
			{
				showSettings ? (
					<div className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
						<FaRegWindowClose
							size={30}
							className="fill-white"
							onClick={() => setShowSettings(!showSettings)}
						/>
						<form className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
							<label htmlFor="reversed">Reversed</label>
							<input type="checkbox" name="reversed" id="reversed" />
							<label htmlFor="doublePage">Double Page</label>
							<input type="checkbox" name="doublePage" id="doublePage" />
							<label htmlFor="darkmode">Dark Mode</label>
							<input type="checkbox" name="darkmode" id="darkmode" />
						</form>
					</div>
				) : null}
		</>
	);
}

export default Nav;