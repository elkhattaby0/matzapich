import { useState } from 'react';

import MainContent from './MainContent';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';

export default function Profile() {
    const [showSettings, setShowSettings] = useState(false);


    return (
        <div className="Profile">
            <div className='content'>
                <Sidebar />
                <MainContent />
            </div>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

        </div>
    );
}
