import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Home, Film, PlusSquare, User, LogOut, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage warning", e);
  }
};

const PunjabBadge = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-500 text-sm">
      ੴ
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold tracking-widest text-lg bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
        PUNJAB
      </span>
      <span className="text-[9px] tracking-wider text-amber-300/70 -mt-1 font-serif">ਪੰਜਾਬ ਵਿਰਾਸਤ</span>
    </div>
  </div>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => safeGet('punjab_current_user', null));
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'reels' | 'create' | 'profile'
  const [activeStory, setActiveStory] = useState(null);

  // ਸਟੋਰੀਜ਼ ਡਾਟਾ
  const stories = [
    { id: 1, user: "ਅੰਮ੍ਰਿਤਸਰ", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, user: "ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, user: "ਖੇਤ ਪੰਜਾਬ ਦੇ", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" },
    { id: 4, user: "ਵਿਰਾਸਤ", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop" }
  ];

  // ਰੀਲਜ਼ ਡਾਟਾ
  const [reels, setReels] = useState([
    {
      id: 101,
      author: "virasat_punjab",
      desc: "ਸੋਹਣਾ ਪੰਜਾਬ, ਹੱਸਦਾ-ਵੱਸਦਾ ਪੰਜਾਬ 🌾✨ #Punjab #Virasat #Reels",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
      likes: 3420,
      isLiked: false
    },
    {
      id: 102,
      author: "kisaan_jatt",
      desc: "ਖੇਤਾਂ ਦੀ ਮਹਿਕ ਤੇ ਠੰਢੀ ਹਵਾ 🚜❤️ #Kisaan #DesiPunjab",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-countryside-road-between-fields-41315-large.mp4",
      likes: 5120,
      isLiked: false
    }
  ]);

  // ਪੋਸਟਾਂ ਡਾਟਾ
  const [posts, setPosts] = useState(() => safeGet('punjab_posts', [
    {
      id: 1,
      author: "virasat_punjab",
      authorName: "ਪੰਜਾਬੀ ਵਿਰਾਸਤ",
      location: "ਅੰਮ੍ਰਿਤਸਰ, ਪੰਜਾਬ",
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?auto=format&fit=crop&w=800&q=80",
      caption: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਜੀ ਦੇ ਸੁਨਹਿਰੀ ਦਰਸ਼ਨ ਦੀਦਾਰ ✨ #HarmandirSahib #Amritsar",
      likes: 1240,
      isLiked: false,
      comments: 42
    },
    {
      id: 2,
      author: "kisaan_majdoor",
      authorName: "ਕਿਸਾਨੀ ਪੰਜਾਬ",
      location: "ਮਾਲਵਾ, ਪੰਜਾਬ",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      caption: "ਸੋਨੇ ਰੰਗੀ ਕਣਕ ਤੇ ਪੰਜਾਬ ਦੇ ਹਰੇ-ਭਰੇ ਖੇਤ 🌾 #Farmer #PunjabFields",
      likes: 890,
      isLiked: false,
      comments: 19
    }
  ]));

  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const users = safeGet('punjab_registered_users', []);

    if (authMode === 'signup') {
      if (!usernameInput.trim() || !passwordInput.trim()) {
        setAuthError('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖਾਨੇ ਭਰੋ');
        return;
      }
      const exists = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
      if (exists) {
        setAuthError('ਇਹ ਯੂਜ਼ਰ ਆਈਡੀ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਹੈ');
        return;
      }
      const newUser = {
        username: usernameInput.trim(),
        name: nameInput.trim() || usernameInput.trim(),
        password: passwordInput.trim()
      };
      users.push(newUser);
      safeSet('punjab_registered_users', users);
      safeSet('punjab_current_user', newUser);
      setCurrentUser(newUser);
    } 
    else if (authMode === 'login') {
      if (!usernameInput.trim() || !passwordInput.trim()) {
        setAuthError('ਯੂਜ਼ਰ ਆਈਡੀ ਅਤੇ ਪਾਸਵਰਡ ਭਰੋ');
        return;
      }
      const found = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);
      if (!found) {
        setAuthError('ਯੂਜ਼ਰ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ ਗਲਤ ਹੈ');
        return;
      }
      safeSet('punjab_current_user', found);
      setCurrentUser(found);
    } 
    else if (authMode === 'forgot') {
      if (!usernameInput.trim() || !newPasswordInput.trim()) {
        setAuthError('ਯੂਜ਼ਰ ਆਈਡੀ ਅਤੇ ਨਵਾਂ ਪਾਸਵਰਡ ਭਰੋ');
        return;
      }
      const userIndex = users.findIndex(u => u.username.toLowerCase() === usernameInput.toLowerCase());
      if (userIndex === -1) {
        setAuthError('ਇਹ ਯੂਜ਼ਰ ਆਈਡੀ ਨਹੀਂ ਮਿਲੀ');
        return;
      }
      users[userIndex].password = newPasswordInput.trim();
      safeSet('punjab_registered_users', users);
      setAuthSuccess('ਪਾਸਵਰਡ ਸਫ਼ਲਤਾਪੂਰਵਕ ਬਦਲ ਗਿਆ ਹੈ! ਹੁਣ ਲਾਗ ਇਨ ਕਰੋ।');
      setTimeout(() => {
        setAuthMode('login');
        setPasswordInput('');
        setNewPasswordInput('');
        setAuthSuccess('');
      }, 1500);
    }
  };

  const handleLogout = () => {
    safeSet('punjab_current_user', null);
    setCurrentUser(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleLikePost = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    setPosts(updated);
    safeSet('punjab_posts', updated);
  };

  const handleLikeReel = (id) => {
    setReels(reels.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
          likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newImage.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: currentUser.username,
      authorName: currentUser.name,
      location: "ਪੰਜਾਬ",
      image: newImage,
      caption: newCaption,
      likes: 0,
      isLiked: false,
      comments: 0
    };

    const updated = [newPostObj, ...posts];
    setPosts(updated);
    safeSet('punjab_posts', updated);
    setNewImage('');
    setNewCaption('');
    setActiveTab('home');
  };

  // ਲੌਗਇਨ / ਸਾਈਨ ਅੱਪ / ਫ਼ਾਰਗੌਟ ਪਾਸਵਰਡ ਸਕ੍ਰੀਨ
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col items-center">
          <PunjabBadge />
          
          <h2 className="text-xl font-bold mt-6 mb-2">
            {authMode === 'login' && 'ਜੀ ਆਇਆਂ ਨੂੰ'}
            {authMode === 'signup' && 'ਨਵਾਂ ਅਕਾਊਂਟ ਬਣਾਓ'}
            {authMode === 'forgot' && 'ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ'}
          </h2>

          <p className="text-xs text-neutral-400 mb-6 text-center">
            {authMode === 'login' && 'ਆਪਣੀ ਯੂਜ਼ਰ ਆਈਡੀ ਤੇ ਪਾਸਵਰਡ ਨਾਲ ਦਾਖਲ ਹੋਵੋ'}
            {authMode === 'signup' && 'ਪੰਜਾਬੀ ਕਮਿਊਨਿਟੀ ਨਾਲ ਜੁੜਨ ਲਈ ਸਾਈਨ ਅੱਪ ਕਰੋ'}
            {authMode === 'forgot' && 'ਆਪਣੀ ਆਈਡੀ ਭਰ ਕੇ ਨਵਾਂ ਪਾਸਵਰਡ ਬਣਾਓ'}
          </p>

          {authError && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2 px-3 rounded-lg mb-4 text-center">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs py-2 px-3 rounded-lg mb-4 flex items-center justify-center gap-1.5 text-center">
              <CheckCircle2 size={14} />
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuth} className="w-full space-y-3">
            {authMode === 'signup' && (
              <input
                type="text"
                placeholder="ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ (Full Name)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            )}

            <input
              type="text"
              placeholder="ਯੂਜ਼ਰ ਆਈਡੀ (User ID / Username)"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
            />

            {authMode !== 'forgot' && (
              <input
                type="password"
                placeholder="ਪਾਸਵਰਡ (Password)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            )}

            {authMode === 'forgot' && (
              <input
                type="password"
                placeholder="ਨਵਾਂ ਪਾਸਵਰਡ (New Password)"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            )}

            {authMode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-[11px] text-amber-400/80 hover:text-amber-400 hover:underline"
                >
                  ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ? (Forgot Password?)
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold text-sm hover:opacity-90 transition mt-2"
            >
              {authMode === 'login' && 'ਲਾਗ ਇਨ (Log In)'}
              {authMode === 'signup' && 'ਸਾਈਨ ਅੱਪ (Sign Up)'}
              {authMode === 'forgot' && 'ਪਾਸਵਰਡ ਬਦਲੋ (Reset Password)'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-400">
            {authMode === 'login' && (
              <p>
                ਖਾਤਾ ਨਹੀਂ ਹੈ?{' '}
                <button
                  onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  ਸਾਈਨ ਅੱਪ ਕਰੋ
                </button>
              </p>
            )}

            {(authMode === 'signup' || authMode === 'forgot') && (
              <p>
                ਵਾਪਸ ਲੌਗਇਨ ਕਰਨਾ ਹੈ?{' '}
                <button
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  ਲਾਗ ਇਨ ਕਰੋ
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pb-16">
      <div className="w-full max-w-md border-x border-neutral-800 min-h-screen flex flex-col bg-neutral-950">
        
        {/* ਟਾਪ ਹੈਡਰ */}
        <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
          <PunjabBadge />
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} title="ਲੌਗ ਆਉਟ" className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800">
              <LogOut size={15} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* ਸਟੋਰੀ ਵੇਖਣ ਵਾਲਾ ਮਾਡਲ */}
        {activeStory && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-white">
              <span className="font-bold text-sm">{activeStory.user} ਦੀ ਸਟੋਰੀ</span>
              <button onClick={() => setActiveStory(null)} className="text-white font-bold p-2 text-lg">✕</button>
            </div>
            <div className="flex-1 flex items-center justify-center my-4">
              <img src={activeStory.img} alt="Story" className="max-h-[75vh] w-full object-cover rounded-2xl" />
            </div>
            <button onClick={() => setActiveStory(null)} className="py-2.5 bg-neutral-800 text-white rounded-lg text-xs font-semibold">
              ਬੰਦ ਕਰੋ
            </button>
          </div>
        )}

        {/* ਮੁੱਖ ਕੰਟੈਂਟ ਸਕ੍ਰੀਨਾਂ */}
        <main className="flex-1 overflow-y-auto">
          
          {/* HOME TAB (ਸਟੋਰੀਜ਼ + ਪੋਸਟਾਂ) */}
          {activeTab === 'home' && (
            <div>
              {/* Instagram Style Stories */}
              <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-neutral-800 no-scrollbar">
                {stories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => setActiveStory(story)}
                    className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300">
                      <img src={story.img} alt={story.user} className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    <span className="text-[11px] text-neutral-300 truncate w-16 text-center">{story.user}</span>
                  </div>
                ))}
              </div>

              {/* Feed Posts */}
              <div className="divide-y divide-neutral-800">
                {posts.map(post => (
                  <article key={post.id} className="pb-4">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                        {post.authorName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{post.authorName}</div>
                        <div className="text-[10px] text-neutral-400">{post.location}</div>
                      </div>
                    </div>

                    <img src={post.image} alt="Post" className="w-full aspect-square object-cover" />

                    <div className="px-4 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleLikePost(post.id)}>
                            <Heart size={22} className={post.isLiked ? "fill-red-500 text-red-500" : "text-white"} />
                          </button>
                          <MessageCircle size={22} className="text-white" />
                          <Send size={22} className="text-white" />
                        </div>
                        <Bookmark size={22} className="text-white" />
                      </div>
                      <div className="text-xs font-semibold mb-1">{post.likes.toLocaleString()} ਪਸੰਦ (Likes)</div>
                      <p className="text-xs text-neutral-200">
                        <span className="font-bold mr-2">{post.author}</span>
                        {post.caption}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* REELS TAB (ਇੰਸਟਾਗ੍ਰਾਮ ਵਰਗੀਆਂ ਵੀਡੀਓ ਰੀਲਜ਼) */}
          {activeTab === 'reels' && (
            <div className="h-[calc(100vh-125px)] overflow-y-scroll snap-y snap-mandatory">
              {reels.map(reel => (
                <div key={reel.id} className="relative h-full w-full snap-start bg-black flex items-center justify-center">
                  <video
                    src={reel.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  
                  {/* ਰੀਲਜ਼ ਦੇ ਸਾਈਡ ਬਟਨ */}
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-5">
                    <button onClick={() => handleLikeReel(reel.id)} className="flex flex-col items-center">
                      <Heart size={28} className={reel.isLiked ? "fill-red-500 text-red-500" : "text-white"} />
                      <span className="text-[11px] mt-1 font-semibold">{reel.likes}</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <MessageCircle size={28} className="text-white" />
                      <span className="text-[11px] mt-1 font-semibold">120</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <Send size={26} className="text-white" />
                      <span className="text-[11px] mt-1 font-semibold">Share</span>
                    </button>
                  </div>

                  {/* ਰੀਲਜ਼ ਕੈਪਸ਼ਨ */}
                  <div className="absolute left-4 bottom-6 right-16">
                    <div className="font-bold text-sm text-amber-400 mb-1">@{reel.author}</div>
                    <div className="text-xs text-neutral-200 line-clamp-2">{reel.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CREATE TAB */}
          {activeTab === 'create' && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">ਨਵੀਂ ਪੋਸਟ ਸ਼ੇਅਰ ਕਰੋ</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">ਤਸਵੀਰ ਦਾ ਲਿੰਕ (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs foc
