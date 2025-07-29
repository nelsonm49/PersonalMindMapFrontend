'use client';

export default function LandingPage() {
  return (
    <main style={{ textAlign: 'center', marginTop: '5rem', position: 'relative', minHeight: '100vh', background: '#f5f6fa' }}>
      <button
        onClick={() => window.location.href = '/login'}
        style={{
          position: 'absolute',
          right: '2rem',
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
        Login
      </button>
      <h1 style={{ marginBottom: '1rem', color: '#273c75' }}>Welcome to Personal Mind Map</h1>
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        padding: '2rem',
        maxWidth: '540px',
        margin: '0 auto 2rem auto'
      }}>
        <h2 style={{ color: '#353b48', marginBottom: '1rem' }}>Welcome to your personal mind map!</h2>
        <p style={{ marginBottom: '1.5rem', color: '#353b48' }}>
          Personal Mind Map (PMM) helps you organize your thoughts, ideas, and projects visually. Create nodes, connect concepts, and keep track of everything important in your life or work. Your data is private and secure, and you can access your mind maps anytime, anywhere.
        </p>
        <p style={{ marginBottom: '1.5rem', color: '#353b48' }}>
          <strong>Have an account already?</strong> Login using the button on the top right.<br />
          <strong>New here?</strong> Sign up right here:
        </p>
        <button
          onClick={() => window.location.href = '/signup'}
          style={{
            background: '#273c75',
            color: '#fff',
            padding: '.75rem 2rem',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          Sign Up
        </button>
      </div>
      <footer style={{
        width: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0,
        background: '#fff',
        borderTop: '1px solid #dcdde1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '2rem 5vw',
        fontSize: '1rem'
      }}>
        <div style={{ flex: 1, color: '#353b48' }}>
          <strong>All rights reserved © {new Date().getFullYear()}</strong>
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#353b48' }}>
          <strong>Contact Us</strong>
          <div style={{ marginTop: '.5rem' }}>
            <div>Email: <a href="mailto:support@personalmindmap.com" style={{ color: '#273c75' }}>support@personalmindmap.com</a></div>
            <div>LinkedIn: <a href="https://linkedin.com/company/personalmindmap" target="_blank" rel="noopener noreferrer" style={{ color: '#273c75' }}>PersonalMindMap</a></div>
            <div>Phone: <a href="tel:+1234567890" style={{ color: '#273c75' }}>+1 (234) 567-890</a></div>
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'right', color: '#353b48' }}>
          <strong>Legalities</strong>
          <div style={{ marginTop: '.5rem' }}>
            <div><a href="/privacy-policy" style={{ color: '#273c75' }}>Privacy Policy</a></div>
            <div><a href="/terms" style={{ color: '#273c75' }}>Terms &amp; Conditions</a></div>
            <div><a href="/request-data-deletion" style={{ color: '#273c75' }}>Request Data Deletion</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
