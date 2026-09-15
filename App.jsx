import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Home, Film, PlusSquare, 
  User, LogOut, CheckCircle2, Globe, Camera, Grid, BookmarkCheck, X 
} from 'lucide-react';

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

// ਨਵਾਂ ਕੈਲੀਗ੍ਰਾਫੀ ਪੰਜਾਬ ਲੋਗੋ ਕੰਪੋਨੈਂਟ
const PunjabCanvasLogo = ({ size = "small" }) => {
  if (size === "large") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-amber-500/60 shadow-2xl p-0.5 bg-gradient-to-br from-red-600 via-yellow-600 to-teal-800 flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full h-full rounded-2xl">
            <defs>
              <linearGradient id="artBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="35%" stopColor="#991b1b" />
                <stop offset="65%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#115e59" />
              </linearGradient>
              <filter id="canvasTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                <feBlend mode="multiply" in="SourceGraphic" in2="noise" />
              </filter>
            </defs>
            <rect width="300" height="300" fill="url(#artBg)" filter="url(#canvasTexture)" />
            <text x="150" y="170" textAnchor="middle" fill="#ffffff" stroke="#1c1917" strokeWidth="4" fontSize="82" fontWeight="900" fontFamily="sans-serif">
              ਪੰਜਾਬ
            </text>
            <text x="150" y="215" textAnchor="middle" fill="#ffffff" stroke="#1c1917" strokeWidth="1.5" fontSize="30" fontStyle="italic" fontFamily="cursive, serif">
              Panjaab
            </text>
          </svg>
        </div>
        <span className="font-extrabold text-2xl tracking-[0.25em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent mt-3">
          PUNJAB
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/50 shadow-md flex items-center justify-center bg-gradient-to-br from-red-700 via-amber-600 to-teal-800">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <text x="150" y="175" textAnchor="middle" fill="#ffffff" stroke="#000" strokeWidth="6" fontSize="100" fontWeight="900">
            ਪੰ
          </text>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent leading-none">
          PUNJAB
        </span>
        <span className="text-[10px] tracking-widest text-amber-300/80 font-medium">
          Panjaab
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState(() => safeGet('punjab_user_session', null));
  const [authMode, setAuthMode] = useState('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('home');
  const [profileSubTab, setProfileSubTab] = useState('posts'); // 'posts' | 'saved'
  const [activeStory, setActiveStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);

  const fileInputRef = useRef(null);
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [newCaption, setNewCaption] = useState('');

  const [stories, setStories] = useState([
    { id: 1, user: "amritsar", name: "ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=800&auto=format&fit=crop" },
    { id: 2, user: "virasat", name: "ਵਿਰਾਸਤ", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop" },
    { id: 3, user: "kisaan", name: "ਖੇਤ ਪੰਜਾਬ ਦੇ", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop" },
    { id: 4, user: "pendu", name: "ਪਿੰਡ", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop" }
  ]);

  const [reels, setReels] = useState([
    {
      id: 101,
      author: "virasat_punjab",
      desc: "Rangla Punjab 🌾✨ #Punjab #Virasat #Reels",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
      likes: 3420,
      isLiked: false
    },
    {
      id: 102,
      author: "kisaan_jatt",
      desc: "Desi Khet Te Thandi Hava 🚜❤️ #Kisaan",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-countryside-road-between-fields-41315-large.mp4",
      likes: 5120,
      isLiked: false
    }
  ]);

  const [posts, setPosts] = useState(() => safeGet('punjab_feed_posts_v2', [
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
    },
    {
      id: 2,
      author: "kisaan_majdoor",
      authorName: "Punjab Fields",
      location: "Malwa, Punjab",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      caption: "Lush green fields of Punjab 🌾 #Farmer",
      likes: 890,
      isLiked: false,
      isSaved: false
    }
  ]));

  const t = {
    en: {
      login: "Log In", signup: "Sign Up", forgot: "Forgot Password?",
      userId: "User ID / Username", password: "Password", newPass: "New Password",
      fullName: "Full Name", dontHave: "Don't have an account?", alreadyHave: "Already have an account?",
      logout: "Log Out", sharePost: "Share Post", newPost: "New Post",
      choosePhoto: "Select from Camera / Gallery", changePhoto: "Choose Different Photo",
      captionPlaceholder: "Write a caption...", likes: "likes", close: "Close",
      posts: "Posts", followers: "Followers", following: "Following", saved: "Saved"
    },
    pa: {
      login: "ਲਾਗ ਇਨ", signup: "ਸਾਈਨ ਅੱਪ", forgot: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
      userId: "ਯੂਜ਼ਰ ਆਈਡੀ", password: "ਪਾਸਵਰਡ", newPass: "ਨਵਾਂ ਪਾਸਵਰਡ",
      fullName: "ਪੂਰਾ ਨਾਮ", dontHave: "ਖਾਤਾ ਨਹੀਂ ਹੈ?", alreadyHave: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
      logout: "ਲੌਗ ਆਉਟ", sharePost: "ਪੋਸਟ ਕਰੋ", newPost: "ਨਵੀਂ ਪੋਸਟ",
      choosePhoto: "ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ 'ਚੋਂ ਫੋਟੋ ਚੁਣੋ", changePhoto: "ਹੋਰ ਫੋਟੋ ਚੁਣੋ",
      captionPlaceholder: "ਕੁਝ ਲਿਖੋ...", likes: "ਪਸੰਦ", close: "ਬੰਦ ਕਰੋ",
      posts: "ਪੋਸਟਾਂ", followers: "ਫੋਲੋਅਰਜ਼", following: "ਫੋਲੋਇੰਗ", saved: "ਸੇਵ ਕੀਤੀਆਂ"
    }
  }[lang];

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const users = safeGet('punjab_users_db', []);

    if (authMode === 'signup') {
      if (!usernameInput.trim() || !passwordInput.trim()) {
        setAuthError(lang === 'en' ? 'Please fill in all fields' : 'ਸਾਰੇ ਖਾਨੇ ਭਰੋ');
        return;
      }
      const exists = users.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
      if (exists) {
        setAuthError(lang === 'en' ? 'Username already taken' : 'ਯੂਜ਼ਰ ਆਈਡੀ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ');
        return;
      }
      const newUser = {
        username: usernameInput.trim(),
        name: nameInput.trim() || usernameInput.trim(),
        password: passwordInput.trim(),
        followers: 128,
        following: 95
      };
      users.push(newUser);
      safeSet('punjab_users_db', users);
      safeSet('punjab_user_session', newUser);
      setCurrentUser(newUser);
    } else if (authMode === 'login') {
      const found = users.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase() && u.password === passwordInput.trim());
      if (!found) {
        setAuthError(lang === 'en' ? 'Invalid credentials' : 'ਗਲਤ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ');
        return;
      }
      safeSet('punjab_user_session', found);
      setCurrentUser(found);
    } else if (authMode === 'forgot') {
      const idx = users.findIndex(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
      if (idx === -1) {
        setAuthError(lang === 'en' ? 'User not found' : 'ਯੂਜ਼ਰ ਨਹੀਂ ਮਿਲਿਆ');
        return;
      }
      users[idx].password = newPasswordInput.trim();
      safeSet('punjab_users_db', users);
      setAuthSuccess(lang === 'en' ? 'Password reset successfully!' : 'ਪਾਸਵਰਡ ਬਦਲ ਗਿਆ ਹੈ!');
      setTimeout(() => {
        setAuthMode('login');
        setAuthSuccess('');
      }, 1200);
    }
  };

  const handleLogout = () => {
    safeSet('punjab_user_session', null);
    setCurrentUser(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!selectedFileImage) return;

    const newPost = {
      id: Date.now(),
      author: currentUser.username,
      authorName: currentUser.name,
      location: "Punjab",
      image: selectedFileImage,
      caption: newCaption,
      likes: 0,
      isLiked: false,
      isSaved: false
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    safeSet('punjab_feed_posts_v2', updated);
    setSelectedFileImage(null);
    setNewCaption('');
    setActiveTab('home');
  };

  const handleLikePost = (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    safeSet('punjab_feed_posts_v2', updated);
  };

  const handleSavePost = (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    });
    setPosts(updated);
    safeSet('punjab_feed_posts_v2', updated);
  };

  const myPosts = posts.filter(p => p.author === currentUser?.username);
  const savedPosts = posts.filter(p => p.isSaved);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm flex justify-end mb-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'pa' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-amber-400"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}</span>
          </button>
        </div>

        <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <PunjabCanvasLogo size="large" />

          <div className="w-full mt-6">
            {authError && (
              <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2 px-3 rounded-lg mb-4 text-center">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs py-2 px-3 rounded-lg mb-4 text-center">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder={t.fullName}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                />
              )}

              <input
                type="text"
                placeholder={t.userId}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
              />

              {authMode !== 'forgot' && (
                <input
                  type="password"
                  placeholder={t.password}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                />
              )}

              {authMode === 'forgot' && (
                <input
                  type="password"
                  placeholder={t.newPass}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                />
              )}

              {authMode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    {t.forgot}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:opacity-95 transition"
              >
                {authMode === 'login' && t.login}
                {authMode === 'signup' && t.signup}
                {authMode === 'forgot' && 'Reset'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-neutral-400">
              {authMode === 'login' ? (
                <p>
                  {t.dontHave}{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-amber-400 font-semibold hover:underline">
                    {t.signup}
                  </button>
                </p>
              ) : (
                <p>
                  {t.alreadyHave}{' '}
                  <button onClick={() => setAuthMode('login')} className="text-amber-400 font-semibold hover:underline">
                    {t.login}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pb-16 font-sans">
      <div className="w-full max-w-md border-x border-neutral-800 min-h-screen flex flex-col bg-neutral-950">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
          <PunjabCanvasLogo size="small" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'pa' : 'en')}
              className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-amber-400"
            >
              {lang === 'en' ? 'ਪੰ' : 'EN'}
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-red-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md transition"
            >
              <LogOut size={13} />
              <span>{t.logout}</span>
            </button>
          </div>
        </header>

        {/* Real Instagram-Style Story Modal */}
        {activeStory && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
            {/* Top Bar with Progress */}
            <div className="p-3 z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white animate-[pulse_5s_ease-in-out]" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-amber-500 overflow-hidden">
                    <img src={activeStory.img} alt={activeStory.user} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-xs">{activeStory.name}</span>
                </div>
                <button onClick={() => setActiveStory(null)} className="p-1 text-white">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Story Image */}
            <div className="flex-1 flex items-center justify-center p-2">
              <img src={activeStory.img} alt="Story" className="max-h-[75vh] w-full object-contain rounded-2xl" />
            </div>

            {/* Bottom Story Interaction (Like & Reply) */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-3">
              <input 
                type="text" 
                placeholder={`Reply to @${activeStory.user}...`}
                className="flex-1 bg-transparent border border-white/40 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/60 focus:outline-none focus:border-white"
              />
              <button 
                onClick={() => setStoryLiked(!storyLiked)} 
                className="p-1 transition active:scale-125"
              >
                <Heart size={26} className={storyLiked ? "fill-red-500 text-red-500" : "text-white"} />
              </button>
              <button className="p-1 text-white">
                <Send size={24} />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          
          {/* HOME FEED */}
          {activeTab === 'home' && (
            <div>
              {/* Instagram Stories Carousel */}
              <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-neutral-800 no-scrollbar">
                {stories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => { setActiveStory(story); setStoryLiked(false); }}
                    className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300">
                      <img src={story.img} alt={story.user} className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    <span cla
