import React, { useState } from 'react';

export default function PunjabApp() {
  const [currentTab, setCurrentTab] = useState('feed');
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Jatinder Singh',
      village: 'Pind Dhariwal',
      type: 'culture',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦਾ ਪੁਰਾਣਾ ਵਿਰਸਾ ਅਤੇ ਸਾਂਝੀ ਸੋਚ! #Punjab #Virasat',
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      user: 'Amanpreet Kaur',
      village: 'Pind Rampura',
      type: 'issue',
      content: 'ਸਾਡੇ ਪਿੰਡ ਦੀ ਫਿਰਨੀ ਵਾਲੀ ਗਲੀ ਦਾ ਕੰਮ ਪਿਛਲੇ 6 ਮਹੀਨਿਆਂ ਤੋਂ ਸਰਪੰਚ ਵੱਲੋਂ ਰੋਕਿਆ ਗਿਆ ਹੈ। ਕੋਈ ਸੁਣਵਾਈ ਨਹੀਂ ਹੋ ਰਹੀ। #VillageIssues #PunjabVoice',
      likes: 310,
      comments: 45
    }
  ]);

  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState('culture');
  const [villageName, setVillageName] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPostObj = {
      id: posts.length + 1,
      user: 'User (' + (villageName || 'Punjab') + ')',
      village: villageName || 'ਪੰਜਾਬ',
      type: postType,
      content: newContent,
      likes: 0,
      comments: 0
    };

    setPosts([newPostObj, ...posts]);
    setNewContent('');
    setVillageName('');
    setCurrentTab('feed');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#111', color: '#fff', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
        ਪੰਜਾਬ (Panjaab) 🌾
        <div style={{ fontSize: '11px', color: '#ccc', fontWeight: 'normal' }}>ਕਲਚਰ, ਰੀਲਾਂ ਤੇ ਪਿੰਡਾਂ ਦੀ ਆਵਾਜ਼</div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', marginBottom: '60px' }}>
        
        {currentTab === 'feed' && (
          <div>
            <h3>ਤਾਜ਼ਾ ਪੋਸਟਾਂ ਅਤੇ ਮਸਲੇ</h3>
            {posts.map((post) => (
              <div key={post.id} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.user}</span>
                  <span style={{ fontSize: '12px', backgroundColor: post.type === 'issue' ? '#ffebee' : '#e8f5e9', color: post.type === 'issue' ? '#c62828' : '#2e7d32', padding: '2px 8px', borderRadius: '4px' }}>
                    {post.type === 'issue' ? '⚠️ ਪਿੰਡ ਦਾ ਮਸਲਾ' : '✨ ਵਿਰਸਾ / ਰੀਲ'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>📍 {post.village}</div>
                <p style={{ fontSize: '15px', color: '#222', lineHeight: '1.4' }}>{post.content}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666', borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '10px' }}>
                  <span>❤️ {post.likes} ਲਾਈਕਸ</span>
                  <span>💬 {post.comments} ਕਮੈਂਟਸ</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'create' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3>ਨਵੀਂ ਪੋਸਟ ਜਾਂ ਮਸਲਾ ਪਾਓ</h3>
            <form onSubmit={handlePostSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>ਪੋਸਟ ਦੀ ਕਿਸਮ:</label>
                <select value={postType} onChange={(e) => setPostType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <option value="culture">ਸੱਭਿਆਚਾਰ / ਡੇਲੀ ਲਾਈਫ / ਰੀਲ</option>
                  <option value="issue">ਪਿੰਡ ਦਾ ਮਸਲਾ (ਸਰਪੰਚ ਜਾਂ ਕੰਮ ਬਾਰੇ)</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>ਤੁਹਾਡਾ ਪਿੰਡ / ਸ਼ਹਿਰ:</label>
                <input 
                  type="text" 
                  placeholder="ਜਿਵੇਂ: ਪਿੰਡ ਰਾਮਪੁਰ" 
                  value={villageName} 
                  onChange={(e) => setVillageName(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>ਵੇਰਵਾ ਲਿਖੋ:</label>
                <textarea 
                  rows="4" 
                  placeholder="ਆਪਣੀ ਗੱਲ ਜਾਂ ਵੀਡੀਓ/ਫੋਟੋ ਬਾਰੇ ਲਿਖੋ..." 
                  value={newContent} 
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                ਪੋਸਟ ਸਾਂਝੀ ਕਰੋ
              </button>
            </form>
          </div>
        )}

        {currentTab === 'privacy' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3>ਪ੍ਰਾਈਵੇਸੀ ਅਤੇ ਸੁਰੱਖਿਆ</h3>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
              ਵੀਰ ਸ਼ੇਰਾ, ਇਸ ਐਪ ਵਿੱਚ ਹਰ ਯੂਜ਼ਰ ਦਾ ਡਾਟਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਰਹੇਗਾ। ਕੋਈ ਵੀ ਗਲਤ ਜਾਂ ਅਸ਼ਲੀਲ ਪੋਸਟ ਰੋਕਣ ਲਈ ਇਸ ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਫਿਲਟਰ ਅਤੇ ਰਿਪੋਰਟ ਸਿਸਟਮ ਕੰਮ ਕਰੇਗਾ, ਤਾਂ ਜੋ ਸਾਡਾ "ਪੰਜਾਬ" ਐਪ ਸਾਫ਼-ਸੁਥਰਾ ਅਤੇ ਮਿਆਰੀ ਬਣਿਆ ਰਹੇ।
            </p>
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <button onClick={() => setCurrentTab('feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentTab === 'feed' ? 'bold' : 'normal', color: currentTab === 'feed' ? '#000' : '#666' }}>
          🏠 ਹੋਮ ਫੀਡ
        </button>
        <button onClick={() => setCurrentTab('create')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentTab === 'create' ? 'bold' : 'normal', color: currentTab === 'create' ? '#000' : '#666' }}>
          ➕ ਪੋਸਟ ਪਾਓ
        </button>
        <button onClick={() => setCurrentTab('privacy')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentTab === 'privacy' ? 'bold' : 'normal', color: currentTab === 'privacy' ? '#000' : '#666' }}>
          🔒 ਪ੍ਰਾਈਵੇਸੀ
        </button>
      </div>

    </div>
  );
}
