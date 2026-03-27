import React from "react";
import { db, Settings } from '../../db/db';

const UniversalSettings: React.FC<{storedSettings: Settings[]}> = ({storedSettings}) => {
	return (
		<form className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
			<div id="reversed_wrapper" className="flex">
				<label className="p-2" htmlFor="reversed">Reversed</label>
				<input
					type="checkbox"
					name="reversed"
					id="reversed"
					defaultChecked={storedSettings[0].reversed}
					onChange={(e) => db.settings.update(1, { reversed: e.target.checked })}
				/>
			</div>
			<div id="doublePage_wrapper" className="flex">
				<label className="p-2" htmlFor="doublePage">Double Page</label>
				<input
					type="checkbox"
					name="doublePage"
					id="doublePage"
					defaultChecked={storedSettings[0].doublePage}
					onChange={(e) => db.settings.update(1, { doublePage: e.target.checked })}
				/>
			</div>
			<div id="darkmode_wrapper" className="flex">
				<label className="p-2" htmlFor="darkmode">Dark Mode</label>
				<input
					type="checkbox"
					name="darkmode"
					id="darkmode"
					defaultChecked={storedSettings[0].darkmode}
					onChange={(e) => db.settings.update(1, { darkmode: e.target.checked })}
				/>
			</div>
			<div id="displayPerPage_wrapper" className="flex">
				<label className="p-2" htmlFor="displayPerPage">Display per Page</label>
				<div id="displayPerPage_input_wrapper_10" className="flex flex-col p-1">
					<input
						className="m-1"
						type="radio"
						value="10"
						checked={storedSettings[0].displayPerPage === 10}
						onChange={() => db.settings.update(1, { displayPerPage: 10})}
						/> 10
				</div>
				<div id="displayPerPage_input_wrapper_20" className="flex flex-col p-1">
					<input
						className="m-1"
						type="radio"
						value="20"
						checked={storedSettings[0].displayPerPage === 20}
						onChange={() => db.settings.update(1, { displayPerPage: 20})}
						/> 20
				</div>
			</div>
		</form>
	)
}

export default UniversalSettings;