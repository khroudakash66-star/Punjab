import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Home, Film, PlusSquare, 
  User, LogOut, Globe, Camera, Grid, X 
} from 'lucide-react';

const safeGet = (k, def) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

const safeSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    console.warn(e);
  }
};

const PunjabLogo = ({ size = "small" }) => {
  if (size === "large") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-2xl border-2 border-amber-500/70 shadow-2xl p-2 bg-gradient-to-br from-red-800 via-amber-700 to-teal-900 flex flex-col items-center justify-center text-center">
          <span className="text-3xl select-none mb-1">🌾</span>
          <span className="font-black text-3xl text-white tracking-wide select-none drop-shadow">
            ਪੰਜਾਬ
          </span>
          <span className="text-[11px] italic text-amber-200 font-serif tracking-widest select-none">
            Panjaab
          </span>
        </div>
        <span className="font-black text-2xl tracking-[0.2em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent mt-2">
          PUNJAB
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg border border-amber-500/60 bg-gradient-to-br from-red-800 via-amber-600 to-teal-900 flex items-center justify-center shadow">
        <span className="font-black text-white text-sm">ਪੰ</span>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none">
          PUNJAB
        </span>
        <span className="text-[9px] text-amber-300 font-medium">Panjaab</span>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState(() => safeGet('punjab_user', null));
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  const [tab, setTab] = useState('home');
  const [profileTab, setProfileTab] = useState('posts');
  const [story, setStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);

  const fileRef = useRef(null);
  const [postImg, setPostImg] = useState(null);
  const [caption, setCaption] = useState('');

  const stories = [
    { id: 1, user: "amritsar", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, user: "virasat", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, user: "kisaan", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" },
    { id: 4, user: "pendu", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop" }
  ];

  const reels = [
    {
      id: 101,
      author: "virasat_punjab",
      desc: "Rangla Punjab 🌾✨ #Punjab #Reels",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
      likes: 3420
    }
  ];

  const [posts, setPosts] = useState(() => safeGet('punjab_feed', [
    {
      id: 1,
      author: "virasat_punjab",
      authorName: "Virasat Punjab",
      location: "Sri Amritsar Sahib",
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?auto=format&fit=crop&w=800&q=80",
      caption: "Golden Temple Darshan ✨ #HarmandirSahib",
      likes: 1240,
      isLiked: false,
      isSaved: false
    }
  ]));

  const t = {
    en: {
      login: "Log In", signup: "Sign Up", uid: "User ID", pass: "Password",
      name: "Full Name", needAcc: "Need account? Sign up", hasAcc: "Have account? Log in",
      out: "Logout", postBtn: "Share Post", newP: "New Post",
      cam: "Choose from Camera / Gallery", change: "Change Photo", cap: "Write a caption...",
      likes: "likes", posts: "Posts", fol: "Followers", fing: "Following"
    },
    pa: {
      login: "ਲਾਗ ਇਨ", signup: "ਸਾਈਨ ਅੱਪ", uid: "ਯੂਜ਼ਰ ਆਈਡੀ", pass: "ਪਾਸਵਰਡ",
      name: "ਪੂਰਾ ਨਾਮ", needAcc: "ਖਾਤਾ ਬਣਾਓ", hasAcc: "ਲਾਗ ਇਨ ਕਰੋ",
      out: "ਲੌਗ ਆਉਟ", postBtn: "ਸਾਂਝੀ ਕਰੋ", newP: "ਨਵੀਂ ਪੋਸਟ",
      cam: "ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਚੁਣੋ", change: "ਹੋਰ ਫੋਟੋ ਲਵੋ", cap: "ਕੁਝ ਲਿਖੋ...",
      likes: "ਪਸੰਦ", posts: "ਪੋਸਟਾਂ", fol: "ਫੋਲੋਅਰਜ਼", fing: "ਫੋਲੋਇੰਗ"
    }
  }[lang];

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthMsg('');
    const users = safeGet('punjab_users', []);

    if (authMode === 'signup') {
      if (!username.trim() || !password.trim()) {
        setAuthMsg(lang === 'en' ? 'Fill all fields' : 'ਸਾਰੇ ਖਾਨੇ ਭਰੋ');
        return;
      }
      if (users.find(u => u.uid.toLowerCase() === username.trim().toLowerCase())) {
        setAuthMsg(lang === 'en' ? 'User ID taken' : 'ਆਈਡੀ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ');
        return;
      }
      const u = { uid: username.trim(), name: name.trim() || username.trim(), pass: password.trim(), fol: 140, fing: 80 };
      users.push(u);
      safeSet('punjab_users', users);
      safeSet('punjab_user', u);
      setCurrentUser(u);
    } else {
      const u = users.find(x => x.uid.toLowerCase() === username.trim().toLowerCase() && x.pass === password.trim());
      if (!u) {
        setAuthMsg(lang === 'en' ? 'Invalid credentials' : 'ਗਲਤ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ');
        return;
      }
      safeSet('punjab_user', u);
      setCurrentUser(u);
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

  const submitPost = (e) => {
    e.preventDefault();
    if (!postImg) return;
    const np = {
      id: Date.now(),
      author: currentUser.uid,
      authorName: currentUser.name,
      location: "Punjab",
      image: postImg,
      caption,
      likes: 0,
      isLiked: false,
      isSaved: false
    };
    const updated = [np, ...posts];
    setPosts(updated);
    safeSet('punjab_feed', updated);
    setPostImg(null);
    setCaption('');
    setTab('home');
  };

  const toggleLike = (id) => {
    const u = posts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p);
    setPosts(u);
    safeSet('punjab_feed', u);
  };

  const toggleSave = (id) => {
    const u = posts.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p);
    setPosts(u);
    safeSet('punjab_feed', u);
  };

  const myPosts = posts.filter(p => p.author === currentUser?.uid);
  const savedPosts = posts.filter(p => p.isSaved);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm flex justify-end mb-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'pa' : 'en')}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-amber-400"
          >
            <Globe size={13} />
            <span>{lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}</span>
          </button>
        </div>

        <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-7 rounded-3xl shadow-2xl flex flex-col items-center">
          <PunjabLogo size="large" />

          <div className="w-full mt-5">
            {authMsg && (
              <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2 px-3 rounded-lg mb-3 text-center">
                {authMsg}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder={t.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              )}
              <input
                type="text"
                placeholder={t.uid}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="password"
                placeholder={t.pass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:opacity-95 transition mt-2"
              >
                {authMode === 'login' ? t.login : t.signup}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-neutral-400">
              <button
                onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthMsg(''); }}
                className="text-amber-400 hover:underline font-medium"
              >
                {authMode === 'login' ? t.needAcc : t.hasAcc}
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
          <PunjabLogo size="small" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'pa' : 'en')}
              className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-amber-400"
            >
              {lang === 'en' ? 'ਪੰ' : 'EN'}
            </button>
            <button 
              onClick={() => { safeSet('punjab_user', null); setCurrentUser(null); }} 
              className="flex items-center gap-1 text-xs text-neutral-300 hover:text-red-400 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded"
            >
              <LogOut size={12} />
              <span>{t.out}</span>
            </button>
          </div>
        </header>

        {/* Story Modal */}
        {story && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-200">@{story.user}</span>
              <button onClick={() => setStory(null)} className="text-white p-1">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src={story.img} alt="Story" className="max-h-[70vh] w-full object-contain rounded-2xl" />
            </div>
            <div className="flex items-center gap-3 p-2">
              <input 
                type="text" 
                placeholder={`Reply to @${story.user}...`} 
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none"
              />
              <button onClick={() => setStoryLiked(!storyLiked)}>
                <Heart size={24} className={storyLiked ? "fill-red-500 text-red-500" : "text-white"} />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {tab === 'home' && (
            <div>
              {/* Stories */}
              <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-neutral-800 no-scrollbar">
                {stories.map(s => (
                  <div key={s.id} onClick={() => { setStory(s); setStoryLiked(false); }} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300">
                      <img src={s.img} alt={s.user} className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    <span className="text-[10px] text-neutral-400">@{s.user}</span>
                  </div>
                ))}
              </div>

              {/* Feed */}
              <div className="divide-y divide-neutral-800">
                {posts.map(post => (
                  <article key={post.id} className="pb-3">
                    <div className="flex items-center gap-2.5 px-4 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                        {post.authorName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{post.authorName}</div>
                        <div className="text-[10px] text-neutral-400">{post.location}</div>
                      </div>
                    </div>

                    <img src={post.image} alt="Feed" className="w-full aspect-square object-cover" />

                    <div className="px-4 pt-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleLike(post.id)}>
                            <Heart size={22} className={post.isLiked ? "fill-red-500 text-red-500" : "text-white"} />
                          </button>
                          <MessageCircle size={22} />
                          <Send size={22} />
                        </div>
                        <button onClick={() => toggleSave(post.id)}>
                          <Bookmark size={22} className={post.isSaved ? "fill-amber-400 text-amber-400" : "text-white"} />
                        </button>
                      </div>
                      <div className="text-xs font-semibold mb-1">{post.likes.toLocaleString()} {t.likes}</div>
                      <p className="text-xs text-neutral-200">
                        <span className="font-bold mr-1.5">{post.author}</span>
                        {post.caption}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === 'reels' && (
            <div className="h-[calc(100vh-125px)] overflow-y-scroll snap-y snap-mandatory">
              {reels.map(r => (
                <div key={r.id} className="relative h-full w-full snap-start bg-black flex items-center justify-center">
                  <img src={r.img} alt="Reel" className="w-full h-full object-cover" />
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-4">
                    <Heart size={26} className="fill-red-500 text-red-500" />
                    <span className="text-[11px]">{r.likes}</span>
                    <MessageCircle size={26} />
                    <Send size={24} />
                  </div>
                  <div className="absolute left-4 bottom-6 right-16 bg-black/50 p-2.5 rounded-xl backdrop-blur-sm">
                    <div className="font-bold text-xs text-amber-400">@{r.author}</div>
                    <div className="text-xs text-neutral-200">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'create' && (
            <div className="p-4">
              <h2 className="text-sm font-bold mb-3">{t.newP}</h2>
              <form onSubmit={submitPost} className="space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileRef} 
                  onChange={handleFile} 
                  className="hidden" 
                />

                {!postImg ? (
                  <div 
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-900/50"
                  >
                    <Camera size={32} className="text-amber-400" />
                    <span className="text-xs text-neutral-300 font-medium">{t.cam}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-800">
                      <img src={postImg} alt="Upload" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setPostImg(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      {t.change}
                    </button>
                  </div>
                )}

                <textarea
                  rows={3}
                  placeholder={t.cap}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                <button
                  type="submit"
                  disabled={!postImg}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs disabled:opacity-40 transition"
                >
                  {t.postBtn}
                </button>
              </form>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-neutral-800 flex items-center justify-center text-xl font-bold text-amber-400">
                    {currentUser.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex gap-6 text-center pr-2">
                    <div>
                      <div className="font-bold text-sm">{myPosts.length}</div>
                      <div className="text-[10px] text-neutral-400">{t.posts}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{currentUser.fol}</div>
                      <div
