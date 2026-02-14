// resources/js/components/common/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import echo from '../../utils/echo';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const chatStyles = {
  container: {
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  messagesWrapper: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f6f8fb',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  bubbleBase: {
    maxWidth: '72%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '14px',
    boxShadow: '0 4px 10px rgba(15,23,42,0.08)',
  },
  bubbleOutgoing: {
    backgroundColor: 'var(--blue)',
    color: '#ffffff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '6px',
  },
  bubbleIncoming: {
    backgroundColor: '#ffffff',
    color: '#111827',
    alignSelf: 'flex-start',
    border: '1px solid #e5e7eb',
    borderBottomLeftRadius: '6px',
  },
  messageText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
  timestamp: {
    display: 'block',
    marginTop: '6px',
    fontSize: '11px',
    opacity: 0.75,
    textAlign: 'right',
  },
  inputBar: {
    padding: '10px 12px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    borderRadius: '9999px',
    border: '1px solid #d1d5db',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
  },
  inputFocused: {
    border: '1px solid #6366f1',
    boxShadow: '0 0 0 2px rgba(99,102,241,0.2)',
  },
  button: {
    borderRadius: '9999px',
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'var(--blue)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'default',
  },
};

const Chat = ({ conversationId, token }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);

  // Load history + subscribe to realtime
  useEffect(() => {
    if (!conversationId || !token) return;

    // Initial load
    axios
      .get(`/api/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        const msgs = toArray(res.data?.data ?? res.data);
        setMessages(msgs);
      })
      .catch((err) => {
        console.error('Load messages failed:', err.response?.data || err);
      });

    // Realtime subscription
    const channelName = `conversation.${conversationId}`;

    const channel = echo
      .private(channelName)
      .listen('.MessageSent', (e) => {
        if (e.message) {
          setMessages((prev) => [...toArray(prev), e.message]);
        }
      });

    return () => {
      channel.stopListening('MessageSent');
      echo.leave(`private-${channelName}`);
    };
  }, [conversationId, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !token) return;

    try {
      const response = await axios.post(
        `/api/conversations/${conversationId}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data?.message) {
        // Show my message immediately; others get via broadcast
        setMessages((prev) => [...toArray(prev), response.data.message]);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Send failed:', error.response?.data || error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentUserId = user?.id;

  return (
    <div style={chatStyles.container}>
      {/* Messages */}
      <div style={chatStyles.messagesWrapper}>
        {toArray(messages).map((msg) => {
          const isMe = currentUserId && msg.sender_id === currentUserId;

          const bubbleStyle = {
            ...chatStyles.bubbleBase,
            ...(isMe
              ? chatStyles.bubbleOutgoing
              : chatStyles.bubbleIncoming),
          };

          return (
            <div
              key={msg.id}
              style={{
                ...chatStyles.messageRow,
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={bubbleStyle}>
                <p style={chatStyles.messageText}>
                  {msg.content ?? '[Encrypted]'}
                </p>
                <span style={chatStyles.timestamp}>
                  {new Date(msg.created_at).toLocaleTimeString('en-GB')}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={chatStyles.inputBar}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Type a message..."
          maxLength={1000}
          style={{
            ...chatStyles.input,
            ...(inputFocused ? chatStyles.inputFocused : {}),
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          style={{
            ...chatStyles.button,
            ...(!newMessage.trim() ? chatStyles.buttonDisabled : {}),
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

