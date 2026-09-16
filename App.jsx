import React, { useState, useEffect } from 'react';

export default function PunjabApp() {
  // One-time Signup / Login Memory
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('punjab_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'create', 'profile', 'settings'
  
  // Posts State
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'ਜਤਿੰਦਰ ਸਿੰਘ',
      village: 'ਪਿੰਡ ਧਾਰੀਵਾਲ',
      type: 'culture',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦਾ ਪੁਰਾਣਾ ਵਿਰਸਾ ਅਤੇ ਸਾਂਝੀ ਸੋਚ! #Punjab #Virasat',
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      user: 'ਅਮਨਪ੍ਰੀਤ ਕੌਰ',
      village: 'ਪਿੰਡ ਰਾਮਪੁਰ',
      type: 'issue',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦੀ ਫਿਰਨੀ ਵਾਲੀ ਗਲੀ ਦਾ ਕੰਮ ਸਰਪੰਚ ਵੱਲੋਂ ਰੋਕਿਆ ਗਿਆ ਹੈ। #VillageIssues',
      likes: 310,
      comments: 45
    }
  ]);

  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState('culture');
  const [postVillage, setPostVillage] = useState('');

  // Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (phone.length < 10 || !password || !name) {
      setErrorMessage('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸਹੀ ਭਰੋ! ਨੰਬਰ ਘੱਟੋ-ਘੱਟ 10 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।');
      return;
    }
    const userData = { name, phone, village: village || 'ਪੰਜਾਬ', password };
    localStorage.setItem('punjab_user', JSON.stringify(userData));
    setUser(userData);
    setErrorMessage('');
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('punjab_user'));
    if (saved && saved.phone === phone && saved.password === password) {
      setUser(saved);
      setErrorMessage('');
    } else {
      setErrorMessage('ਗਲਤ ਨੰਬਰ ਜਾਂ ਪਾਸਵਰਡ! ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਚੈੱਕ ਕਰੋ।');
    }
  };

  // Handle Forgot Password
  const handleForgot = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMessage('ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਹੀ ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ।');
      return;
    }
    setSuccessMessage('ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰਨ ਲਈ OTP ਤੁਹਾਡੇ ਮੋਬਾਈਲ ਨੰਬਰ ਤੇ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ!');
    setErrorMessage('');
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('punjab_user');
    setUser(null);
    setPhone('');
    setPassword('');
  };

  // Handle Delete Account
  const handleDeleteAccount = () => {
    if (window.confirm('ਕياتੁਸੀਂ ਆਪਣਾ ਅਕਾਊਂਟ ਹਮੇਸ਼ਾ ਲਈ ਡਿਲੀਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?')) {
      localStorage.removeItem('punjab_user');
      setUser(null);
    }
  };

  // Handle New Post
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPostObj = {
      id: posts.length + 1,
      user: user.name,
      village: postVillage || user.village || 'ਪੰਜਾਬ',
      type: postType,
      content: newContent,
      likes: 0,
      comments: 0
    };

    setPosts([newPostObj, ...posts]);
    setNewContent('');
    setPostVillage('');
    setCurrentTab('feed');
  };

  // If Not Logged In
  if (!user) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          
          <h2 style={{ color: '#111', marginBottom: '5px' }}>ਪੰਜਾਬ (Panjaab) 🌾</h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '25px' }}>ਕਲਚਰ, ਰੀਲਾਂ ਤੇ ਪਿੰਡਾਂ ਦੀ ਅਸਲ ਆਵਾਜ਼</p>

          {errorMessage && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', fontSize: '13px', marginBottom: '15px' }}>{errorMessage}</div>}
          {successMessage && <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', fontSize: '13px', marginBottom: '15px' }}>{successMessage}</div>}

          {authMode === 'signup' && (
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="ਪੂਰਾ ਨਾਮ" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="text" placeholder="ਤੁਹਾਡਾ ਪਿੰਡ / ਸ਼ਹਿਰ" value={village} onChange={(e) => setVillage(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="tel" placeholder="ਮੋਬਾਈਲ ਨੰਬਰ (10 ਅੰਕ)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="password" placeholder="ਪਾਸਵਰਡ ਬਣਾਓ" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਸਾਈਨ ਅੱਪ ਕਰੋ</button>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>ਪਹਿਲਾਂ ਹੀ ਅਕਾਊਂਟ ਹੈ? <span style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { setAuthMode('login'); setErrorMessage(''); }}>ਲੌਗਇਨ ਕਰੋ</span></p>
            </form>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin}>
              <input type="tel" placeholder="ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="password" placeholder="ਪਾਸਵਰਡ" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#007bff', cursor: 'pointer' }} onClick={() => { setAuthMode('forgot'); setErrorMessage(''); }}>ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?</span>
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਲੌਗਇਨ ਕਰੋ</button>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>ਨਵਾਂ ਅਕਾਊਂਟ ਬਣਾਉਣਾ ਹੈ? <span style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}>ਸਾਈਨ ਅੱਪ ਕਰੋ</span></p>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ, ਅਸੀਂ OTP ਭੇਜਾਂਗੇ।</p>
              <input type="tel" placeholder="ਮੋਬਾਈਲ ਨੰਬਰ" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>OTP ਭੇਜੋ</button>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}>← ਵਾਪਸ ਲੌਗਇਨ ਤੇ ਜਾਓ</p>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Logged-in User Posts
  const userPosts = posts.filter(p => p.user === user.name);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#111', color: '#fff', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>ਪੰਜਾਬ (Panjaab) 🌾</div>
        <div style={{ fontSize: '12px', backgroundColor: '#333', padding: '5px 10px', borderRadius: '15px' }}>📍 {user.village}</div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', marginBottom: '65px' }}>
        
        {/* 1. Feed Tab */}
        {currentTab === 'feed' && (
          <div>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>📢 ਪੰਜਾਬ ਦੀਆਂ ਤਾਜ਼ਾ ਪੋਸਟਾਂ ਤੇ ਮਸਲੇ</h3>
            {posts.map((post) => (
              <div key={post.id} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#222' }}>{post.user}</span>
                  <span style={{ fontSize: '11px', backgroundColor: post.type === 'issue' ? '#ffebee' : '#e8f5e9', color: post.type === 'issue' ? '#c62828' : '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {post.type === 'issue' ? '⚠️ ਪਿੰਡ ਦਾ ਮਸਲਾ' : '✨ ਵਿਰਸਾ / ਰੀਲ'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>📍 {post.village}</div>
                <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{post.content}</p>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                  <span>❤️ {post.likes} ਲਾਈਕਸ</span>
                  <span>💬 {post.comments} ਕਮੈਂਟਸ</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Create Post Tab */}
        {currentTab === 'create' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>➕ ਨਵੀਂ ਰੀਲ, ਸਟੋਰੀ ਜਾਂ ਪਿੰਡ ਦਾ ਮਸਲਾ ਪਾਓ</h3>
            <form onSubmit={handlePostSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>ਕਿਸਮ ਚੁਣੋ:</label>
                <select value={postType} onChange={(e) => setPostType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                  <option value="culture">ਸੱਭਿਆਚਾਰ / ਡੇਲੀ ਲਾਈਫ / ਰੀਲ</option>
                  <option value="issue">ਪਿੰਡ ਦਾ ਮਸਲਾ (ਸਰਪੰਚ / ਕੰਮ ਬਾਰੇ)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>ਪਿੰਡ / ਸ਼ਹਿਰ:</label>
                <input type="text" placeholder="ਜਿਵੇਂ: ਪਿੰਡ ਮੱਲ੍ਹੀਆਂ" value={postVillage} onChange={(e) => setPostVillage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>ਵੇਰਵਾ ਲਿਖੋ:</label>
                <textarea rows="4" placeholder="ਆਪਣੀ ਗੱਲ ਇੱਥੇ ਲਿਖੋ..." value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}></textarea>
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਪੋਸਟ ਸ਼ੇਅਰ ਕਰੋ</button>
            </form>
          </div>
        )}

        {/* 3. Profile Tab */}
        {currentTab === 'profile' && (
          <div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '40px', marginBottom: '5px' }}>🧑‍🌾</div>
              <h3 style={{ margin: '5px 0', fontSize: '18px' }}>{user.name}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 5px 0' }}>📞 {user.phone}</p>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 15px 0' }}>📍 {user.village}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{userPosts.length}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>ਕੁੱਲ ਪੋਸਟਾਂ</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>0</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>ਫਾਲੋਅਰਜ਼</div>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>ਤੁਹਾਡੀਆਂ ਪਾਈਆਂ ਪੋਸਟਾਂ:</h4>
            {userPosts.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>ਤੁਸੀਂ ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਪਾਈ।</p>
            ) : (
              userPosts.map(p => (
                <div key={p.id} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', marginBottom: '10px', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{p.village}</p>
                  <p style={{ margin: 0, color: '#444' }}>{p.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Settings Tab (With all 12 points) */}
        {currentTab === 'settings' && (
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>⚙️ ਸੈਟਿੰਗਸ (Settings)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>👤 <b>Profile:</b> {user.name} ({user.phone})</div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>📍 <b>Village Location:</b> {user.village}</div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => alert('ਪਾਸਵਰਡ ਬਦਲਣ ਦਾ ਵਿਕਲਪ ਜਲਦੀ ਆਵੇਗਾ!')}>🔑 <b>Change Password</b></div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>💾 <b>Saved Login Info:</b> ਐਕਟਿਵ (ਵਨ-ਟਾਈਮ ਸਾਈਨ-ਅੱਪ)</div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => alert('ਕੈਸ਼ ਸਾਫ਼ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ!')}>🧹 <b>Clear Cache</b></div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => alert('ਕੋਈ ਬਲੌਕ ਯੂਜ਼ਰ ਨਹੀਂ ਹੈ।')}>🚫 <b>Blocked Users</b></div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => alert('ਸਹਾਇਤਾ ਲਈ punjabapp@support.com ਤੇ ਸੰਪਰਕ ਕਰੋ।')}>🛟 <b>Help & Support</b></div>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => alert('ਨਿਯਮ: ਇਸ ਐਪ ਤੇ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਕਲਚਰ ਅਤੇ ਪਿੰਡਾਂ ਦੇ ਅਸਲ ਮਸਲੇ ਹੀ ਪਾਏ ਜਾ ਸਕਦੇ ਹਨ।')}>📜 <b>Terms & Policy</b></div>
              
              <button onClick={handleLogout} style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', marginTop: '10px' }}>
                🚪 Log Out (ਬਾਹਰ ਆਓ)
              </button>

              <button onClick={handleDeleteAccount} style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                ⚠️ Delete Account (ਅਕਾਊਂਟ ਡਿਲੀਟ ਕਰੋ)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <button onClick={() => setCurrentTab('feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: currentTab === 'feed' ? 'bold' : 'normal', color: currentTab === 'feed' ? '#000' : '#666' }}>
          🏠 ਫੀਡ
        </button>
        <button onClick={() => setCurrentTab('create')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: currentTab === 'create' ? 'bold' : 'normal', color: currentTab === 'create' ? '#000' : '#666' }}>
          ➕ ਪੋਸਟ
        </button>
        <button onClick={() => setCurrentTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: currentTab === 'profile' ? 'bold' : 'normal', color: currentTab === 'profile' ? '#000' : '#666' }}>
          👤 ਪ੍ਰੋਫਾਈਲ
        </button>
        <button onClick={() => setCurrentTab('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: currentTab === 'settings' ? 'bold' : 'normal', color: currentTab === 'settings' ? '#000' : '#666' }}>
          ⚙️ ਸੈਟਿੰਗਸ
        </button>
      </div>

    </div>
  );
}
