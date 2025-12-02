import { useState } from 'react';
import { apiClient } from '@/lib/axios';

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // APIへPOST送信
      await apiClient.post('/tickets', {
        title,
        content,
      });
      setMessage('問い合わせを送信しました！');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      setMessage('送信に失敗しました。');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規お問い合わせ作成</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
            placeholder="ログインできません"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">お問い合わせ内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
            placeholder="詳細な状況をご記入ください..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          送信する
        </button>
      </form>
      
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}