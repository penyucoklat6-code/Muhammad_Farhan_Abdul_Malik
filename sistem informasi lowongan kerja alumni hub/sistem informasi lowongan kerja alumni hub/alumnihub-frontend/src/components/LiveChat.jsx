import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, X, Send, ArrowLeft, Users, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api, { STORAGE_URL } from '../services/api';

const LiveChat = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch unread count periodically
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/chat/unread-count');
        if (res.data.success) setUnreadTotal(res.data.data.count);
      } catch (err) { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch chat users when panel opens
  useEffect(() => {
    if (isOpen && !activeChat) fetchChatUsers();
  }, [isOpen, activeChat]);

  // Poll messages when in active chat
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      pollRef.current = setInterval(() => fetchMessages(activeChat.id), 5000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/chat/users');
      if (res.data.success) setChatUsers(res.data.data);
    } catch (err) { console.error('Failed to fetch chat users', err); }
    finally { setLoadingUsers(false); }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/chat/messages/${userId}`);
      if (res.data.success) setMessages(res.data.data);
      // Mark as read
      await api.put(`/chat/read/${userId}`);
    } catch (err) { console.error('Failed to fetch messages', err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;
    setSending(true);
    try {
      const res = await api.post('/chat/send', { receiver_id: activeChat.id, message: newMessage.trim() });
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        setNewMessage('');
      }
    } catch (err) { console.error('Failed to send message', err); }
    finally { setSending(false); }
  };

  const openChat = (chatUser) => {
    setActiveChat(chatUser);
    setMessages([]);
  };

  const backToList = () => {
    setActiveChat(null);
    clearInterval(pollRef.current);
    fetchChatUsers();
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredUsers = chatUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="position-fixed d-flex align-items-center justify-content-center border-0 shadow-lg"
        style={{
          bottom: '24px', right: '24px', width: '56px', height: '56px',
          borderRadius: '50%', background: 'var(--primary)', color: '#fff',
          zIndex: 1030, cursor: 'pointer', transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && unreadTotal > 0 && (
          <span className="position-absolute d-flex align-items-center justify-content-center" style={{
            top: '-4px', right: '-4px', width: '22px', height: '22px',
            borderRadius: '50%', background: '#EF4444', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700
          }}>
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="position-fixed shadow-lg d-flex flex-column" style={{
          bottom: '90px', right: '24px', width: '360px', maxHeight: '500px',
          borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
          border: '1px solid var(--border)', zIndex: 1030, overflow: 'hidden'
        }}>
          {/* Header */}
          <div className="d-flex align-items-center gap-2 px-4 py-3" style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', flexShrink: 0
          }}>
            {activeChat && (
              <button onClick={backToList} className="btn p-0 border-0 shadow-none" style={{ color: '#fff' }}>
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem' }}>
                {activeChat ? activeChat.name : 'Live Chat'}
              </h6>
              {activeChat && <small style={{ opacity: 0.8, fontSize: '0.75rem' }}>{activeChat.role}</small>}
            </div>
            <button onClick={() => setIsOpen(false)} className="btn p-0 border-0 shadow-none" style={{ color: '#fff' }}>
              <X size={18} />
            </button>
          </div>

          {!activeChat ? (
            /* User List */
            <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', maxHeight: '400px' }}>
              <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: 'var(--light)', border: '1px solid var(--border)' }}>
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Cari pengguna..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 shadow-none flex-grow-1" style={{ background: 'transparent', outline: 'none', fontSize: '0.8rem', color: 'var(--text-main)' }} />
                </div>
              </div>
              {loadingUsers ? (
                <div className="text-center py-5"><div className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></div></div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <Users size={32} style={{ color: 'var(--text-muted)', opacity: 0.3 }} className="mb-2" />
                  <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>Tidak ada pengguna ditemukan</p>
                </div>
              ) : (
                filteredUsers.map((cu) => (
                  <button key={cu.id} onClick={() => openChat(cu)}
                    className="d-flex align-items-center gap-3 w-100 text-start border-0 px-4 py-3"
                    style={{ background: 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.85rem', overflow: 'hidden' }}>
                      {cu.avatar ? <img src={`${STORAGE_URL}/${cu.avatar}`} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        : cu.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-truncate" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{cu.name}</span>
                        {cu.unread_count > 0 && (
                          <span className="d-flex align-items-center justify-content-center flex-shrink-0" style={{
                            width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 700
                          }}>{cu.unread_count}</span>
                        )}
                      </div>
                      <p className="mb-0 text-truncate" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {cu.last_message || `${cu.role} — Klik untuk mulai chat`}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Messages View */
            <>
              <div className="flex-grow-1 p-3 d-flex flex-column gap-2" style={{ overflowY: 'auto', maxHeight: '340px', background: 'var(--light)' }}>
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <MessageCircle size={28} style={{ color: 'var(--text-muted)', opacity: 0.3 }} className="mb-2" />
                    <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>Belum ada pesan. Mulai percakapan!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`d-flex ${msg.is_mine ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className="px-3 py-2" style={{
                        maxWidth: '80%', borderRadius: msg.is_mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.is_mine ? 'var(--primary)' : 'var(--bg-card)',
                        color: msg.is_mine ? '#fff' : 'var(--text-main)',
                        border: msg.is_mine ? 'none' : '1px solid var(--border)',
                        fontSize: '0.85rem', lineHeight: 1.5, wordBreak: 'break-word'
                      }}>
                        {msg.message}
                        <div style={{ fontSize: '0.65rem', opacity: 0.6, textAlign: 'right', marginTop: '2px' }}>
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="d-flex align-items-center gap-2 p-3" style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan..." className="form-control border-0 shadow-none py-2 px-3"
                  style={{ background: 'var(--light)', borderRadius: 'var(--radius-xl)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                  autoFocus />
                <button type="submit" disabled={sending || !newMessage.trim()}
                  className="btn d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: 'none', opacity: newMessage.trim() ? 1 : 0.5 }}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;
