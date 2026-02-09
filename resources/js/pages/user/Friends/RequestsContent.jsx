import { useState, useEffect } from 'react';
import Card from './Card';
import { friendshipApi } from '../../../utils/api';

export default function RequestsContent({ data }) {
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleConfirm = async (friendshipId) => {
    try {
      await friendshipApi.accept(friendshipId);
      setItems((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (friendshipId) => {
    try {
      await friendshipApi.reject(friendshipId);
      setItems((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="Content">
      <div>
        <h2>Friend Requests</h2>
        <p>Manage people who want to connect with you</p>
      </div>

      {items.length === 0 ? (
        <p>No friend requests right now. When someone sends you a request, it will appear here.</p>
      ) : (
        <div className="FriendRequests">
          {items.map((n) => (
            <Card
              key={n.id}
              id={n.id}
              img={n.requester?.avatar || ''}
              name={`${n.requester?.firstName ?? ''} ${n.requester?.lastName ?? ''}`}
              nbrFriends={0}
              tab={2}
              onConfirm={handleConfirm}
              onDeleteRequest={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
