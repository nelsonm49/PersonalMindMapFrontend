'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

export default function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleSignUp(e) {
        e.preventDefault();

        if (email !== confirmEmail) {
            setError('Emails do not match');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');

        try {
            const res = await fetch(`${apiUrl}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
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
        } catch (err) {
            setError('Network error: Unable to reach the server.');
        }
    }

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
            minWidth: '340px'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2f3640' }}>Sign Up</h1>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
                <label htmlFor="firstName" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>First Name</label>
                <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
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
                <label htmlFor="lastName" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Last Name</label>
                <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
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
                <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Email Address</label>
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
                <label htmlFor="confirmEmail" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Confirm Email Address</label>
                <input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={e => setConfirmEmail(e.target.value)}
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
                <label htmlFor="rawPpasswordassword" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Password</label>
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
            <div>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '.5rem', color: '#353b48' }}>Confirm Password</label>
                <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
                cursor: 'pointer',
                marginTop: '1rem'
                }}
            >
                Sign Up
            </button>
            </form>
        </div>
        </main>
    );
}
