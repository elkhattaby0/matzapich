import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';

export default function AllFriendContent({ data }) {
  const navigate = useNavigate();

  const handleMessage = async (userId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post(
        '/api/conversations/start',
        { user_id: userId },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
      const conv = res.data?.conversation;
      if (conv?.id) {
        navigate(`/user/chat/${conv.id}`);
      } else {
        console.error('Conversation not returned:', res.data);
      }
    } catch (err) {
      console.error('Start conversation failed:', err.response?.data || err);
    }
  };

  return (
    <div className="Content">
      <div>
        <h2>Your Friends { data.length > 0 && `(${data.length})`}</h2>
      </div>

      {data.length === 0 ? (
        <p>You don't have any friends yet. Start connecting with people you know.</p>
      ) : (
        <div className="FriendRequests">
          {data.map((n) => (
            <Card
              key={n.id}
              id={n.id}
              img={n.avatar || ''}
              name={`${n.firstName} ${n.lastName}`}
              nbrFriends={n.mutual_count ?? 0}
              tab={1}
              onMessage={handleMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
