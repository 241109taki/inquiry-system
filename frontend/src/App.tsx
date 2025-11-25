import { useEffect, useState } from 'react';

// APIから受け取るデータの型定義
type ApiResponse = {
  message: string;
  timestamp: string;
};

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 画面が表示されたらAPIを叩く
  useEffect(() => {
    // Vite環境(import.meta.env) が使えるか確認し、使えなければlocalhostをデフォルトにする安全策
    let apiUrl = 'http://localhost:4000';
    try {
      // @ts-ignore: プレビュー環境での型エラー回避
      if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
        // @ts-ignore
        apiUrl = import.meta.env.VITE_API_URL;
      }
    } catch (e) {
      console.warn('Environment variables not available, using default.');
    }

    fetch(`${apiUrl}/api`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // スタイル定義（CSSファイルを読み込まずに動作させるためインラインで定義）
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      textAlign: 'center' as const,
      fontFamily: 'sans-serif',
    },
    card: {
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      marginTop: '2rem',
      border: '1px solid #e5e7eb',
    },
    successBox: {
      backgroundColor: '#dcfce7',
      border: '1px solid #86efac',
      borderRadius: '6px',
      padding: '1rem',
      color: '#166534',
    },
    errorBox: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '6px',
      padding: '1rem',
      color: '#991b1b',
    },
    loading: {
      color: '#6b7280',
    },
    timestamp: {
      fontSize: '0.875rem',
      marginTop: '0.5rem',
      color: '#15803d',
    }
  };

  return (
    <div style={styles.container}>
      <h1>問い合わせ管理システム</h1>
      <div style={styles.card}>
        <h2>🔌 Backend接続テスト</h2>
        
        {loading ? (
          <p style={styles.loading}>Backendに接続中...</p>
        ) : error ? (
          <div style={styles.errorBox}>
            <p><strong>⚠️ API接続エラー</strong></p>
            <p>Backendが起動しているか確認してください (Port 4000)</p>
            <p style={{fontSize: '0.8rem', marginTop: '5px'}}>詳細: {error}</p>
          </div>
        ) : data ? (
          <div style={styles.successBox}>
            <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{data.message}</p>
            <p style={styles.timestamp}>サーバー時刻: {data.timestamp}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;