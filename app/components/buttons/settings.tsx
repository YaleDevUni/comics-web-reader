import React, { useState } from 'react';
import { Props, Settings, SettingsContextType } from '../../utils/interfaces';

const defaultSettings: Settings = {
	reversed: false,
	doublePage: false,
	darkmode: false,
};

export const SettingsContext = React.createContext<SettingsContextType>({
	settings: defaultSettings,
	setSettings: () => {},
});

const SettingsProvider: React.FC<Props> = ({ children }: Props) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

	return (
		<SettingsContext.Provider value={{ settings, setSettings}}>
			{children}
		</SettingsContext.Provider>
	);
};

export const SettingsButton: React.FC<Props> = ({ children }: Props) => {
	return (
		<div>
			{children}
		</div>
	)
}

// export default SettingsProvider;
export default SettingsButton;