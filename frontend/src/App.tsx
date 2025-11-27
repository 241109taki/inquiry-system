// import React, { useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card"

// --- 型定義 ---
// type Ticket = {
//   id: string;
//   title: string;
//   content: string;
//   status: string;
//   category?: string;
//   isUrgent: boolean;
//   createdAt: string;
// };

const UsersList = () => <h2>ユーザー一覧画面（ログイン済み専用）</h2>;

function App() {
  // const [tickets, setTickets] = useState<Ticket[]>([]);
  // const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [refreshKey, setRefreshKey] = useState(0);

  // let API_URL = 'http://localhost:4000';
  // try {
  //   // @ts-ignore
  //   if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
  //     // @ts-ignore
  //     API_URL = import.meta.env.VITE_API_URL;
  //   }
  // } catch (e) {
  //   console.warn('Using default API URL');
  // }

//   useEffect(() => {
//   // アプリ起動時に「/auth/me」などを叩いてユーザー情報を取得
//   apiClient.get('/auth/me')
//     .then(res => setUser(res.data))
//     .catch(() => setUser(null));
// }, []);

  // チケット一覧取得
  // useEffect(() => {
  //   fetch(`${API_URL}/api/tickets`)
  //     .then((res) => res.json())
  //     .then((data) => setTickets(data))
  //     .catch((err) => console.error('取得エラー:', err));
  // }, [refreshKey]); // refreshKeyが変わるたびに再取得

  // // チケット新規作成
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch(`${API_URL}/api/tickets`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ title, content }),
  //     });

  //     if (res.ok) {
  //       setTitle('');
  //       setContent('');
  //       setRefreshKey((prev) => prev + 1);
  //       alert('✅ 問い合わせを送信しました');
  //     } else {
  //       alert('❌ 送信に失敗しました');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert('❌ エラーが発生しました');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // チケット削除
  // const handleDelete = async (id: string) => {
  //   if (!confirm('本当に削除しますか？')) return;
    
  //   await fetch(`${API_URL}/api/tickets/${id}`, { method: 'DELETE' });
  //   setRefreshKey((prev) => prev + 1);
  // };
  // return (
  //   <div className="max-w-2xl mx-auto p-6 space-y-10">
  //     <header className="w-full border-b bg-white">
  //       <div className="max-w-4xl mx-auto py-4 px-4">
  //         <h1  className="text-2xl font-semibold tracking-tight">問い合わせ管理システム</h1>
  //       </div>
  //     </header>
  //     <main className="max-w-4xl mx-auto mt-8 px-4">
  //       {/* 新規投稿フォーム */}
  //       <Card className="p-6 space-y-6 gap-0">
  //         <div>
  //           <h2 className="text-xl font-semibold">📝 新規問い合わせ作成</h2>
  //         </div>
  //         <CardContent className="pt-0 space-y-4">
  //           <form onSubmit={handleSubmit} className="space-y-6 mt-2">
  //             <div className="flex flex-col gap-3">
  //               <input
  //                 type="text"
  //                 placeholder="タイトル (例: ログインできない)"
  //                 value={title}
  //                 onChange={(e) => setTitle(e.target.value)}
  //                 required
  //                 className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>
  //             <div>
  //               <textarea
  //                 placeholder="詳細内容を入力してください..."
  //                 value={content}
  //                 onChange={(e) => setContent(e.target.value)}
  //                 required
  //                 className="w-full rounded-md border border-gray-300 p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>
  //             <Button type="submit" disabled={loading} className="w-full font-bold">
  //               {loading ? '送信中...' : '送信する'}
  //             </Button>
  //           </form>
  //         </CardContent>
  //       </Card>

  //       {/* チケット一覧 */}
  //       <div className="space-y-4 mt-6">
  //         <h3 className="text-xl font-semibold">📂 問い合わせ履歴 ({tickets.length}件)</h3>
  //         {tickets.length === 0 ? (
  //           <p className="text-gray-500">まだ問い合わせがありません。</p>
  //         ) : (
  //           <ul className="space-y-4">
  //             {tickets.map((ticket) => (
  //               <li key={ticket.id} className="border p-4 rounded-lg bg-white shadow-sm">
  //                 <div className="flex justify-between items-start mb-2">
  //                   <h4 className="text-lg font-semibold">{ticket.title}</h4>
  //                   <div className="flex items-center gap-2">
  //                     <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{ticket.status}</span>
  //                     <button 
  //                     onClick={() => handleDelete(ticket.id)}
  //                     className="text-red-500 text-sm underline hover:text-red-700">
  //                       削除
  //                     </button>
  //                   </div>
  //                 </div>
  //                 <p className="whitespace-pre-wrap text-gray-700 mb-2">{ticket.content}</p>
  //                 <div className="text-xs text-gray-500">
  //                   ID: {ticket.id} | 作成日: {new Date(ticket.createdAt).toLocaleString()}
  //                 </div>
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UsersList />} />
        
        {/* デフォルトはログイン画面へ転送 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;