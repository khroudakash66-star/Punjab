import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  PlusSquare,
  Search,
  Home,
  Film,
  User,
  Sparkles,
  MoreHorizontal,
  X,
  Camera,
  Award,
  LogOut,
  Volume2,
  VolumeX,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

// ਸੁਰੱਖਿਅਤ ਸਟੋਰੇਜ (ਕਦੇ ਕ੍ਰੈਸ਼ ਨਹੀਂ ਹੋਣ ਦੇਵੇਗੀ)
const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSet = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

// ਤੁਹਾਡਾ ਅਸਲ ਪੰਜਾਬ ਲੋਗੋ (ਨਕਸ਼ਾ + ਕੈਲੀਗ੍ਰਾਫ਼ੀ ਪੰਜਾਬ + ਕਣਕ ਦੀਆਂ ਬੱਲੀਆਂ)
const PunjabMapBadge = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 200 240" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M105 32 L109 38 L104 45 L94 48 L93 54 L84 62 L80 62 L74 69 L67 69 L62 76 L54 77 L52 85 L56 89 L51 94 L53 103 L46 111 L48 119 L40 125 L37 136 L34 144 L37 151 L33 158 L37 165 L32 170 L34 178 L45 180 L58 178 L71 180 L80 184 L88 198 L92 208 L98 205 L106 189 L112 184 L119 187 L124 177 L129 179 L132 173 L142 173 L144 163 L152 163 L153 151 L144 148 L147 138 L139 135 L140 128 L133 125 L129 116 L124 117 L120 108 L124 100 L119 96 L121 86 L114 83 L110 74 L111 65 L104 57 L106 48 L103 40 Z" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
    <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M82 108 C82 99 88 95 93 95 L93 118" />
      <path d="M82 106 L93 106" />
      <path d="M94 90 C96 87 99 87 101 90" strokeWidth="2" />
      <path d="M99 100 L108 100 C110 100 112 103 110 107 C108 111 104 111 104 114 C104 117 108 118 111 117" />
      <path d="M115 99 L115 118" />
      <path d="M119 101 L128 101 L128 117 L119 117 L119 101" />
      <path d="M119 109 L128 109" />
    </g>
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M92 196 C105 186 118 174 134 150 C146 132 155 116 166 102" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M102 186 C112 170 114 150 110 140 C116 152 120 168 124 178" fill="#525252" stroke="currentColor" strokeWidth="1.2" />
      <g fill="#D4AF37" stroke="#B8860B" strokeWidth="1.2">
        <path d="M136 146 C138 141 145 141 146 146 C145 151 138 151 136 146 Z" />
        <path d="M144 138 C146 133 153 133 154 138 C153 143 146 143 144 138 Z" />
        <path d="M142 147 C145 143 151 145 151 149 C149 154 144 152 142 147 Z" />
        <path d="M151 129 C153 124 160 124 161 129 C160 134 153 134 151 129 Z" />
        <path d="M149 137 C152 133 158 135 158 139 C156 144 151 142 149 137 Z" />
        <path d="M158 120 C160 115 167 115 168 120 C167 125 160 125 158 120 Z" />
        <path d="M156 128 C159 124 165 126 165 130 C163 135 158 133 156 128 Z" />
        <path d="M165 111 C167 106 174 106 175 111 C174 116 167 116 165 111 Z" />
        <path d="M172 102 C174 97 180 97 181 102 C180 107 174 107 172 102 Z" />
      </g>
      <g stroke="#B8860B" strokeWidth="1" strokeLinecap="round">
        <path d="M146 141 L156 134" />
        <path d="M154 133 L166 124" />
        <path d="M161 124 L174 114" />
        <path d="M168 115 L182 105" />
        <path d="M175 106 L190 96" />
        <path d="M181 97 L196 88" />
      </g>
    </g>
  </svg>
);

const INITIAL_PUNJAB_POSTS = [
  {
    id: 'post_virasat_1',
    authorName: 'PindDiVirasat',
    authorHandle: 'PindDiVirasat',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    content: 'ਪੁਰਾਣੀਆਂ ਯਾਦਾਂ: ਪਿੰਡ ਦਾ ਦਰਵਾਜ਼ਾ\n#PunjabMemories #Culture',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    likesCount: 11776,
    likes: ['user_pind'],
    isFollowing: false,
    timestamp: '3 hours ago',
    comments: [
      { id: 'c1', handle: 'PindDiVirasat', text: 'ਪੁਰਾਣੀ ਵਿਰਾਸਤ ਸਾਡੀ ਅਸਲ ਪਛਾਣ ਹੈ।' }
    ],
    tag: 'ਦਰਵਾਜ਼ਾ'
  },
  {
    id: 'post_virasat_2',
    authorName: 'PindDiVirasat',
    authorHandle: 'PindDiVirasat',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'ਸਾਡੇ ਬਜ਼ੁਰਗ, ਸਾਡੀ ਸ਼ਾਨ।\n#PunjabMemories #Culture',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    likesCount: 8940,
    likes: [],
    isFollowing: false,
    timestamp: '5 hours ago',
    comments: [],
    tag: 'ਸਾਡੇ ਬਜ਼ੁਰਗ'
  }
];

const INITIAL_STORIES = [
  {
    id: 'st_1',
    authorHandle: 'PindDiVirasat',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [posts, setPosts] = useState(() => safeGet('punjab_posts', INITIAL_PUNJAB_POSTS));
  const [stories] = useState(INITIAL_STORIES);
  const [savedPostIds, setSavedPostIds] = useState(() => safeGet('punjab_saved', []));
  const [chats, setChats] = useState(() => safeGet('punjab_chats', [
    { id: '1', from: 'PindDiVirasat', text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! PUNJAB ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।', timestamp: '11:00 AM' }
  ]));

  const [activeStory, setActiveStory] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 900);
    const user = safeGet('punjab_user', {
      id: 'usr_1',
      handle: 'punjabi_user',
      fullName: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'ਸਾਡਾ ਮਾਣ ਸਾਡਾ ਪੰਜਾਬ 🌾',
      points: 250,
      following: ['PindDiVirasat'],
      followers: 180
    });
    setCurrentUser(user);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => { safeSet('punjab_posts', posts); }, [posts]);
  useEffect(() => { safeSet('punjab_saved', savedPostIds); }, [savedPostIds]);
  useEffect(() => { safeSet('punjab_chats', chats); }, [chats]);

  const showToast = (txt) => {
    setToastMsg(txt);
    setTimeout(() => setToastMsg(''), 2200);
  };

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const hasLiked = p.likes?.includes(currentUser.handle);
        return {
          ...p,
          likes: hasLiked ? p.likes.filter(h => h !== currentUser.handle) : [...(p.likes || []), currentUser.handle],
          likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));
  };

  const handleSave = (id) => {
    setSavedPostIds(prev => {
      const isSaved = prev.includes(id);
      showToast(isSaved ? 'ਬੁੱਕਮਾਰਕ ਵਿੱਚੋਂ ਹਟਾਇਆ' : 'ਬੁੱਕਮਾਰਕ ਵਿੱਚ ਸੇਵ ਕੀਤਾ');
      return isSaved ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const handlePublish = (newPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab('home');
    showToast('ਪੋਸਟ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸਾਂਝੀ ਕੀਤੀ ਗਈ!');
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-28 h-32 bg-neutral-900 border border-neutral-800 rounded-3xl p-3 flex items-center justify-center shadow-2xl">
            <PunjabMapBadge className="w-24 h-28 text-white" />
          </div>
          <h1 className="text-3xl font-serif tracking-widest text-white uppercase font-bold">PUNJAB</h1>
          <p className="text-xs text-neutral-400">ਸਾਡਾ ਮਾਣ ਸਾਡਾ ਪੰਜਾਬ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-black border-x border-neutral-900 min-h-screen flex flex-col relative pb-16">
        
        {toastMsg && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center space-x-1">
            <Sparkles size={12} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-3.5 py-2.5 flex items-center justify-between">
          <div onClick={() => setActiveTab('home')} className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center p-0.5">
              <PunjabMapBadge className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-lg font-serif tracking-widest font-bold uppercase">PUNJAB</h1>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveTab('yaadan')}
              className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition ${
                activeTab === 'yaadan' ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-700 text-white'
              }`}
            >
              ਯਾਦਾਂ
            </button>
            <button onClick={() => setActiveTab('messages')} className="text-white">
              <Send size={18} className="rotate-12" />
            </button>
          </div>
        </header>

        {/* Main Pages */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="pt-2">
              <div className="flex items-center space-x-3 overflow-x-auto px-4 pb-2 border-b border-neutral-900 scrollbar-none">
                {stories.map(st => (
                  <div key={st.id} onClick={() => setActiveStory(st)} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
                    <div className="w-14 h-14 rounded-full p-[2px] border-2 border-white">
                      <img src={st.avatarUrl} alt="" className="w-full h-full rounded-full object-cover grayscale" />
                    </div>
                    <span className="text-[10px] text-neutral-400">{st.authorHandle}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-2">
                {posts.map(post => (
                  <article key={post.id} className="border-b border-neutral-900 pb-3">
                    <div className="flex items-center px-3.5 py-2 space-x-2">
                      <img src={post.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover grayscale" />
                      <div>
                        <span className="font-bold text-xs block">{post.authorName}</span>
                        <span className="text-[10px] text-neutral-500">@{post.authorHandle}</span>
                      </div>
                    </div>
                    <div className="aspect-square bg-neutral-950 w-full">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="px-3.5 pt-2 flex justify-between">
                      <div className="flex space-x-4">
                        <button onClick={() => handleLike(post.id)}>
                          <Heart size={20} className={post.likes?.includes(currentUser.handle) ? 'fill-white text-white' : 'text-white'} />
                        </button>
                        <MessageCircle size={20} />
                        <Share2 size={19} />
                      </div>
                      <button onClick={() => handleSave(post.id)}>
                        <Bookmark size={20} className={savedPostIds.includes(post.id) ? 'fill-white text-white' : 'text-white'} />
                      </button>
                    </div>
                    <div className="px-3.5 pt-1 text-xs font-bold">{post.likesCount} likes</div>
                    <div className="px-3.5 text-xs text-neutral-300 pt-0.5 whitespace-pre-line">
                      <span className="font-bold text-white mr-1.5">{post.authorHandle}</span>
                      {post.content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <CreatePostScreen currentUser={currentUser} onPublish={handlePublish} onCancel={() => setActiveTab('home')} />
          )}

          {activeTab === 'reels' && (
            <div className="relative h-[calc(100vh-120px)] bg-neutral-950 flex flex-col justify-end p-4">
              <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80" alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-bold">@PindDiVirasat</span>
                <p className="text-xs text-neutral-200">ਸਾਡੇ ਬਜ਼ੁਰਗ, ਸਾਡੀ ਸ਼ਾਨ। ਪੰਜਾਬ ਦਾ ਵਿਰਸਾ 🌾</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <img src={currentUser.avatarUrl} alt="" className="w-16 h-16 rounded-full grayscale border border-neutral-700" />
                <div>
                  <h3 className="font-bold text-sm">{currentUser.fullName}</h3>
                  <p className="text-xs text-neutral-400">@{currentUser.handle}</p>
                  <p className="text-xs text-neutral-300 mt-1">{currentUser.bio}</p>
                </div>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                <span className="text-xs font-bold">PUNJAB Points</span>
                <span className="font-serif font-bold text-lg">{currentUser.points}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2">
                {posts.map(p => (
                  <div key={p.id} className="aspect-square bg-neutral-900">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'yaadan' && (
            <div className="p-3 space-y-3">
              <h2 className="text-base font-serif font-bold">ਪੰਜਾਬ ਦੀਆਂ ਯਾਦਾਂ</h2>
              <div className="grid grid-cols-2 gap-2">
                {posts.map(p => (
                  <div key={p.id} className="bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800">
                    <img src={p.imageUrl} alt="" className="w-full aspect-square object-cover grayscale" />
                    <p className="p-1.5 text-[11px] font-bold truncate">{p.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-3 flex flex-col h-[calc(100vh-120px)]">
              <div className="flex-1 space-y-2 overflow-y-auto">
                {chats.map(c => (
                  <div key={c.id} className={`flex ${c.from === currentUser.handle ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-xl text-xs ${c.from === currentUser.handle ? 'bg-white text-black' : 'bg-neutral-900 text-white'}`}>
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-md border-t border-neutral-900 flex justify-around py-2.5 z-40">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-white' : 'text-neutral-500'}><Home size={22} /></button>
          <button onClick={() => setActiveTab('yaadan')} className={activeTab === 'yaadan' ? 'text-white' : 'text-neutral-500'}><Sparkles size={22} /></button>
          <button onClick={() => setActiveTab('create')} className={activeTab === 'create' ? 'text-white' : 'text-neutral-500'}><PlusSquare size={22} /></button>
          <button onClick={() => setActiveTab('reels')} className={activeTab === 'reels' ? 'text-white' : 'text-neutral-500'}><Film size={22} /></button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'text-white' : 'text-neutral-500'}><User size={22} /></button>
        </nav>

      </div>
    </div>
  );
}

// ਸੁਰੱਖਿਅਤ ਪੋਸਟ ਕ੍ਰਿਏਟਰ (ਬਿਨਾਂ ਕਿਸੇ ਕੈਮਰਾ ਕ੍ਰੈਸ਼ ਤੋਂ)
function CreatePostScreen({ currentUser, onPublish, onCancel }) {
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('ਦਰਵਾਜ਼ਾ');
  const [img, setImg] = useState('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
        <button onClick={onCancel}><ArrowLeft size={18} /></button>
        <span className="font-bold text-xs uppercase">New Post</span>
        <button
          onClick={() => {
            if (!caption.trim()) return;
            onPublish({
              id: 'post_' + Date.now(),
              authorName: currentUser.fullName,
              authorHandle: currentUser.handle,
              avatarUrl: currentUser.avatarUrl,
              content: caption,
              imageUrl: img,
              likesCount: 1,
              likes: [currentUser.handle],
              timestamp: 'Just now',
              tag: tag
            });
          }}
          disabled={!caption.trim()}
          className="text-xs font-bold bg-white text-black px-3 py-1 rounded-full disabled:opacity-40"
        >
          ਸਾਂਝੀ ਕਰੋ
        </button>
      </div>

      <div className="w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden relative flex items-center justify-center">
        <img src={img} alt="" className="w-full h-full object-cover grayscale" />
        <label className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded text-[11px] cursor-pointer border border-neutral-700">
          ਫੋਟੋ ਬਦਲੋ
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <textarea
        rows={3}
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="ਆਪਣੀਆਂ ਯਾਦਾਂ ਜਾਂ ਪਿੰਡ ਬਾਰੇ ਕੁਝ ਲਿਖੋ..."
        className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none"
      />

      <div className="grid grid-cols-3 gap-2">
        {['ਦਰਵਾਜ਼ਾ', 'ਸਾਡੇ ਬਜ਼ੁਰਗ', 'ਖੇਤ'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={`py-1.5 rounded-lg text-xs font-bold border transition ${tag === t ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
