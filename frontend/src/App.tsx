import React, { useEffect, useState} from 'react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <header>
        <h1  className="text-3xl font-bold mb-4">問い合わせ管理システム</h1>
      </header>

      {/* 新規投稿フォーム */}
      <Card className="p-6 space-y-6">
        <CardHeader className="pb-0">
          <CardTitle>📝 新規問い合わせ作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="タイトル (例: ログインできない)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <textarea
                placeholder="詳細内容を入力してください..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full font-bold">
              {loading ? '送信中...' : 'チケットを作成する'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* チケット一覧 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">📂 問い合わせ履歴 ({tickets.length}件)</h3>
        {tickets.length === 0 ? (
          <p className="text-gray-500">まだチケットがありません。</p>
        ) : (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{ticket.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{ticket.status}</span>
                    <button 
                    onClick={() => handleDelete(ticket.id)}
                    className="text-red-500 text-sm underline hover:text-red-700">
                      削除
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 mb-2">{ticket.content}</p>
                <div className="text-xs text-gray-500">
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