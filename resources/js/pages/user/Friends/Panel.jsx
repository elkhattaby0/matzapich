export default function Panel({ activeTab, setActiveTab, pendingRequestsCount = 0 }) {
  const formatCount = (n) => {
    if (!n || n <= 0) return null;
    if (n > 9) return '+9';
    return n;
  };

  const badgeValue = formatCount(pendingRequestsCount);

  return (
    <ul className="panelFriends">
      <li
        className={activeTab === 1 ? 'active' : ''}
        onClick={() => setActiveTab(1)}
      >
        <i className="fa-solid fa-user-group"></i> All Friends
      </li>

      <li
        className={activeTab === 2 ? 'active' : ''}
        onClick={() => setActiveTab(2)}
      >
        <span className="panel-item-with-badge">
          <span>
            <i className="fa-solid fa-user-plus"></i> Friend Requests
          </span>
          {badgeValue && <span className="badge">{badgeValue}</span>}
        </span>
      </li>

      <li
        className={activeTab === 3 ? 'active' : ''}
        onClick={() => setActiveTab(3)}
      >
        <i className="fa-solid fa-compass"></i> Suggestions
      </li>

      <li
        className={activeTab === 4 ? 'active' : ''}
        onClick={() => setActiveTab(4)}
      >
        <i className="fa-solid fa-cake-candles"></i> Birthdays
      </li>
    </ul>
  );
}
