import React, { useState } from 'react';

export default function PunjabApp() {
  // One-time Signup / Login Memory
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('punjab_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'create', 'profile', 'settings'

  // Stories (Instagram style top bar)
  const stories = [
    { id: 1, name: 'ਵਿਰਸਾ', icon: '🌾' },
    { id: 2, name: 'ਪਿੰਡ ਧਾਰੀਵਾਲ', icon: '🚜' },
    { id: 3, name: 'ਲੋਕ ਗੀਤ', icon: '🎶' },
    { id: 4, name: 'ਸਰਪੰਚ ਮਸਲਾ', icon: '⚠️' },
    { id: 5, name: 'ਰੁਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ', icon: '☀️' }
  ];

  // Feed Posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'ਜਤਿੰਦਰ ਸਿੰਘ',
      village: 'ਪਿੰਡ ਧਾਰੀਵਾਲ',
      type: 'culture',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦਾ ਪੁਰਾਣਾ ਵਿਰਸਾ ਅਤੇ ਸਾਂਝੀ ਸੋਚ! #Punjab #Virasat',
      likes: 124,
      isLiked: false
    },
    {
      id: 2,
      user: 'ਅਮਨਪ੍ਰੀਤ ਕੌਰ',
      village: 'ਪਿੰਡ ਰਾਮਪੁਰ',
      type: 'issue',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦੀ ਫਿਰਨੀ ਵਾਲੀ ਗਲੀ ਦਾ ਕੰਮ ਸਰਪੰਚ ਵੱਲੋਂ ਰੋਕਿਆ ਗਿਆ ਹੈ। #VillageIssues',
      likes: 310,
      isLiked: false
    }
  ]);

  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState('culture');
  const [postVillage, setPostVillage] = useState('');

  // Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (phone.length < 10 || !password || !name) {
      setErrorMessage('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸਹੀ ਭਰੋ!');
      return;
    }
    const userData = { name, phone, village: village || 'ਪੰਜਾਬ', password };
    localStorage.setItem('punjab_user', JSON.stringify(userData));
    setUser(userData);
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('punjab_user'));
    if (saved && saved.phone === phone && saved.password === password) {
      setUser(saved);
    } else {
      setErrorMessage('ਗਲਤ ਨੰਬਰ ਜਾਂ ਪਾਸਵਰਡ!');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('punjab_user');
    setUser(null);
  };

  // Like Post Toggle
  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
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
      isLiked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewContent('');
    setPostVillage('');
    setCurrentTab('feed');
  };

  // Auth Screen (Dark Theme)
  if (!user) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#121212', padding: '30px', borderRadius: '15px', border: '1px solid #222', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '5px' }}>ਪੰਜਾਬ (Panjaab) 🌾</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '25px' }}>ਕਲਚਰ, ਰੀਲਾਂ ਤੇ ਪਿੰਡਾਂ ਦੀ ਆਵਾਜ਼</p>

          {errorMessage && <div style={{ backgroundColor: '#3b1111', color: '#ff8a80', padding: '10px', borderRadius: '5px', fontSize: '13px', marginBottom: '15px' }}>{errorMessage}</div>}

          {authMode === 'signup' ? (
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="ਪੂਰਾ ਨਾਮ" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <input type="text" placeholder="ਪਿੰਡ / ਸ਼ਹਿਰ" value={village} onChange={(e) => setVillage(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <input type="tel" placeholder="ਮੋਬਾਈਲ ਨੰਬਰ (10 ਅੰਕ)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <input type="password" placeholder="ਪਾਸਵਰਡ" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਸਾਈਨ ਅੱਪ ਕਰੋ</button>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#888' }}>ਪਹਿਲਾਂ ਹੀ ਅਕਾਊਂਟ ਹੈ? <span style={{ color: '#4dabf7', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('login')}>ਲੌਗਇਨ ਕਰੋ</span></p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <input type="tel" placeholder="ਮੋਬਾਈਲ ਨੰਬਰ" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <input type="password" placeholder="ਪਾਸਵਰਡ" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਲੌਗਇਨ ਕਰੋ</button>
              <p style={{ marginTop: '15px', fontSize: '13px', color: '#888' }}>ਨਵਾਂ ਅਕਾਊਂਟ ਬਣਾਉਣਾ ਹੈ? <span style={{ color: '#4dabf7', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('signup')}>ਸਾਈਨ ਅੱਪ ਕਰੋ</span></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(p => p.user === user.name);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Instagram Style Header */}
      <div style={{ backgroundColor: '#000', color: '#fff', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.5px' }}>ਪੰਜਾਬ 🌾</div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>
          <span>➕</span>
          <span>❤️</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '60px' }}>
        
        {/* Feed Tab (Instagram Style) */}
        {currentTab === 'feed' && (
          <div>
            {/* Stories Bar */}
            <div style={{ display: 'flex', gap: '15px', padding: '12px 15px', overflowX: 'auto', borderBottom: '1px solid #222', backgroundColor: '#000' }}>
              {stories.map(s => (
                <div key={s.id} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {s.icon}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#aaa', marginTop: '4px', display: 'block', width: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                </div>
              ))}
            </div>

            {/* Posts Feed */}
            {posts.map(post => (
              <div key={post.id} style={{ backgroundColor: '#000', borderBottom: '1px solid #222', marginBottom: '10px' }}>
                {/* Post Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🧑‍🌾</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{post.user}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>📍 {post.village}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: post.type === 'issue' ? '#3b1111' : '#1b3b1a', color: post.type === 'issue' ? '#ff8a80' : '#b9f6ca', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {post.type === 'issue' ? '⚠️ ਪਿੰਡ ਦਾ ਮਸਲਾ' : '✨ ਵਿਰਸਾ'}
                  </span>
                </div>

                {/* Post Media Box (Mock Image/Reel view) */}
                <div style={{ width: '100%', height: '300px', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px', textAlign: 'center', padding: '20px', boxSizing: 'border-box' }}>
                  🌾 [ਪੰਜਾਬੀ ਕਲਚਰਲ ਰੀਲ ਜਾਂ ਫੋਟੋ - {post.village}]
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', fontSize: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <span onClick={() => handleLike(post.id)} style={{ cursor: 'pointer' }}>{post.isLiked ? '❤️' : '🤍'}</span>
                    <span>💬</span>
                    <span>↗️</span>
                  </div>
                  <div>🔖</div>
                </div>

                {/* Likes & Caption */}
                <div style={{ padding: '0 15px 12px 15px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{post.likes} ਲਾਈਕਸ</div>
                  <div><b style={{ marginRight: '8px' }}>{post.user}</b>{post.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Post Tab */}
        {currentTab === 'create' && (
          <div style={{ backgroundColor: '#121212', padding: '20px', margin: '15px', borderRadius: '12px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>➕ ਨਵੀਂ ਰੀਲ ਜਾਂ ਪਿੰਡ ਦਾ ਮਸਲਾ ਪਾਓ</h3>
            <form onSubmit={handlePostSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>ਕਿਸਮ:</label>
                <select value={postType} onChange={(e) => setPostType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff' }}>
                  <option value="culture">ਸੱਭਿਆਚਾਰ / ਡੇਲੀ ਲਾਈਫ / ਰੀਲ</option>
                  <option value="issue">ਪਿੰਡ ਦਾ ਮਸਲਾ (ਸਰਪੰਚ / ਕੰਮ ਬਾਰੇ)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>ਪਿੰਡ / ਸ਼ਹਿਰ:</label>
                <input type="text" placeholder="ਜਿਵੇਂ: ਪਿੰਡ ਮੱਲ੍ਹੀਆਂ" value={postVillage} onChange={(e) => setPostVillage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>ਵੇਰਵਾ ਲਿਖੋ:</label>
                <textarea rows="4" placeholder="ਆਪਣੀ ਗੱਲ ਲਿਖੋ..." value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' }}></textarea>
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ਸ਼ੇਅਰ ਕਰੋ</button>
            </form>
          </div>
        )}

        {/* Profile Tab */}
        {currentTab === 'profile' && (
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🧑‍🌾</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{user.name}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>📍 {user.village}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>📞 {user.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '10px 0', marginBottom: '15px', textAlign: 'center' }}>
              <div><b>{userPosts.length}</b><div style={{ fontSize: '11px', color: '#888' }}>ਪੋਸਟਾਂ</div></div>
              <div><b>0</b><div style={{ fontSize: '11px', color: '#888' }}>ਫਾਲੋਅਰਜ਼</div></div>
              <div><b>0</b><div style={{ fontSize: '11px', color: '#888' }}>ਫਾਲੋਇੰਗ</div></div>
            </div>

            <h4 style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>ਮੇਰੀਆਂ ਪੋਸਟਾਂ:</h4>
            {userPosts.map(p => (
              <div key={p.id} style={{ backgroundColor: '#121212', padding: '12px', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', border: '1px solid #222' }}>
                <b style={{ color: '#fff' }}>{p.village}</b>
                <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>{p.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab (12 Snapchat/Instagram Settings Points) */}
        {currentTab === 'settings' && (
          <div style={{ padding: '15px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>⚙️ ਸੈਟਿੰਗਸ (Settings)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222' }}>👤 <b>Profile:</b> {user.name}</div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222' }}>📍 <b>Village:</b> {user.village}</div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਪਾਸਵਰਡ ਬਦਲਣ ਦਾ ਵਿਕਲਪ!')}>🔑 <b>Change Password</b></div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222' }}>💾 <b>Saved Login:</b> ਐਕਟਿਵ (ਵਨ-ਟਾਈਮ)</div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਕੈਸ਼ ਸਾਫ਼ ਕਰ ਦਿੱਤਾ ਗਿਆ!')}>🧹 <b>Clear Cache</b></div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਕੋਈ ਬਲੌਕ ਯੂਜ਼ਰ ਨਹੀਂ।')}>🚫 <b>Blocked Users</b></div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਸਹਾਇਤਾ ਲਈ ਸੰਪਰਕ ਕਰੋ।')}>🛟 <b>Help & Support</b></div>
              <div style={{ padding: '12px', backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਨਿਯਮ: ਸਿਰਫ਼ ਕਲਚਰ ਅਤੇ ਪਿੰਡਾਂ ਦੇ ਮਸਲੇ।')}>📜 <b>Terms & Policy</b></div>
              
              <button onClick={handleLogout} style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '12px', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', marginTop: '10px' }}>
                🚪 Log Out (ਬਾਹਰ ਆਓ)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Instagram Style Bottom Navigation Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto', backgroundColor: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '12px 0', fontSize: '20px' }}>
        <span onClick={() => setCurrentTab('feed')} style={{ cursor: 'pointer', opacity: currentTab === 'feed' ? '1' : '0.5' }}>🏠</span>
        <span onClick={() => setCurrentTab('create')} style={{ cursor: 'pointer', opacity: currentTab === 'create' ? '1' : '0.5' }}>➕</span>
        <span onClick={() => setCurrentTab('profile')} style={{ cursor: 'pointer', opacity: currentTab === 'profile' ? '1' : '0.5' }}>👤</span>
        <span onClick={() => setCurrentTab('settings')} style={{ cursor: 'pointer', opacity: currentTab === 'settings' ? '1' : '0.5' }}>⚙️</span>
      </div>

    </div>
  );
}
