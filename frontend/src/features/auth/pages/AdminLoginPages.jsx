import { useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('adminToken', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch {
      setError('Tidak bisa konek ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Pickarya Admin</h2>
        <p style={styles.sub}>Halaman khusus admin</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input style={styles.input} type="text" placeholder="Username"
            value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', borderRadius: 12, padding: '40px 32px', width: 340, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' },
  sub: { color: '#888', marginTop: 4, marginBottom: 24, fontSize: 14 },
  error: { color: '#e53e3e', fontSize: 14, marginBottom: 12 },
  input: { width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '11px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};