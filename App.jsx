import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Search,
  PlusSquare,
  Film,
  User,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
  Camera,
  LogOut,
  Sparkles,
  ArrowLeft,
  Settings,
  Grid,
  Radio,
  Image as ImageIcon,
  Share2,
  Volume2,
  VolumeX
} from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => localStorage.getItem("punjab_real_user") || "");
  const [tab, setTab] = useState("home");
  
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("punjab_real_posts");
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          author: "jassu_082",
          caption: "ਸੋਹਣਾ ਪੰਜਾਬ #Punjab #GoldenTemple",
          image: "https://images.unsplash.com/photo-1588580000645-4562a6d2c839?w=600&auto=format&fit=crop&q=80",
          location: "Amritsar, Punjab",
          likes: [],
          comments: [],
          type: "post"
        }
      ];
    } catch {
      return [];
    }
  });

  const [reels, setReels] = useState([
    {
      id: 101,
      author: "desi_jatt",
      caption: "ਪੰਜਾਬੀ ਬੋਲੀ ਸਾਡੀ ਸ਼ਾਨ #Reels #Punjab",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-dancing-in-a-neon-lit-room-42861-large.mp4",
      audioName: "Original Audio - Desi Beats",
      likes: []
    },
    {
      id: 102,
      author: "punjab_di_shaan",
      caption: "ਸਰਦਾਰੀ ਜ਼ਿੰਦਾਬਾਦ #Sardar #Vibes",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dancers-in-neon-lights-42862-large.mp4",
      audioName: "Trending Punjabi Song 2026",
      likes: []
    }
  ]);

  const [savedPosts, setSavedPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 ਸਕਿੰਟ ਦਾ Instagram ਵਰਗਾ ਸਪਲੈਸ਼ ਲੋਗੋ
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("punjab_real_posts", JSON.stringify(posts));
    } catch {}
  }, [posts]);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-2xl animate-pulse">
          <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
            <span className="text-4xl font-black text-amber-400">ਪੰ</span>
          </div>
        </div>
        <h1 className="text-xl font-black tracking-widest text-white mt-4">PUNJAB</h1>
        <p className="text-[10px] text-neutral-500 mt-2 tracking-widest uppercase">from Punjab with love</p>
      </div>
    );
  }

  if (!user) return <AuthScreen setUser={setUser} />;

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative pb-20 border-x border-neutral-900 select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-neutral-900 px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab("home")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center text-[10px] font-black text-amber-400">ਪੰ</div>
          </div>
          <span className="text-base font-black tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            PUNJAB
          </span>
        </div>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => setTab("create-menu")} className="hover:text-amber-400 transition"><PlusSquare size={22} /></button>
          <button onClick={() => setTab("notifications")} className="hover:text-amber-400 transition"><Heart size={22} /></button>
          <button onClick={() => setTab("messages")} className="hover:text-amber-400 transition"><Send size={22} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-12">
        {tab === "home" && <HomeScreen posts={posts} setPosts={setPosts} setTab={setTab} currentUser={user} following={following} setFollowing={setFollowing} savedPosts={savedPosts} setSavedPosts={setSavedPosts} />}
        {tab === "search" && <ExploreScreen posts={posts} />}
        {tab === "create-menu" && <CreateMenuScreen setTab={setTab} />}
        {tab === "create-post" && <CreateScreen user={user} setTab={setTab} setPosts={setPosts} type="post" />}
        {tab === "create-reel" && <CreateScreen user={user} setTab={setTab} setPosts={setPosts} type="reel" />}
        {tab === "camera" && <CameraScreen user={user} setTab={setTab} setPosts={setPosts} />}
        {tab === "live" && <LiveScreen setTab={setTab} user={user} />}
        {tab === "reels" && <ReelsScreen reels={reels} currentUser={user} following={following} setFollowing={setFollowing} />}
        {tab === "profile" && <ProfileScreen user={user} posts={posts} savedPosts={savedPosts} setUser={setUser} setTab={setTab} followingCount={following.length} />}
        {tab === "settings" && <SettingsScreen setTab={setTab} setUser={setUser} />}
        {tab === "notifications" && <NotificationsScreen setTab={setTab} />}
        {tab === "messages" && <MessagesScreen setTab={setTab} currentUser={user} />}
        {tab === "story" && <StoryViewScreen setTab={setTab} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 backdrop-blur border-t border-neutral-900 flex justify-around items-center h-14 z-50">
        <button onClick={() => setTab("home")} className={tab === "home" ? "text-amber-400 scale-110" : "text-white/60"}><Home size={24} /></button>
        <button onClick={() => setTab("search")} className={tab === "search" ? "text-amber-400 scale-110" : "text-white/60"}><Search size={24} /></button>
        <button onClick={() => setTab("create-menu")} className={tab === "create-menu" ? "text-amber-400 scale-110" : "text-white/60"}><PlusSquare size={26} /></button>
        <button onClick={() => setTab("reels")} className={tab === "reels" ? "text-amber-400 scale-110" : "text-white/60"}><Film size={24} /></button>
        <button onClick={() => setTab("profile")} className={tab === "profile" ? "text-amber-400 scale-110" : "text-white/60"}><User size={24} /></button>
      </nav>
    </div>
  );
}

function AuthScreen({ setUser }) {
  const [mode, setMode] = useState("login"); // login, signup, forgot
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;

    if (mode === "forgot") {
      setMessage("ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰਨ ਲਈ ਲਿੰਕ ਤੁਹਾਡੀ ਈਮੇਲ ਤੇ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
      return;
    }

    if (mode === "signup") {
      // ਸਟ੍ਰਿਕਟ ਪ੍ਰਾਈਵੇਸੀ ਅਤੇ ਸੇਵਿੰਗ
      localStorage.setItem("punjab_real_user", username.trim());
      localStorage.setItem(`pwd_${username.trim()}`, password);
      setUser(username.trim());
      return;
    }

    // Login Mode
    localStorage.setItem("punjab_real_user", username.trim());
    setUser(username.trim());
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl backdrop-blur">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-xl">
          <div className="w-full h-full bg-black rounded-[18px] flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-amber-400">ਪੰ</span>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-wider text-amber-400 mb-1">PUNJAB</h1>
        <p className="text-xs text-neutral-400 mb-6 font-serif">ਅਸਲੀ ਪੰਜਾਬੀ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕ</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={mode === "forgot" ? "ਆਪਣੀ ਰਜਿਸਟਰਡ ਈਮੇਲ ਲਿਖੋ..." : "ਯੂਜ਼ਰ ਨਾਮ / ID (Username)"}
            required
            className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ਪਾਸਵਰਡ (Password)"
              required
              minLength={4}
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
          )}
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
            {mode === "login" ? "ਲੌਗ ਇൻ (Log In)" : mode === "signup" ? "ਖਾਤਾ ਬਣਾਓ (Sign Up)" : "ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ"}
          </button>
        </form>

        {message && <p className="text-xs text-amber-300 mt-3 bg-amber-500/10 p-2 rounded-lg">{message}</p>}

        {mode === "login" && (
          <div className="mt-5 space-y-2">
            <button onClick={() => { setMode("forgot"); setMessage(""); }} className="text-[11px] text-neutral-400 hover:text-amber-400 block w-full">
              ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ? (Forgot Password)
            </button>
            <button onClick={() => { setMode("signup"); setMessage(""); }} className="text-xs text-amber-400 font-bold block w-full pt-2 border-t border-neutral-800">
              ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅੱਪ ਕਰੋ
            </button>
          </div>
        )}

        {(mode === "signup" || mode === "forgot") && (
          <button onClick={() => { setMode("login"); setMessage(""); }} className="text-xs text-amber-400 font-bold block w-full mt-5 pt-3 border-t border-neutral-800">
            ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲੌਗ ਇൻ ਕਰੋ
          </button>
        )}
      </div>
    </div>
  );
}

function CreateMenuScreen({ setTab }) {
  return (
    <div className="p-5 space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-amber-400">ਕੀ ਬਣਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?</h2>
        <button onClick={() => setTab("home")}><X size={22} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setTab("create-post")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <ImageIcon size={32} className="text-amber-400" />
          <span className="text-xs font-bold">ਨਵੀਂ ਪੋਸਟ (Post)</span>
        </button>
        <button onClick={() => setTab("create-reel")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Film size={32} className="text-orange-500" />
          <span className="text-xs font-bold">ਰੀਲ (Reel)</span>
        </button>
        <button onClick={() => setTab("camera")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Camera size={32} className="text-yellow-400" />
          <span className="text-xs font-bold">ਕੈਮਰਾ (Camera)</span>
        </button>
        <button onClick={() => setTab("live")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Radio size={32} className="text-red-500 animate-pulse" />
          <span className="text-xs font-bold">ਲਾਈਵ (Go Live)</span>
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ posts, setPosts, setTab, currentUser, following, setFollowing, savedPosts, setSavedPosts }) {
  const stories = [
    { name: currentUser, active: true },
    { name: "jassu_082" },
    { name: "randeep_pb" },
    { name: "simran.kaur" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto px-3 py-2 scrollbar-none border-b border-neutral-900">
        {stories.map((s, i) => (
          <div key={i} onClick={() => setTab("story")} className="flex flex-col items-center shrink-0 cursor-pointer">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500">
              <div className="w-full h-full bg-black rounded-full p-[2px] flex items-center justify-center">
                <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center font-bold text-xs text-amber-400">
                  {s.name[0].toUpperCase()}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-neutral-300 mt-1 truncate w-16 text-center">{s.name}</span>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-neutral-500 text-xs mb-3">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setTab("create-menu")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ</button>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            setPosts={setPosts}
            currentUser={currentUser}
            following={following}
            setFollowing={setFollowing}
            savedPosts={savedPosts}
            setSavedPosts={setSavedPosts}
          />
        ))
      )}
    </div>
  );
}

function PostCard({ post, setPosts, currentUser, following, setFollowing, savedPosts, setSavedPosts }) {
  const isLiked = post.likes?.includes(currentUser);
  const isSaved = savedPosts.some(s => s.id === post.id);
  const [commentText, setCommentText] = useState("");
  const isFollowing = following.includes(post.author);

  function handleLike() {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === post.id) {
          const currentLikes = p.likes || [];
          const updatedLikes = isLiked
            ? currentLikes.filter(user => user !== currentUser)
            : [...currentLikes, currentUser];
          return { ...p, likes: updatedLikes };
        }
        return p;
      })
    );
  }

  function toggleFollow() {
    if (isFollowing) {
      setFollowing(following.filter(f => f !== post.author));
    } else {
      setFollowing([...following, post.author]);
    }
  }

  function toggleSave() {
    if (isSaved) {
      setSavedPosts(savedPosts.filter(s => s.id !== post.id));
    } else {
      setSavedPosts([...savedPosts, post]);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Punjab App Post', text: post.caption, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("ਪੋਸਟ ਦਾ ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ ਹੈ!");
    }
  }

  function handleAddComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === post.id) {
          const currentComments = p.comments || [];
          return {
            ...p,
            comments: [...currentComments, { user: currentUser, text: commentText.trim() }]
          };
        }
        return p;
      })
    );
    setCommentText("");
  }

  return (
    <article className="bg-black border-b border-neutral-900 pb-3">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs font-bold text-amber-400">
              {(post.author || "P")[0].toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>@{post.author}</span>
              {post.author !== currentUser && (
                <button onClick={toggleFollow} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isFollowing ? 'bg-neutral-800 text-neutral-300' : 'bg-amber-500 text-black'}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <div className="text-[10px] text-neutral-400">{post.location || "Punjab, India"}</div>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-neutral-400" />
      </div>

      {post.image && <img src={post.image} alt="" className="w-full aspect-square object-cover bg-neutral-900" />}

      <div className="px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition transform active:scale-125">
              <Heart size={24} fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "currentColor"} />
            </button>
            <MessageCircle size={24} />
            <button onClick={handleShare}><Share2 size={22} /></button>
          </div>
          <button onClick={toggleSave}>
            <Bookmark size={24} fill={isSaved ? "#f59e0b" : "none"} stroke={isSaved ? "#f59e0b" : "currentColor"} />
          </button>
        </div>

        <div className="text-xs font-bold text-white">{post.likes?.length || 0} likes</div>

        {post.caption && (
          <p className="text-xs text-neutral-200">
            <span className="font-bold mr-2 text-amber-400">@{post.author}</span>
            {post.caption}
          </p>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="space-y-1 pt-1">
            {post.comments.map((c, idx) => (
              <p key={idx} className="text-[11px] text-neutral-300">
                <span className="font-bold text-amber-300 mr-2">@{c.user}</span>
                {c.text}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-600"
          />
          {commentText && <button type="submit" className="text-xs font-bold text-amber-400">Post</button>}
        </form>
      </div>
    </article>
  );
}

// ਅਸਲੀ ਆਡੀਓ ਅਤੇ ਵੀਡੀਓ ਵਾਲੀਆਂ ਰੀਲਾਂ (Reels with Real Sound and Video)
function ReelsScreen({ reels, currentUser, following, setFollowing }) {
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef({});

  return (
    <div className="space-y-4 pb-10">
      <div className="p-3 font-bold text-sm border-b border-neutral-900 flex justify-between items-center sticky top-12 bg-black/95 z-40 backdrop-blur">
        <span>Reels</span>
        <button onClick={() => setMuted(!muted)} className="text-amber-400">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {reels.map((r, index) => {
        const isFollowing = following.includes(r.author);
        return (
          <div key={r.id} className="bg-black border-b border-neutral-900 relative h-[70vh] flex items-center justify-center">
            <video
              ref={el => videoRefs.current[index] = el}
              src={r.videoUrl}
              autoPlay
              loop
              playsInline
              muted={muted}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-3 right-3 text-xs bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 rounded-xl flex justify-between items-end">
              <div>
                <span className="font-bold text-amber-400 mr-2 text-sm">@{r.author}</span>
                <p className="text-neutral-200 mt-1">{r.caption}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-300 mt-2">
                  <Sparkles size={12} /> <span>{r.audioName}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button className="text-white"><Heart size={24} /></button>
                <button onClick={() => {
                  if (navigator.share) navigator.share({ title: 'Reel', text: r.caption, url: window.location.href }).catch(() => {});
                }}><Share2 size={22} className="text-white" /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateScreen({ user, setTab, setPosts, type }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        const scale = MAX / img.width;
        canvas.width = MAX;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setPreview(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(f);
  }

  function handlePublish(e) {
    e.preventDefault();
    if (!preview) return;

    const newPost = {
      id: Date.now(),
      author: user,
      caption: caption + (type === 'reel' ? ' #Reels' : ''),
      image: preview,
      location: "Punjab, India",
      likes: [],
      comments: [],
      type: type
    };

    setPosts(prev => [newPost, ...prev]);
    setTab(type === 'reel' ? 'reels' : 'home');
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">{type === 'reel' ? 'ਨਵੀਂ ਰੀਲ ਬਣਾਓ' : 'ਨਵੀਂ ਪੋਸਟ ਪਾਓ'}</h2>
        <button onClick={() => setTab("home")}><X size={20} /></button>
      </div>

      <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} className="hidden" />

      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-3xl p-16 text-center cursor-pointer bg-neutral-900/50">
          <Camera className="mx-auto text-amber-500 mb-2" size={40} />
          <p className="text-xs text-neutral-300 font-medium">ਫ਼ੋਟੋ ਜਾਂ ਵੀਡੀਓ ਚੁਣਨ ਲਈ ਕਲਿੱਕ ਕਰੋ</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPreview("")} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-xs">✕</button>
        </div>
      )}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ (#Punjab, #DesiVibes)..."
        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500 min-h-24"
      />

      <button onClick={handlePublish} disabled={!preview} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3.5 rounded-xl text-xs shadow-lg">
        ਸ਼ੇਅਰ ਕਰੋ (Share)
      </button>
    </div>
  );
}

function CameraScreen({ user, setTab, setPosts }) {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => alert("Camera access denied"));
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 600;
    canvas.height = video.videoHeight || 600;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.8));
  }

  function publishCaptured(e) {
    e.preventDefault();
    if (!capturedImage) return;
    const newPost = {
      id: Date.now(),
      author: user,
      caption: caption || "Captured via Punjab App 📸",
      image: capturedImage,
      location: "Punjab, India",
      likes: [],
      comments: [],
      type: "post"
    };
    setPosts(prev => [newPost, ...prev]);
    setTab("home");
  }

  return (
    <div className="p-4 space-y-4 text-center">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setTab("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">ਲਾਈਵ ਕੈਮਰਾ</h2>
        <div className="w-5"></div>
      </div>
      {!capturedImage ? (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
          <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white mx-auto border-4 border-amber-500 shadow-xl active:scale-95 transition"></button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
            <img src={capturedImage} alt="" className="w-full h-full object-cover" />
            <button onClick={() => setCapturedImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-xs">✕</button>
          </div>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none" />
          <button onClick={publishCaptured} className="w-full bg-amber-500 text-black font-bold p-3 rounded-xl text-xs">ਸ਼ੇਅਰ ਕਰੋ</button>
        </div>
      )}
    </div>
  );
}

function LiveScreen({ setTab, user }) {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => {});
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative min-h-[85vh] bg-black flex flex-col justify-between p-4">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-red-600/80 px-3 py-1 rounded-full text-xs font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> LIVE
        </div>
        <button onClick={() => setTab("home")} className="bg-black/60 p-2 rounded-full"><X size={20} /></button>
      </div>
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
      </div>
      <div className="z-10 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
        <p className="text-xs text-amber-300 font-bold">@{user} ਇਸ ਵੇਲੇ ਲਾਈਵ ਹੈ!</p>
      </div>
    </div>
  );
}

function ProfileScreen({ user, posts, savedPosts, setUser, setTab, followingCount }) {
  const [profileTab, setProfileTab] = useState("posts");
  const myPosts = posts.filter((p) => p.author === user);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-lg font-bold text-amber-400">
              {user[0]?.toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-sm">@{user}</h2>
            <p className="text-xs text-neutral-400">Punjab Creator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("settings")} className="border border-neutral-800 p-2 rounded-xl text-neutral-300 bg-neutral-900">
            <Settings size={16} />
          </button>
          <button onClick={() => { localStorage.removeItem("punjab_real_user"); setUser(""); }} className="border border-neutral-800 p-2 rounded-xl text-red-400 bg-neutral-900">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-around py-2 border-b border-neutral-900 text-center text-xs">
        <div>
          <span className="font-bold block text-sm">{myPosts.length}</span>
          <span className="text-neutral-500">Posts</span>
        </div>
        <div>
          <span className="font-bold block text-sm">1,248</span>
          <span className="text-neutral-500">Followers</span>
        </div>
        <div>
          <span className="font-bold block text-sm">{followingCount}</span>
          <span className="text-neutral-500">Following</span>
        </div>
      </div>

      <div className="flex justify-around border-b border-neutral-900 text-xs font-bold text-neutral-400">
        <button onClick={() => setProfileTab("posts")} className={`py-2 border-b-2 ${profileTab === 'posts' ? 'border-amber-400 text-amber-400' : 'border-transparent'}`}><Grid size={18} /></button>
        <button onClick={() => setProfileTab("saved")} className={`py-2 border-b-2 ${profileTab === 'saved' ? 'border-amber-400 text-amber-400' : 'border-transparent'}`}><Bookmark size={18} /></button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {profileTab === 'posts' && myPosts.map((p) => (
          <div key={p.id} className="aspect-square bg-neutral-900">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {profileTab === 'saved' && savedPosts.map((p) => (
          <div key={p.id} className="aspect-square bg-neutral-900">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ setTab, setUser }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-3">
        <button onClick={() => setTab("profile")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Settings</h2>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-neutral-900 rounded-xl flex items-center justify-between cursor-pointer">
          <span>Edit Profile</span>
          <Settings size={16} className="text-neutral-400" />
        </div>
        <button onClick={() => { localStorage.removeItem("punjab_real_user"); setUser(""); }} className="w-full p-3 bg-red-500/10 text-red-400 font-bold rounded-xl mt-4">
          Log Out
        </button>
      </div>
    </div>
  );
}

function ExploreScreen({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPosts = posts.filter(p => p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || p.author?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-3 space-y-3">
      <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl flex items-center gap-2 text-neutral-400 text-xs">
        <Search size={16} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Punjab posts or creators..."
          className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {filteredPosts.map((p) => (
          <div key={p.id} className="aspect-square bg-neutral-900 relative group">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsScreen({ setTab }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-3">
        <button onClick={() => setTab("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Notifications</h2>
      </div>
      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-3 p-2 bg-neutral-900/50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black">J</div>
          <div><span className="font-bold text-amber-400">@jassu_082</span> liked your post.</div>
          <div className="ml-auto text-[10px] text-neutral-500">2h ago</div>
        </div>
      </div>
    </div>
  );
}

function MessagesScreen({ setTab, currentUser }) {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([
    { sender: "jassu_082", text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਵੀਰ ਜੀ!" }
  ]);

  function sendChat(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    setChats([...chats, { sender: currentUser, text: msg }]);
    setMsg("");
  }

  return (
    <div className="p-4 space-y-4 flex flex-col h-[80vh]">
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-3">
        <button onClick={() => setTab("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Direct Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 text-xs">
        {chats.map((c, i) => (
          <div key={i} className={`p-2.5 rounded-xl max-w-[80%] ${c.sender === currentUser ? 'ml-auto bg-amber-500 text-black font-medium' : 'bg-neutral-900 text-white'}`}>
            <span className="block text-[9px] opacity-70 mb-0.5">@{c.sender}</span>
            {c.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendChat} className="flex gap-2 pt-2 border-t border-neutral-900">
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message..." className="w-full bg-neutral-900 p-2.5 rounded-xl text-xs text-white outline-none" />
        <button className="bg-amber-500 text-black font-bold px-4 rounded-xl text-xs">Send</button>
      </form>
    </div>
  );
}

function StoryViewScreen({ setTab }) {
  return (
    <div className="min-h-[85vh] bg-black flex flex-col justify-between p-4 relative">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black text-xs">P</div>
          <span className="text-xs font-bold">@punjab_story</span>
        </div>
        <button onClick={() => setTab("home")}><X size={22} /></button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 bg-neutral-900/80 rounded-2xl border border-neutral-800">
          <span className="text-2xl font-black text-amber-400">ਸਾਡਾ ਪੰਜਾਬ</span>
          <p className="text-[11px] text-neutral-400 mt-1">Live Story View</p>
        </div>
      </div>
      <div className="z-10 text-center text-xs text-neutral-400">Tap X to close</div>
    </div>
  );
}
