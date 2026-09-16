import React, { useState } from 'react';

export default function PunjabTopApp() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('punjab_top_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'create', 'profile', 'settings'

  // Unique Feed Data (Culture + Village Accountability)
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'ਜਤਿੰਦਰ ਸਿੰਘ ਖਹਿਰਾ',
      village: 'ਪਿੰਡ ਧਾਰੀਵਾਲ',
      category: 'culture',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦਾ ਪੁਰਾਣਾ ਵਿਰਸਾ, ਸਾਂਝੀ ਸੋਚ ਅਤੇ ਸਾਡੀ ਬੋਲੀ! #Punjab #Virasat',
      likes: 420,
      isLiked: false
    },
    {
      id: 2,
      user: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
      village: 'ਪਿੰਡ ਰਾਮਪੁਰ',
      category: 'issue',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦੀ ਫਿਰਨੀ ਵਾਲੀ ਗਲੀ ਦਾ ਬਜਟ ਪਾਸ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਸਰਪੰਚ ਵੱਲੋਂ ਕੰਮ ਰੋਕਿਆ ਗਿਆ ਹੈ। ਸਾਰੇ ਵੀਰ ਇੱਕਜੁੱਟ ਹੋ ਕੇ ਆਵਾਜ਼ ਚੁੱਕੋ! #VillageIssues #PunjabVoice',
      likes: 890,
      isLiked: false
    }
  ]);

  const [newContent, setNewContent] = useState('');
  const [category, setCategory] = useState('culture');
  const [postVillage, setPostVillage] = useState('');

  // Authentication Handlers
  const handleAuth = (e) => {
    e.preventDefault();
    if (phone.length < 10 || !password || (!isLoginMode && !name)) {
      setError('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸਹੀ ਭਰੋ!');
      return;
    }
    if (isLoginMode) {
      const saved = JSON.parse(localStorage.getItem('punjab_top_user'));
      if (saved && saved.phone === phone && saved.password === password) {
        setUser(saved);
        setError('');
      } else {
        setError('ਗਲਤ ਨੰਬਰ ਜਾਂ ਪਾਸਵਰਡ!');
      }
    } else {
      const newUser = { name, phone, village: village || 'ਪੰਜਾਬ', password };
      localStorage.setItem('punjab_top_user', JSON.stringify(newUser));
      setUser(newUser);
      setError('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('punjab_top_user');
    setUser(null);
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p));
  };

  const createPost = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const newPost = {
      id: posts.length + 1,
      user: user.name,
      village: postVillage || user.village || 'ਪੰਜਾਬ',
      category,
      content: newContent,
      likes: 1,
      isLiked: true
    };
    setPosts([newPost, ...posts]);
    setNewContent('');
    setPostVillage('');
    setActiveTab('feed');
  };

  if (!user) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '5px', fontWeight: '800', letterSpacing: '1px' }}>ਪੰਜਾਬ 🌾</h1>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '25px' }}>ਵਿਰਸਾ, ਤਾਕਤ ਅਤੇ ਪਿੰਡਾਂ ਦੀ ਅਸਲ ਆਵਾਜ਼</p>

          {error && <div style={{ backgroundColor: '#3b1111', color: '#ff8a80', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}

          <form onSubmit={handleAuth}>
            {!isLoginMode && (
              <>
                <input type="text" placeholder="ਪੂਰਾ ਨਾਮ" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                <input type="text" placeholder="ਪਿੰਡ / ਸ਼ਹਿਰ" value={village} onChange={e => setVillage(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
              </>
            )}
            <input type="tel" placeholder="ਮੋਬਾਈਲ ਨੰਬਰ (10 ਅੰਕ)" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
            <input type="password" placeholder="ਪਾਸਵਰਡ" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
            
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              {isLoginMode ? 'ਲੌਗਇਨ ਕਰੋ' : 'ਅਕਾਊਂਟ ਬਣਾਓ'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '13px', color: '#888', cursor: 'pointer' }} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'ਨਵਾਂ ਅਕਾਊਂਟ ਬਣਾਉਣਾ ਹੈ? ਸਾਈਨ ਅੱਪ ਕਰੋ' : 'ਪਹਿਲਾਂ ਹੀ ਅਕਾਊਂਟ ਹੈ? ਲੌਗਇਨ ਕਰੋ'}
          </p>
        </div>
      </div>
    );
  }

  const myPosts = posts.filter(p => p.user === user.name);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a', backgroundColor: '#000', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>ਪੰਜਾਬ 🌾</h2>
        <div style={{ fontSize: '12px', backgroundColor: '#1a1a1a', padding: '6px 12px', borderRadius: '20px', color: '#ccc', border: '1px solid #333' }}>
          📍 {user.village}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        
        {/* Feed Section */}
        {activeTab === 'feed' && (
          <div>
            {posts.map(post => (
              <div key={post.id} style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '16px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.user}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>📍 {post.village}</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: post.category === 'issue' ? '#3b1111' : '#113b1a', color: post.category === 'issue' ? '#ff8a80' : '#b9f6ca' }}>
                    {post.category === 'issue' ? '⚠️ ਪਿੰਡ ਦਾ ਮਸਲਾ' : '✨ ਵਿਰਸਾ / ਰੀਲ'}
                  </span>
                </div>
                
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#e0e0e0', margin: '10px 0' }}>{post.content}</p>

                <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '13px', color: '#aaa', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                  <span onClick={() => toggleLike(post.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {post.isLiked ? '❤️' : '🤍'} {post.likes} ਲਾਈਕਸ
                  </span>
                  <span>💬 ਕਮੈਂਟਸ</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Post Section */}
        {activeTab === 'create' && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>➕ ਪੋਸਟ ਜਾਂ ਪਿੰਡ ਦਾ ਮਸਲਾ ਪਾਓ</h3>
            <form onSubmit={createPost}>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>ਕਿਸਮ ਚੁਣੋ:</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}>
                <option value="culture">ਸੱਭਿਆਚਾਰ ਅਤੇ ਡੇਲੀ ਲਾਈਫ (Culture)</option>
                <option value="issue">ਪਿੰਡ ਦਾ ਅਸਲ ਮਸਲਾ / ਸਰਪੰਚ ਬਾਰੇ (Issue)</option>
              </select>

              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>ਪਿੰਡ / ਸ਼ਹਿਰ:</label>
              <input type="text" placeholder="ਜਿਵੇਂ: ਪਿੰਡ ਮੱਲ੍ਹੀਆਂ" value={postVillage} onChange={e => setPostVillage(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />

              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>ਵੇਰਵਾ ਲਿਖੋ:</label>
              <textarea rows="4" placeholder="ਆਪਣੀ ਗੱਲ ਖੁੱਲ੍ਹ ਕੇ ਲਿਖੋ..." value={newContent} onChange={e => setNewContent(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}></textarea>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                ਪੰਜਾਬ ਵਿੱਚ ਸ਼ੇਅਰ ਕਰੋ
              </button>
            </form>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div style={{ padding: '20px' }}>
            <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧑‍🌾</div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{user.name}</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#888' }}>📍 {user.village}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>📞 {user.phone}</p>
            </div>

            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>ਤੁਹਾਡੀਆਂ ਪਾਈਆਂ ਪੋਸਟਾਂ ({myPosts.length}):</h4>
            {myPosts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', padding: '20px' }}>ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਪਾਈ ਗਈ।</p>
            ) : (
              myPosts.map(p => (
                <div key={p.id} style={{ backgroundColor: '#111', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #222', fontSize: '13px' }}>
                  <b>{p.village}</b>
                  <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>{p.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Section (Top-class Settings) */}
        {activeTab === 'settings' && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>⚙️ ਸੈਟਿੰਗਸ (Settings)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>👤 ਪ੍ਰੋਫਾਈਲ: {user.name}</div>
              <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>📍 ਪਿੰਡ: {user.village}</div>
              <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਸਿਸਟਮ ਐਕਟਿਵ ਹੈ!')}>🔑 ਪਾਸਵਰਡ ਬਦਲੋ</div>
              <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਕੈਸ਼ ਸਾਫ਼ ਕਰ ਦਿੱਤਾ ਗਿਆ!')}>🧹 ਕੈਸ਼ ਸਾਫ਼ ਕਰੋ (Clear Cache)</div>
              <div style={{ padding: '14px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', color: '#4dabf7', cursor: 'pointer' }} onClick={() => alert('ਨਿਯਮ: ਸਿਰਫ਼ ਪੰਜਾਬੀ ਕਲਚਰ ਅਤੇ ਪਿੰਡਾਂ ਦੇ ਅਸਲ ਮਸਲੇ।')}>📜 ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ (Terms)</div>

              <button onClick={handleLogout} style={{ marginTop: '15px', padding: '12px', backgroundColor: '#3b1111', color: '#ff8a80', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                🚪 ਅਕਾਊਂਟ ਤੋਂ ਬਾਹਰ ਆਓ (Log Out)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Modern Navigation Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto', backgroundColor: '#000', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 10 }}>
        <span onClick={() => setActiveTab('feed')} style={{ cursor: 'pointer', fontSize: '20px', opacity: activeTab === 'feed' ? '1' : '0.4' }}>🏠</span>
        <span onClick={() => setActiveTab('create')} style={{ cursor: 'pointer', fontSize: '20px', opacity: activeTab === 'create' ? '1' : '0.4' }}>➕</span>
        <span onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer', fontSize: '20px', opacity: activeTab === 'profile' ? '1' : '0.4' }}>👤</span>
        <span onClick={() => setActiveTab('settings')} style={{ cursor: 'pointer', fontSize: '20px', opacity: activeTab === 'settings' ? '1' : '0.4' }}>⚙️</span>
      </div>

    </div>
  );
}
