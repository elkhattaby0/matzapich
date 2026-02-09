// resources/js/pages/user/Profile.jsx

import { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import SettingsModal from './SettingsModal';

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  return (
    <main className="profile-page">
      <div className="Profile">
        <div className="content">
          <Sidebar onOpenSettings={openSettings} />
          <MainContent />
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={closeSettings}
        />
      </div>
    </main>
  );
}
