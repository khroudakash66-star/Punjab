import React, { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOApIbatGO9Ez1qA_VPD2UEBR";

const getStore = (k, d) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const setStore = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(() => getStore('punjab_usr', null));
  const [authMode, setAuthMode] = useState('login');
  const [uid, setUid] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const [tab, setTab] = useState('home');
  const [profileTab, setProfileTab] = useState('posts');
  const [story, setStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);

  const fileRef = useRef(null);
  const [postImg, setPostImg] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const stories = [
    { id: 1, u: "amritsar", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, u: "virasat", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, u: "kisaan", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" }
  ];

  const reels = [
    { id: 101, u: "virasat_punjab", desc: "Rangla Punjab 🌾✨ #Punjab #Reels", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop", likes: 3420 },
    { id: 102, u: "kisaan_jatt", desc: "Fields of Punjab 🚜❤️", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop", likes: 5120 }
  ];

  const [posts, setPosts] = useState([]);

  const t = {
    en: { login: "Log In", signup: "Sign Up", uid: "User ID", pwd: "Password", name: "Full Name", need: "Need an account? Sign up", has: "Have an account? Log in", out: "Log Out", share: "Share Post", newP: "New Post", cam: "Click to upload from Camera / Gallery", change: "Change Photo", cap: "Write a caption...", likes: "likes", posts: "Posts", fol: "Followers", fing: "Following" },
    pa: { login: "ਲਾਗ ਇਨ", signup: "ਸਾਈਨ ਅੱਪ", uid: "ਯੂਜ਼ਰ ਆਈਡੀ", pwd: "ਪਾਸਵਰਡ", name: "ਪੂਰਾ ਨਾਮ", need: "ਖਾਤਾ ਬਣਾਓ", has: "ਲਾਗ ਇਨ ਕਰੋ", out: "ਲੌਗ ਆਉਟ", share: "ਪੋਸਟ ਕਰੋ", newP: "ਨਵੀਂ ਪੋਸਟ", cam: "ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਫੋਟੋ ਚੁਣੋ", change: "ਹੋਰ ਫੋਟੋ ਚੁਣੋ", cap: "ਕੁਝ ਲਿਖੋ...", likes: "ਪਸੰਦ", posts: "ਪੋਸਟਾਂ", fol: "ਫੋਲੋਅਰਜ਼", fing: "ਫੋਲੋਇੰਗ" }
  }[lang];

  // ਕਲਾਊਡ ਤੋਂ ਸਾਰੀਆਂ ਪੋਸਟਾਂ ਲਿਆਉਣਾ
  const fetchCloudPosts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.map(p => ({
          id: p.id,
          u: p.author,
          loc: p.location || 'Punjab',
          img: p.image,
          cap: p.caption,
          likes: p.likes || 0,
          liked: false,
          saved: false
        })));
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  useEffect(() => {
    fetchCloudPosts();
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    setMsg('');
    const db = getStore('punjab_usr_db', []);
    if (authMode === 'signup') {
      if (!uid.trim() || !pwd.trim()) { setMsg(lang === 'en' ? 'Fill all fields' : 'ਸਾਰੇ ਖਾਨੇ ਭਰੋ'); return; }
      if (db.find(x => x.uid.toLowerCase() === uid.trim().toLowerCase())) { setMsg(lang === 'en' ? 'User ID taken' : 'ਆਈਡੀ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ'); return; }
      const nu = { uid: uid.trim(), name: name.trim() || uid.trim(), pwd: pwd.trim(), fol: 140, fing: 80 };
      db.push(nu);
      setStore('punjab_usr_db', db);
      setStore('punjab_usr', nu);
      setUser(nu);
    } else {
      const found = db.find(x => x.uid.toLowerCase() === uid.trim().toLowerCase() && x.pwd === pwd.trim());
      if (!found) { setMsg(lang === 'en' ? 'Invalid credentials' : 'ਗਲਤ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ'); return; }
      setStore('punjab_usr', found);
      setUser(found);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onloadend = () => setPostImg(r.result);
      r.readAsDataURL(f);
    }
  };

  // ਕਲਾਊਡ ਵਿੱਚ ਫੋਟੋ ਪੋਸਟ ਕਰਨਾ
  const createPost = async (e) => {
    e.preventDefault();
    if (!postImg || loading) return;
    setLoading(true);

    const payload = {
      author: user.uid,
      location: "Punjab",
      image: postImg,
      caption: caption,
      likes: 0
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setPostImg(null);
        setCaption('');
        setTab('home');
        fetchCloudPosts();
      } else {
        alert("Upload error. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading post.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleSave = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const myPosts = posts.filter(p => p.u === user?.uid);
  const savedPosts = posts.filter(p => p.saved);

  const LogoBox = ({ lg }) => (
    <div className="flex flex-col items-center">
      <div className={`${lg ? 'w-32 h-32' : 'w-10 h-10'} rounded-2xl border-2 border-amber-500/70 shadow-xl bg-gradient-to-br from-red-800 via-amber-700 to-teal-900 flex flex-col items-center justify-center text-center p-1`}>
        <span className={lg ? "text-3xl" : "text-sm"}>🌾</span>
        <span className={`font-black text-white ${lg ? 'text-2xl' : 'text-xs'} tracking-wide leading-none`}>ਪੰਜਾਬ</span>
        {lg && <span className="text-[10px] italic text-amber-200 font-serif">Panjaab</span>}
      </div>
      {lg && <span className="font-black text-xl tracking-[0.2em] text-amber-400 mt-2">PUNJAB</span>}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm flex justify-end mb-3">
          <button onClick={() => setLang(lang === 'en' ? 'pa' : 'en')} className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-amber-400">
            {lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}
          </button>
        </div>
        <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-7 rounded-3xl shadow-2xl flex flex-col items-center">
          <LogoBox lg={true} />
          <div className="w-full mt-5">
            {msg && <div className="w-full bg-red-500/20 text-red-400 text-xs py-2 px-3 rounded-lg mb-3 text-center">{msg}</div>}
            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <input type="text" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
              )}
              <input type="text" placeholder={t.uid} value={uid} onChange={(e) => setUid(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
              <input type="password" placeholder={t.pwd} value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm mt-2">
                {authMode === 'login' ? t.login : t.signup}
              </button>
            </form>
            <div className="mt-4 text-center text-xs text-neutral-400">
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setMsg(''); }} className="text-amber-400 hover:underline">
                {authMode === 'login' ? t.need : t.has}
              </button>
            </div>
          </div>
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
            <LogoBox lg={false} />
            <span className="font-black text-sm tracking-wider text-amber-400">PUNJAB</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'en' ? 'pa' : 'en')} className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-amber-400">
              {lang === 'en' ? 'ਪੰ' : 'EN'}
            </button>
            <button onClick={() => { setStore('punjab_usr', null); setUser(null); }} className="text-xs text-neutral-300 hover:text-red-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded">
              {t.out}
            </button>
          </div>
        </header>

        {/* Stories Modal */}
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
              <button onClick={() => setStoryLiked(!storyLiked)} className="text-2xl">
                {storyLiked ? "❤️" : "🤍"}
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

              {/* Live Cloud Feed */}
              <div className="divide-y divide-neutral-800">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-500">
                    ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ। ਹੇਠਾਂ ਦਿੱਤੇ (➕) ਬਟਨ ਤੋਂ ਪਹਿਲੀ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ!
                  </div>
                ) : (
                  posts.map(p => (
                    <article key={p.id} className="pb-3">
                      <div className="flex items-center gap-2.5 px-4 py-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                          {p.u ? p.u[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div className="text-xs font-bold">@{p.u}</div>
                          <div className="text-[10px] text-neutral-400">{p.loc}</div>
                        </div>
                      </div>
                      <img src={p.img} alt="Post" className="w-full aspect-square object-cover" />
                      <div className="px-4 pt-2.5">
                        <div className="flex items-center justify-between mb-2 text-lg">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleLike(p.id)}>{p.liked ? "❤️" : "🤍"}</button>
                            <button>💬</button>
                            <button>↗️</button>
                          </div>
                          <button onClick={() => toggleSave(p.id)}>{p.saved ? "🔖" : "📑"}</button>
                        </div>
                        <div className="text-xs font-semibold mb-1">{p.likes} {t.likes}</div>
                        <p className="text-xs text-neutral-200"><span className="font-bold mr-1.5">@{p.u}</span>{p.cap}</p>
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
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-4 text-xl">
                    <button>❤️</button>
                    <span className="text-[11px]">{r.likes}</span>
                    <button>💬</button>
                    <button>↗️</button>
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
              <h2 className="text-sm font-bold mb-3">{t.newP}</h2>
              <form onSubmit={createPost} className="space-y-4">
                <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} className="hidden" />
                {!postImg ? (
                  <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-900/50">
                    <span className="text-3xl">📷</span>
                    <span className="text-xs text-neutral-300 font-medium text-center">{t.cam}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-800">
                      <img src={postImg} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPostImg(null)} className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white font-bold text-xs">✕</button>
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-amber-400 hover:underline">{t.change}</button>
                  </div>
                )}
                <textarea rows={3} placeholder={t.cap} value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" />
                <button type="submit" disabled={!postImg || loading} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs disabled:opacity-40 transition">
                  {loading ? "ਕਲਾਊਡ ਵਿੱਚ ਪੋਸਟ ਹੋ ਰਿਹਾ ਹੈ..." : t.share}
                </button>
              </form>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-neutral-800 flex items-center justify-center text-xl font-bold text-amber-400">
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex gap-6 text-center pr-2">
                    <div>
                      <div className="font-bold text-sm">{myPosts.length}</div>
                      <div className="text-[10px] text-neutral-400">{t.posts}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.fol}</div>
                      <div className="text-[10px] text-neutral-400">{t.fol}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.fing}</div>
                      <div className="text-[10px] text-neutral-400">{t.fing}</div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm">{user.name}</h3>
                <p className="text-xs text-neutral-400 mb-3">@{user.uid}</p>
                <button onClick={() => { setStore('punjab_usr', null); setUser(null); }} className="w-full py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-red-400">
                  {t.out}
                </button>
              </div>

              <div className="flex border-b border-neutral-800 text-xs font-semibold">
                <button onClick={() => setProfileTab('posts')} className={`flex-1 py-2.5 text-center border-b-2 ${profileTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-500'}`}>
                  {t.posts}
                </button>
                <button onClick={() => setProfileTab('saved')} className={`flex-1 py-2.5 text-center border-b-2 ${profileTab === 'saved' ? 'border-amber-500 text-amber-500' : 'border-transparent text-neutral-500'}`}>
                  Saved
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1">
                {(profileTab === 'posts' ? myPosts : savedPosts).map(item => (
                  <div key={item.id} className="aspect-square bg-neutral-900">
                    <img src={item.img} alt="post" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </di
