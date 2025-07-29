'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/mindmap');
      } else {
        try {
          const data = await res.json();
          setError(data.message);
        } catch (err) {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function go() {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/mindmap');
    } else {
      try {
        const data = await res.json();
        setError(data.message);
      } catch (err) {
        setError(err.message);
      }
    }
  }
  // go();

  function goHome() {
    router.push('/');
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f5f6fa',
      position: 'relative'
    }}>
      <button
        onClick={goHome}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: '#fff',
          color: '#273c75',
          border: '1px solid #dcdde1',
          borderRadius: '5px',
          padding: '.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        Home
      </button>
      <div style={{
        background: '#fff',
        padding: '2rem 3rem',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        minWidth: '320px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2f3640' }}>Login</h1>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '5px',
                border: '1px solid #dcdde1',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '5px',
                border: '1px solid #dcdde1',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: '#273c75',
              color: '#fff',
              padding: '.75rem',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
