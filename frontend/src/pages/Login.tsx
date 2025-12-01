import { useState } from 'react';
import { apiClient } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

export const UserRole = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  CUSTOMER: 'CUSTOMER',
} as const;

export const Login = () => {
  const [email, setEmail] = useState('admin@example.com'); // デバッグ用に初期値を入れておく
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('api/auth/login', { email, password });
      console.log('Login success!', response.data);
      const role = response.data.user.role;
      
      switch (role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.OPERATOR:
          navigate('/operator/tasks');
          break;
        case UserRole.CUSTOMER:
          navigate('/mypage');
          break;
        default:
          navigate('/');
          break;
      }

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('ログインに失敗しました。メールアドレスかパスワードを確認してください。');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>問い合わせ管理システム</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          ログイン
        </button>
      </form>
    </div>
  );
};