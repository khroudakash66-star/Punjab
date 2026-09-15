import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Home, Film, PlusSquare, User, LogOut, CheckCircle2 } from 'lucide-react';

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

// Punjab Heritage Map & Emblem SVG (100% reliable, no broken links)
const PunjabHeritageArt = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>

    {/* Map Border & Landmass */}
    <path 
      d="M210 30 C270 50, 310 90, 320 140 C330 180, 390 220, 370 280 C350 330, 310 360, 260 410 C210 430, 180 390, 150 330 C120 300, 40 270, 50 200 C60 140, 110 110, 140 80 Z" 
      fill="url(#mapBg)" 
      stroke="#f59e0b" 
      strokeWidth="4" 
      strokeDasharray="6 3"
    />

    {/* Khanda Sahib Emblem at the top */}
    <g transform="translate(260, 50) scale(0.65)">
      <circle cx="50" cy="50" r="32" stroke="#fbbf24" strokeWidth="6" fill="none" />
      <path d="M50 10 L50 90" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      <path d="M25 40 Q50 90 50 90 Q50 90 75 40" stroke="#fbbf24" strokeWidth="6" fill="none" />
    </g>

    {/* Wheat Stalks (ਕਣਕ ਦੀਆਂ ਬੱਲੀਆਂ) */}
    <g transform="translate(90, 75) scale(0.7)">
      <path d="M40 90 Q30 50 10 20" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M40 90 Q50 50 70 20" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="15" cy="25" r="7" fill="#fbbf24" />
      <circle cx="30" cy="45" r="7" fill="#fbbf24" />
      <circle cx="65" cy="25" r="7" fill="#fbbf24" />
      <circle cx="50" cy="45" r="7" fill="#fbbf24" />
    </g>

    {/* Central Gurmukhi Typography: ਪੰਜਾਬ */}
    <text 
      x="200" 
      y="245" 
      textAnchor="middle" 
      fill="#ffffff" 
      fontSize="62" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="2"
      filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.8))"
    >
      ਪੰਜਾਬ
    </text>

    {/* Heritage Tractor Motif */}
    <g transform="translate(90, 275) scale(0.65)">
      <circle cx="35" cy="65" r="22" stroke="#fbbf24" strokeWidth="5" fill="#171717" />
      <circle cx="105" cy="72" r="15" stroke="#fbbf24" strokeWidth="5" fill="#171717" />
      <path d="M35 65 L80 65 L85 45 L50 45 L50 25 L105 25 L105 72" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M60 25 L60 10 L70 10" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Dhol Motif */}
    <g transform="translate(240, 280) scale(0.6)">
      <ellipse cx="60" cy="50" rx="30" ry="45" fill="#d97706" stroke="#fbbf24" strokeWidth="5" />
      <path d="M35 25 L85 75 M35 75 L85 25" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.8" />
    </g>
  </svg>
);

const PunjabLogo = ({ size = "small" }) => {
  if (size === "large") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-36 h-36 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-neutral-900/60 p-2 flex items-center justify-center backdrop-blur-md">
          <PunjabHeritageArt />
        </div>
        <span className="font-extrabold text-2xl tracking-[0.25em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent mt-3">
          PUNJAB
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 bg-neutral-900 flex items-center justify-center p-1">
        <PunjabHeritageArt />
      </div>
      <span className="font-extrabold text-lg tracking-[0.2em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent">
        PUNJAB
      </span>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => safeGet('punjab_user_session', null));
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('home');
  const [activeStory, setActiveStory] = useState(null);

  const stories = [
    { id: 1, user: "amritsar", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, user: "heritage", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, user: "fields", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" },
    { id: 4, user: "culture", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop" }
  ];

  const [reels, setReels] = useState([
    {
      id: 101,
      author: "virasat_punjab",
      desc: "Virasat-E-Punjab 🌾✨ #Punjab #Virasat #Reels",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
      likes: 3420,
      isLiked: false
    },
    {
      id: 102,
      author: "kisaan_jatt",
      desc: "Fields of Punjab 🚜❤️ #Kisaan #DesiPunjab",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-countryside-road-between-fields-41315-large.mp4",
      likes: 5120,
      isLiked: false
    }
  ]);

  const [posts, setPosts] = useState(() => safeGet('punjab_feed_posts', [
    {
      id: 1,
      author: "virasat_punjab",
      authorName: "Virasat Punjab",
      location: "Sri Amritsar Sahib",
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?auto=format&fit=crop&w=800&q=80",
      caption: "Golden Temple Darshan ✨ #HarmandirSahib #Amritsar",
      likes: 1240,
      isLiked: false
    },
    {
      id: 2,
      author: "kisaan_majdoor",
      authorName: "Punjab Fields",
      location: "Malwa, Punjab",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      caption: "Lush green fields of Punjab 🌾 #Farmer #PunjabFields",
      likes: 890,
      isLiked: false
    }
  ]));

  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const users = safeGet('punjab_accounts_v4', []);

    if (authMode === 'signup') {
      if (!usernameInput.trim() || !passwordInput.trim()) {
        setAuthError('Please fill in all fields');
        return;
      }
      const exists = users.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
      if (exists) {
        setAuthError('User ID is already taken');
        return;
      }
      const newUser = {
        username: usernameInput.trim(),
        name: nameInput.trim() || usernameInput.trim(),
        password: passwordInput.trim()
      };
      users.push(newUser);
      safeSet('punjab_accounts_v4', users);
      safeSet('punjab_user_session', newUser);
      setCurrentUser(newUser);
    } 
    else if (authMode === 'login') {
      if (!usernameInput.trim() || !passwordInput.trim()) {
        setAuthError('Please enter User ID and Password');
        return;
      }
      const found = users.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase() && u.password === passwordInput.trim());
      if (!found) {
        setAuthError('Invalid User ID or Password');
        return;
      }
      safeSet('punjab_user_session', found);
      setCurrentUser(found);
    } 
    else if (authMode === 'forgot') {
      if (!usernameInput.trim() || !newPasswordInput.trim()) {
        setAuthError('Please enter User ID and New Password');
        return;
      }
      const userIndex = users.findIndex(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
      if (userIndex === -1) {
        setAuthError('User ID not found');
        return;
      }
      users[userIndex].password = newPasswordInput.trim();
      safeSet('punjab_accounts_v4', users);
      setAuthSuccess('Password updated successfully! Redirecting...');
      setTimeout(() => {
        setAuthMode('login');
        setPasswordInput('');
        setNewPasswordInput('');
        setAuthSuccess('');
      }, 1400);
    }
  };

  const handleLogout = () => {
    safeSet('punjab_user_session', null);
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
    safeSet('punjab_feed_posts', updated);
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
      location: "Punjab",
      image: newImage,
      caption: newCaption,
      likes: 0,
      isLiked: false
    };

    const updated = [newPostObj, ...posts];
    setPosts(updated);
    safeSet('punjab_feed_posts', updated);
    setNewImage('');
    setNewCaption('');
    setActiveTab('home');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center">
          <PunjabLogo size="large" />

          <div className="w-full mt-6">
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

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-neutral-500"
                />
              )}

              <input
                type="text"
                placeholder="User ID / Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-neutral-500"
              />

              {authMode !== 'forgot' && (
                <input
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-neutral-500"
                />
              )}

              {authMode === 'forgot' && (
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-neutral-500"
                />
              )}

              {authMode === 'login' && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:opacity-95 transition mt-3"
              >
                {authMode === 'login' && 'Log In'}
                {authMode === 'signup' && 'Sign Up'}
                {authMode === 'forgot' && 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-neutral-400">
              {authMode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              )}

              {(authMode === 'signup' || authMode === 'forgot') && (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Log In
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
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between">
          <PunjabLogo size="small" />
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-red-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg transition"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </header>

        {/* Stories Viewer Modal */}
        {activeStory && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-white pt-2">
              <span className="font-bold text-sm">@{activeStory.user}'s story</span>
              <button onClick={() => setActiveStory(null)} className="text-white font-bold text-xl px-2">✕</button>
            </div>
            <div className="flex-1 flex items-center justify-center my-4">
              <img src={activeStory.img} alt="Story" className="max-h-[75vh] w-full object-cover rounded-2xl" />
            </div>
            <button onClick={() => setActiveStory(null)} className="py-2.5 bg-neutral-800 text-white rounded-lg text-xs font-semibold">
              Close
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          
          {/* Feed */}
          {activeTab === 'home' && (
            <div>
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
                    <span className="text-[11px] text-neutral-300 truncate w-16 text-center">@{story.user}</span>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-neutral-800">
                {posts.map(post => (
                  <article key={post.id} className="pb-4">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">
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
                      <div className="text-xs font-semibold mb-1">{post.likes.toLocaleString()} likes</div>
                      <p className="text-xs text-neutral-200">
                        <span className="font-bold mr-2">{post.author}</span>
                        {post.caption}
                      </p>
                    </div>
