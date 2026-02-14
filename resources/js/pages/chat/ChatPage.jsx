// resources/js/pages/chat/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../../components/common/Chat';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const ChatPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated, conversationId]);

  const loadConversations = async () => {
    try {
      const res = await axios.get('/api/user/conversations', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = res.data;
      const list = data.conversations || [];

      setConversations(list);

      if (list.length === 0) {
        setSelectedConversation(null);
        return;
      }

      if (conversationId) {
        const conv = list.find((c) => String(c.id) === String(conversationId));
        setSelectedConversation(conv || null);
      } else {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error(
        'Failed to load conversations:',
        error.response?.data || error
      );
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/user/chat/${conversation.id}`);
  };

  if (!user) {
    return (
      <div className="chat-loading">Loading chat...</div>
    );
  }

  const appUrl =
    import.meta.env.VITE_APP_URL ||
    import.meta.env.VITE_API_URL ||
    '';

  return (
    <main className="pageFriends pageChat">
      <section>
        <div className="panelFriends chatPanelList">
          <div className="chatLeftHeader">
            <h1>Messages</h1>
          </div>
          <div className="chatListHeader">
            <h3>Conversations</h3>
            <span>{conversations.length} total</span>
          </div>

          <div className="chatListBody">
            {conversations.map((conv) => {
              const isActive = selectedConversation?.id === conv.id;
              const otherUser = conv.participants?.find(
                (p) => String(p.id) !== String(user?.id)
              );
              const otherName = otherUser
                ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`
                    .trim()
                : conv.name || `Conversation #${conv.id}`;
              const avatarUrl = otherUser?.avatar
                ? `${appUrl}/storage/${otherUser.avatar}`
                : `${appUrl}/storage/avatars/noavatar.png`;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`chatConvItem${isActive ? ' active' : ''}`}
                >
                  <div className="chatConvRow">
                    <img
                      src={avatarUrl}
                      alt={otherName || 'User'}
                      className="chatConvAvatar"
                    />
                    <div className="chatConvText">
                      <div className="chatConvTitle">
                        {otherName || `Conversation #${conv.id}`}
                      </div>
                      {conv.last_message && (
                        <div className="chatConvLastMsg">
                          {(conv.last_message.content || '').substring(0, 40)}
                          ...
                        </div>
                      )}
                      <div className="chatConvTime">
                        {conv.updated_at
                          ? new Date(conv.updated_at).toLocaleString('en-GB')
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {conversations.length === 0 && (
              <div className="chatListEmpty">
                No conversations yet.
                <br />
                Start a chat from your friends page.
              </div>
            )}
          </div>
        </div>

        <div className="Content chatContent">
          <div className="chatPanel">
            {selectedConversation ? (
              <>
                {(() => {
                  const otherUser = selectedConversation.participants?.find(
                    (p) => String(p.id) !== String(user?.id)
                  );
                  const otherName = otherUser
                    ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`
                        .trim()
                    : `Conversation #${selectedConversation.id}`;
                  const avatarUrl = otherUser?.avatar
                    ? `${appUrl}/storage/${otherUser.avatar}`
                    : `${appUrl}/storage/avatars/noavatar.png`;
                  return (
                    <div className="chatRightHeader">
                      <img
                        src={avatarUrl}
                        alt={otherName || 'User'}
                        className="chatRightAvatar"
                      />
                      <div className="chatRightMeta">
                        <div className="chatRightTitle">
                          {otherName || `Conversation #${selectedConversation.id}`}
                        </div>
                        <div className="chatRightSub">End-to-end encrypted</div>
                      </div>
                    </div>
                  );
                })()}
                <Chat
                  conversationId={selectedConversation.id}
                  token={authToken}
                />
              </>
            ) : (
              <div className="chatPlaceholder">
                <div className="chatPlaceholderIcon">...</div>
                <div className="chatPlaceholderTitle">
                  Select a conversation
                </div>
                <div className="chatPlaceholderText">
                  Choose a conversation on the left or start a new one from
                  your friends page.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChatPage;
