import { useState } from 'react';
import BgCard from '../../../components/common/BgCard';

export default function Card({
  id,
  img,
  name,
  nbrFriends,
  tab,
  onConfirm,
  onDeleteRequest,
  onAddFriend,
  onRemoveSuggestion,
}) {
  const [loadingAction, setLoadingAction] = useState(null); 
  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

  const handleClick = async (type, fn) => {
    if (!fn) return;
    try {
      setLoadingAction(type);
      await fn(id);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <BgCard tag="cardusers" key={id}>
      <img
        src={img ? `${APP_URL}/storage/${img}` : '/storage/avatars/noavatar.png'}
        alt={name}
      />

      <div className="txt">
        {name && <p className="name">{name}</p>}
        {typeof nbrFriends === 'number' && nbrFriends !== 0 && (
          <p className="nbrFriends">{nbrFriends} mutual friends</p>
        )}
      </div>

      {(() => {
        switch (tab) {
          case 2:
            return (
              <div className="btns">
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleClick('confirm', onConfirm)}
                >
                  {loadingAction === 'confirm' ? 'Confirming...' : 'Confirm'}
                </button>
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleClick('delete', onDeleteRequest)}
                >
                  {loadingAction === 'delete' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            );
          case 3:
            return (
              <div className="btns">
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleClick('add', onAddFriend)}
                >
                  {loadingAction === 'add' ? 'Adding...' : 'Add friend'}
                </button>
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleClick('remove', onRemoveSuggestion)}
                >
                  {loadingAction === 'remove' ? 'Removing...' : 'Remove'}
                </button>
              </div>
            );
          default:
            return null;
        }
      })()}
    </BgCard>
  );
}
