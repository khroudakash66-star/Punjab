import React, { useState, useEffect, useRef } from 'react';

const URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const KEY = "Sb_publishable_B7kdNhTOApIbatGO9Ez1qA_VPD2UEBR";

// Icons
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconFilm = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>;
const IconPlus = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>;
const IconUser = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconHeart = ({ filled }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const IconMessage = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
const IconSend = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconBookmark = ({ filled }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "currentColor"} strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>;
const IconGrid = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3"/><rect width="7" height="7" x="14" y="3"/><rect width="7" height="7" x="14" y="14"/><rect width="7" height="7" x="3" y="14"/></svg>;

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('punjab_user') || '');
  const [nameInput, setNameInput] = useState('');
  const [tab, setTab] = useState('home');
  const [profileTab, setProfileTab] = useState('posts');
  const [story, setStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postImg, setPostImg] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const stories = [
    { id: 1, u: "amritsar", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, u: "virasat", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, u: "kisaan", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" },
    { id: 4, u: "pendu", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop" }
  ];

  const reels = [
    { id: 101, u: "virasat_punjab", desc: "Rangla Punjab 🌾✨ #Punjab #Reels", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop", likes: 3420 },
    { id: 102, u: "kisaan_jatt", desc: "Fields of Punjab 🚜❤️ #PindLife", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop", likes: 5120 }
  ];

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
        setTab('home');
        loadFeed();
      } else {
        alert("Upload error. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 1) - 1 : (p.likes || 0) + 1 } : p));
  };

  const toggleSave = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const myPosts = posts.filter(p => p.author === user);
  const savedPosts = posts.filter(p => p.saved);

  // Big Welcome Card
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm bg-neutral-900/95 border border-neutral-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-28 h-28 rounded-2xl border-2 border-amber-500/70 shadow-2xl p-2 bg-gradient-to-br from-red-800 via-amber-700 to-teal-900 flex flex-col items-center justify-center text-center mb-4">
            <span className="text-3xl mb-1">🌾</span>
            <span className="font-black text-2xl text-white tracking-wide">ਪੰਜਾਬ</span>
            <span className="text-[10px] italic text-amber-200 font-serif tracking-widest">Panjaab</span>
          </div>
          <span className="font-black text-xl tracking-[0.2em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent mb-6">
            PUNJAB
          </span>
          <form onSubmit={loginUser} className="w-full space-y-3">
            <input
              type="text"
              placeholder="ਆਪਣਾ ਯੂਜ਼ਰ ਨਾਮ / ID ਲਿਖੋ..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm hover:opacity-95 shadow-lg"
            >
              ਸ਼ੁਰੂ ਕਰੋ (Enter)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pb-16 font-sans">
      <div className="w-full max-w-md border-x border-neutral-800 min-h-screen flex flex-col bg-neutral-950">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg border border-amber-500/60 bg-gradient-to-br from-red-800 via-amber-600 to-teal-900 flex items-center justify-center shadow">
              <span className="font-black text-white text-xs">ਪੰ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none">
                PUNJAB
              </span>
              <span className="text-[9px] text-amber-300 font-medium">Panjaab</span>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('punjab_user'); setUser(''); }}
            className="text-xs text-neutral-300 hover:text-red-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded"
          >
            ਲੌਗ ਆਉਟ
          </button>
        </header>

        {/* Story Modal */}
        {story && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-200">@{story.u}</span>
              <button onClick={() => setStory(null)} className="text-white p-1 text-xl font-bold">✕</button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src={story.img} alt="Story" className="max-h-[70vh] w-full object-contain rounded-2xl" />
            </div>
            <div className="flex items-center gap-3 p-2">
              <input type="text" placeholder={`Reply to @${story.u}...`} className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none" />
              <button onClick={() => setStoryLiked(!storyLiked)}>
                <IconHeart filled={storyLiked} />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {tab === 'home' && (
            <div>
              {/* Stories Bar */}
              <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-neutral-800 no-scrollbar">
                {stories.map(s => (
                  <div key={s.id} onClick={() => { setStory(s); setStoryLiked(false); }} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300">
                      <img src={s.img} alt={s.u} className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    <span className="text-[10px] text-neutral-400">@{s.u}</span>
                  </div>
                ))}
              </div>

              {/* Feed */}
              <div className="divide-y divide-neutral-800">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-500">
                    ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ। ਹੇਠਾਂ ਦਿੱਤੇ (➕) ਬਟਨ ਤੋਂ ਪਹਿਲੀ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ!
                  </div>
                ) : (
                  posts.map(p => (
                    <article key={p.id} className="pb-3">
                      <div className="flex items-center gap-2.5 px-4 py-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                          {p.author ? p.author[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div className="text-xs font-bold">@{p.author}</div>
                          <div className="text-[10px] text-neutral-400">{p.location || 'Punjab'}</div>
                        </div>
                      </div>
                      <img src={p.image} alt="Post" className="w-full aspect-square object-cover" />
                      <div className="px-4 pt-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleLike(p.id)}>
                              <IconHeart filled={p.liked} />
                            </button>
                            <IconMessage />
                            <IconSend />
                          </div>
                          <button onClick={() => toggleSave(p.id)}>
                            <IconBookmark filled={p.saved} />
                          </button>
                        </div>
                        <div className="text-xs font-semibold mb-1">{p.likes || 0} ਪਸੰਦ</div>
                        <p className="text-xs text-neutral-200">
                          <span className="font-bold mr-1.5 text-amber-400">@{p.author}</span>
                          {p.caption}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === 'reels' && (
            <div className="h-[calc(100vh-125px)] overflow-y-scroll snap-y snap-mandatory">
              {reels.map(r => (
                <div key={r.id} className="relative h-full w-full snap-start bg-black flex items-center justify-center">
                  <img src={r.img} alt="Reel" className="w-full h-full object-cover" />
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-4">
                    <IconHeart filled={true} />
                    <span className="text-[11px]">{r.likes}</span>
                    <IconMessage />
                    <IconSend />
                  </div>
                  <div className="absolute left-4 bottom-6 right-16 bg-black/50 p-2.5 rounded-xl backdrop-blur-sm">
                    <div className="font-bold text-xs text-amber-400">@{r.u}</div>
                    <div className="text-xs text-neutral-200">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'create' && (
            <div className="p-4">
              <h2 className="text-sm font-bold mb-3">ਨਵੀਂ ਪੋਸਟ ਪਾਓ</h2>
              <form onSubmit={publishPost} className="space-y-4">
                <input type="file" accept="image/*" ref={fileRef} onChange={pickImage} className="hidden" />
                {!postImg ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-900/50"
                  >
                    <span className="text-3xl">📷</span>
                    <span className="text-xs text-neutral-300 font-medium">ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਫ਼ੋਟੋ ਚੁਣੋ</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-800">
                      <img src={postImg} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPostImg(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      ਹੋਰ ਫ਼ੋਟੋ ਚੁਣੋ
                    </button>
                  </div>
                )}
                <textarea
                  rows={3}
                  placeholder="ਕੁਝ ਲਿਖੋ..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!postImg || loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs disabled:opacity-40 transition"
                >
                  {loading ? "ਕਲਾਊਡ ਵਿੱਚ ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਪੋਸਟ ਕਰੋ"}
                </button>
              </form>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-neutral-800 flex items-center justify-center text-xl font-bold text-amber-400">
                    {user[0]?.toUpperCase()}
                  </div>
                  <div className="flex gap-6 text-center pr-2">
                    <div>
                      <div className="font-bold text-sm">{myPosts.length}</div>
                      <div className="text-[10px] text-neutral-400">ਪੋਸਟਾਂ</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">240</div>
                      <div className="text-[10px] text-neutral-400">ਫੋਲੋਅਰਜ਼</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">115</div>
                      <div className="text-[10px] text-neutral-400">ਫੋਲੋਇੰਗ</div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm">{user}</h3>
                <p className="text-xs text-neutral-400 mb-3">@{user.toLowerCase()}</p>
                <button
                  onClick={() => { localStorage.removeItem('punjab_user'); setUser(''); }}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-red-400"
                >
                  ਲੌਗ ਆਉਟ
                </button>
              </div>

              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setProfileTab('posts')}
                  className={`flex-1 py-2.5 flex justify-center border-b-2 ${profileTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-500'}`}
                >
                  <IconGrid />
                </button>
                <button
                  onClick={() => setProfileTab('saved')}
                  className={`flex-1 py-2.5 flex justify-center border-b-2 ${profileTab === 'saved' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-500'}`}
                >
                  <IconBookmark filled={false} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1">
                {(profileTab === 'posts' ? myPosts : savedPosts).map(item => (
                  <div key={item.id} className="aspect-square bg-neutral-900">
                    <img src={item.image} alt="post" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
