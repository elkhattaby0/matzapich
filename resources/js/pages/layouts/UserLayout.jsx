import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';

import Header from '../user/Header';
import Footer from '../../components/layout/Footer';
import Side from '../user/Side';

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
  };

  const closeSide = () => {
    setSideOpen(false);
  };

  const UserMenu = () => (
    <ul className="usermenu">
      <li
        onClick={() => {
          navigate('/');
          closeSide();
        }}
      >
        <i className="fa-solid fa-user"></i> View your profile
      </li>

      <li><i className="fa-solid fa-heart"></i> Invite friends</li>

      <li><i className="fa-solid fa-bookmark"></i> Bookmarks</li>

      <li
        onClick={() => {
          navigate('/user/settings');
          closeSide();
        }}
      >
        <i className="fa-solid fa-gear"></i> Settings
      </li>

      <li
        onClick={async () => {
          await handleLogout();
          closeSide();
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
      </li>
    </ul>
  );


  const renderSideContent = () => {
    switch (sideContent) {
      case 'menu':
      default:
        return <UserMenu />;
    }
  };

  return (
    <>
      <Header onOpenSide={openSide} />

      <nav style={{ display: 'none'}} className="mobileNavBtm">
        <NavLink
            to="/user"
            className={({ isActive }) => (isActive ? 'active' : '')}
            end 
          >
            <i className="fa-solid fa-house"></i>
          </NavLink>

          <NavLink
            to="/user/friends"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <div className="nav-icon-with-badge">
              <i className="fa-solid fa-user-group"></i>
              {/*{badgeValue && (
                <span className="badge">{badgeValue}</span>
              )}*/}
            </div>
          </NavLink>

          <NavLink to="/">
            <i className="fa-solid fa-comment-dots"></i>
          </NavLink>

          <NavLink to="/">
            <i className="fa-solid fa-bell"></i>
          </NavLink>
      </nav>

      <Side title={sideTitle} isOpen={sideOpen} onClose={closeSide}>
        {renderSideContent()}
      </Side>

      <Outlet />
      <Footer />
    </>
  );
}
