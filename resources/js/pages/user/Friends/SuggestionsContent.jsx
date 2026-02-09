import { useState, useEffect } from 'react';
import Card from './Card';
import { friendshipApi } from '../../../utils/api';

export default function SuggestionsContent({ data }) {
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleAddFriend = async (userId) => {
    try {
      await friendshipApi.sendRequest(userId);
      setItems((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      console.error('sendRequest error', e);
    }
  };

  const handleRemove = (userId) => {
    setItems((prev) => prev.filter((u) => u.id !== userId));
  };
  
  return (
    <div className="Content">
      <div>
        <h2>People you may know</h2>
      </div>

      {items.length === 0 ? (
        <p>No suggestions for now. Add more friends to see people you may know.</p>
      ) : (
        <div className="FriendRequests">
          {items.map((n) => (
            <Card
              key={n.id}
              id={n.id}
              img={n.avatar || n.avatar_url || n.profile_photo_url || ''}
              name={`${n.firstName} ${n.lastName}`}
              nbrFriends={n.mutual_friends_count ?? n.nbr ?? 0}
              tab={3}
              onAddFriend={handleAddFriend}
              onRemoveSuggestion={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
