import React, { useEffect, useState} from 'react';

// --- 型定義 ---
type Ticket = {
  id: string;
  title: string;
  content: string;
  status: string;
  category?: string;
  isUrgent: boolean;
  createdAt: string;
};

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  let API_URL = 'http://localhost:4000';
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
      // @ts-ignore
      API_URL = import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    console.warn('Using default API URL');
  }

  // チケット一覧取得
  useEffect(() => {
    fetch(`${API_URL}/api/tickets`)
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error('取得エラー:', err));
  }, [refreshKey]); // refreshKeyが変わるたびに再取得

  // チケット新規作成
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setRefreshKey((prev) => prev + 1);
        alert('✅ 問い合わせを送信しました');
      } else {
        alert('❌ 送信に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('❌ エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // チケット削除
  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    
    await fetch(`${API_URL}/api/tickets/${id}`, { method: 'DELETE' });
    setRefreshKey((prev) => prev + 1);
  };

  // --- スタイル ---
  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', color: '#333' },
    header: { borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' },
    formCard: { background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e5e7eb' },
    input: { width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' as const },
    textarea: { width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', boxSizing: 'border-box' as const },
    button: { background: '#2563eb', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' as const },
    list: { listStyle: 'none', padding: 0 },
    ticketCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    statusBadge: { background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' as const },
    deleteBtn: { background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' },
    meta: { fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🚀 問い合わせ管理システム</h1>
      </header>

      {/* 新規投稿フォーム */}
      <div style={styles.formCard}>
        <h3>📝 新規問い合わせ作成</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              style={styles.input}
              type="text"
              placeholder="タイトル (例: ログインできない)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              style={styles.textarea}
              placeholder="詳細内容を入力してください..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? '送信中...' : 'チケットを作成する'}
          </button>
        </form>
      </div>

      {/* チケット一覧 */}
      <div>
        <h3>📂 問い合わせ履歴 ({tickets.length}件)</h3>
        {tickets.length === 0 ? (
          <p>まだチケットがありません。</p>
        ) : (
          <ul style={styles.list}>
            {tickets.map((ticket) => (
              <li key={ticket.id} style={styles.ticketCard}>
                <div style={styles.ticketHeader}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{ticket.title}</h4>
                  <div>
                    <span style={styles.statusBadge}>{ticket.status}</span>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(ticket.id)}>削除</button>
                  </div>
                </div>
                <p style={{ whiteSpace: 'pre-wrap', color: '#4b5563' }}>{ticket.content}</p>
                <div style={styles.meta}>
                  ID: {ticket.id} | 作成日: {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;