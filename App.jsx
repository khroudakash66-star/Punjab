import React, { useState, useEffect } from 'react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // 2 ਸਕਿੰਟ ਬਾਅਦ ਲੋਗੋ ਹਟ ਕੇ ਮੇਨ ਐਪ ਖੁੱਲ੍ਹ ਜਾਵੇਗੀ
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div style={{
        backgroundColor: '#000000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif'
      }}>
        {/* ਕਲਰਫੁੱਲ ਪੰਜਾਬੀ ਲੋਗੋ */}
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff007f, #ff8c00, #40e0d0, #9370db)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '5px',
          letterSpacing: '2px'
        }}>
          ਪੰਜਾਬ
        </div>

        {/* ਇੰਗਲਿਸ਼ ਵਿੱਚ ਛੋਟੇ ਅੱਖਰਾਂ ਵਿੱਚ 'punjab' */}
        <div style={{
          fontSize: '18px',
          color: '#ffffff',
          letterSpacing: '4px',
          textTransform: 'lowercase',
          opacity: 0.8
        }}>
          punjab
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h2 style={{ 
          margin: 0, 
          background: 'linear-gradient(45deg, #ff8c00, #40e0d0)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          ਪੰਜਾਬ (Punjab)
        </h2>
        <span>🔔</span>
      </header>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3>ਜੀ ਆਇਆਂ ਨੂੰ! (Welcome)</h3>
        <p style={{ color: '#aaa' }}>ਤੁਹਾਡੀ ਆਪਣੀ ਪੰਜਾਬੀ ਐਪ ਤਿਆਰ ਹੈ।</p>
      </div>
    </div>
  );
}
