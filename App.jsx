import React, { useState, useEffect, useRef } from 'react';

const URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const KEY = "Sb_publishable_B7kdNhTOApIbatGO9Ez1qA_VPD2UEBR";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('punjab_user') || '');
  const [nameInput, setNameInput] = useState('');
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [postImg, setPostImg] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const loadFeed = async () => {
    try {
      const res = await fetch(`${URL}/rest/v1/posts?select=*&order=created_at.desc`, {
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
      });
      if (res.ok) {
        const d = await res.json();
        setPosts(d || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const loginUser = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    localStorage.setItem('punjab_user', nameInput.trim());
    setUser(nameInput.trim());
  };

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPostImg(reader.result);
    reader.readAsDataURL(file);
  };

  const publishPost = async (e) => {
    e.preventDefault();
    if (!postImg || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          author: user,
          location: "Punjab",
          image: postImg,
          caption: caption,
          likes: 0
        })
      });
      if (res.ok) {
        setPostImg(null);
        setCaption('');
        setTab('feed');
        loadFeed();
      } else {
        alert("Upload error. SQL table missing!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-700 via-amber-600 to-teal-800 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-2">
            ਪੰ
          </div>
          <h1 className="text-xl font-black text-amber-400 mb-4">PUNJAB</h1>
          <form onSubmit={loginUser} className="w-full space-y-3">
            <input
              type="text"
              placeholder="ਆਪਣਾ ਨਾਮ / ID ਲਿਖੋ"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button type="submit" className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm rounded-xl">
              ਐਂਟਰ ਕਰੋ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pb-16">
      <div className="w-full max-w-md border-x border-neutral-800 min-h-screen flex flex-col bg-neutral-950">
        <header className="sticky top-0 z-30 bg-neutral-950/90 border-b border-neutral-800 px-4 py-3 flex justify-between items-center">
          <span className="font-black text-amber-400 text-lg">🌾 PUNJAB</span>
          <button
            onClick={() => { localStorage.removeItem('punjab_user'); setUser(''); }}
            className="text-xs text-red-400 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded"
          >
            ਲੌਗ ਆਉਟ
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {tab === 'feed' && (
            <div className="divide-y divide-neutral-800">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ। ਹੇਠਾਂ ਦਿੱਤੇ (+) ਬਟਨ ਤੋਂ ਫ਼ੋਟੋ ਪਾਓ!
                </div>
              ) : (
                posts.map((p) => (
                  <div key={p.id} className="pb-3">
                    <div className="flex items-center gap-2 p-3">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                        {p.author ? p.author[0].toUpperCase() : 'P'}
                      </div>
                      <span className="text-xs font-bold">@{p.author}</span>
                    </div>
                    <img src={p.image} alt="Post" className="w-full aspect-square object-cover" />
                    <div className="p-3 text-xs text-neutral-200">
                      <span className="font-bold mr-1.5 text-amber-400">@{p.author}</span>
                      {p.caption}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'create' && (
            <div className="p-4">
              <h2 className="text-sm font-bold mb-3">ਨਵੀਂ ਪੋਸਟ ਪਾਓ</h2>
              <form onSubmit={publishPost} className="space-y-3">
                <input type="file" accept="image/*" ref={fileRef} onChange={pickImage} className="hidden" />
                {!postImg ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-900"
                  >
                    <span className="text-3xl">📷</span>
                    <span className="text-xs text-neutral-300">ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਫ਼ੋਟੋ ਚੁਣੋ</span>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-800">
                    <img src={postImg} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPostImg(null)}
                      className="absolute top-2 right-2 bg-black/70 p-1 rounded-full text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <textarea
                  rows={3}
                  placeholder="ਕੁਝ ਲਿਖੋ..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!postImg || loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs disabled:opacity-40"
                >
                  {loading ? "ਕਲਾਊਡ ਵਿੱਚ ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਪੋਸਟ ਕਰੋ"}
                </button>
              </form>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-neutral-950/95 border-t border-neutral-800 flex justify-around py-3 z-30 text-xl">
          <button onClick={() => { setTab('feed'); loadFeed(); }} className={tab === 'feed' ? "opacity-100 scale-110" : "opacity-50"}>
            🏠
          </button>
          <button onClick={() => setTab('create')} className={tab === 'create' ? "opacity-100 scale-110" : "opacity-50"}>
            ➕
          </button>
        </nav>
      </div>
    </div>
  );
}
