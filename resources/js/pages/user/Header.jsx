import { useState, useEffect } from 'react';
import '../../../css/user.css';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { NavLink } from 'react-router-dom';
import { friendshipApi } from '../../utils/api';

export default function Header({ onOpenSide }) {
  const { user } = useAuth();
  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);

  const avatarUrl = user?.avatar
    ? `${APP_URL}/storage/${user.avatar}`
    : `${APP_URL}/storage/avatars/noavatar.png`; // fallback

  const formatCount = (n) => {
    if (!n || n <= 0) return null;
    if (n > 9) return '+9';
    return n;
  };

  useEffect(() => {
    let ignore = false;

    const fetchPending = async () => {
      try {
        setLoadingCount(true);
        const data = await friendshipApi.getFriendRequests();
        const count = Array.isArray(data) ? data.length : 0;

        if (!ignore) {
          setPendingRequestsCount(count);
        }
      } catch (e) {
        console.error('Error fetching pending requests', e);
        if (!ignore) setPendingRequestsCount(0);
      } finally {
        if (!ignore) setLoadingCount(false);
      }
    };

    fetchPending();

    return () => {
      ignore = true;
    };
  }, []);

  const badgeValue = formatCount(pendingRequestsCount);

  return (
    <header>
      <nav>
        <section>
          <Logo />

          <div className="searchField">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              placeholder="Search..."
            />
          </div>
        </section>

        <section>
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
              {badgeValue && (
                <span className="badge">{badgeValue}</span>
              )}
            </div>
          </NavLink>

          <NavLink to="/">
            <i className="fa-solid fa-comment-dots"></i>
          </NavLink>

          <NavLink to="/">
            <i className="fa-solid fa-bell"></i>
          </NavLink>
        </section>

        <section>
          <button
            onClick={() => {
              onOpenSide('Menu', 'menu');
            }}
          >
            <img
              src={avatarUrl}
              alt={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            />
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </section>
      </nav>
    </header>
  );
}
