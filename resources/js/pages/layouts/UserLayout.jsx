import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import Header from '../user/Header';
import Footer from '../../components/layout/Footer';
import Profile from '../user/Profile';
import Side from '../user/Side';
import Settings from '../user/Settings';
import AvatarUploader from '../../components/AvatarUploader';
import axios from 'axios';

export default function UserLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const [sideTitle, setSideTitle] = useState('Menu');
  const [sideContent, setSideContent] = useState('menu');

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
  };

  const openSide = (title, contentKey) => {
    setSideTitle(title);
    setSideContent(contentKey);
    setSideOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSide = () => {
    setSideOpen(false);
    document.body.style.overflow = '';
  };

  const UserMenu = () => (
    <ul className="usermenu">
      <li><i className="fa-solid fa-user"></i> View your profile</li>
      <li><i className="fa-solid fa-heart"></i> Invite friends</li>
      <li><i className="fa-solid fa-bookmark"></i> Bookmarks</li>
      <li onClick={() => openSide('Settings', 'settings')}>
        <i className="fa-solid fa-gear"></i> Settings
      </li>
      <li onClick={handleLogout}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
      </li>
    </ul>
  );

  

  const renderSideContent = () => {
    switch (sideContent) {
      case 'settings':
        return <Settings onClose={closeSide} />;
      case 'menu':
      default:
        return <UserMenu />;
    }
  };

  return (
    <>
      <Header onOpenSide={openSide} />
      <Profile />
      <Side title={sideTitle} isOpen={sideOpen} onClose={closeSide}>
        {renderSideContent()}
      </Side>
      <Footer />
    </>
  );
}
