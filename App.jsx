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
  Edit3,
  Grid,
  Radio,
  Image as ImageIcon,
  Share2,
} from "lucide-react";

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneWxhY25xcnhlemp4cWpvZXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzE3NDAsImV4cCI6MjA1NzgwNjc0MH0";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("punjab_user") || "");
  const [tab, setTab] = useState("home");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      loadPosts();
      const interval = setInterval(loadPosts, 4000);
      return () => clearInterval(interval);
    }
  }, [user]);

  async function loadPosts() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!user) return <AuthScreen setUser={setUser} />;

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative pb-20 border-x border-neutral-900 select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-neutral-900 px-4 h-14 flex items-center justify-between">
        <span className="text-2xl font-black tracking-wider text-white">ਪੰਜਾਬ</span>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => setTab("create-menu")} className="hover:text-amber-400 transition"><PlusSquare size={24} /></button>
          <button onClick={() => setTab("notifications")} className="hover:text-amber-400 transition"><Heart size={24} /></button>
          <button onClick={() => setTab("messages")} className="hover:text-amber-400 transition"><Send size={24} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-12">
        {tab === "home" && <HomeScreen posts={posts} setTab={setTab} currentUser={user} reload={loadPosts} />}
        {tab === "search" && <ExploreScreen posts={posts} />}
        {tab === "create-menu" && <CreateMenuScreen setTab={setTab} />}
        {tab === "create-post" && <CreateScreen user={user} setTab={setTab} reload={loadPosts} type="post" />}
        {tab === "create-reel" && <CreateScreen user={user} setTab={setTab} reload={loadPosts} type="reel" />}
        {tab === "camera" && <CameraScreen user={user} setTab={setTab} reload={loadPosts} />}
        {tab === "live" && <LiveScreen setTab={setTab} user={user} />}
        {tab === "reels" && <ReelsScreen posts={posts} currentUser={user} />}
        {tab === "profile" && <ProfileScreen user={user} posts={posts} setUser={setUser} setTab={setTab} />}
        {tab === "settings" && <SettingsScreen setTab={setTab} setUser={setUser} />}
        {tab === "notifications" && <NotificationsScreen setTab={setTab} />}
        {tab === "messages" && <MessagesScreen setTab={setTab} currentUser={user} />}
        {tab === "story" && <StoryViewScreen setTab={setTab} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black border-t border-neutral-900 flex justify-around items-center h-14 z-50">
        <button onClick={() => setTab("home")} className={tab === "home" ? "text-white" : "text-gray-500"}><Home size={24} /></button>
        <button onClick={() => setTab("search")} className={tab === "search" ? "text-white" : "text-gray-500"}><Search size={24} /></button>
        <button onClick={() => setTab("create-menu")} className={tab === "create-menu" ? "text-white" : "text-gray-500"}><PlusSquare size={26} /></button>
        <button onClick={() => setTab("reels")} className={tab === "reels" ? "text-white" : "text-gray-500"}><Film size={24} /></button>
        <button onClick={() => setTab("profile")} className={tab === "profile" ? "text-white" : "text-gray-500"}><User size={24} /></button>
      </nav>
    </div>
  );
}

function AuthScreen({ setUser }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;

    if (mode === "forgot") {
      setMessage("ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰਨ ਲਈ ਲਿੰਕ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
      return;
    }

    localStorage.setItem("punjab_user", username.trim());
    setUser(username.trim());
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl">
        <h1 className="text-3xl font-black text-amber-400 mb-1">ਪੰਜਾਬ</h1>
        <p className="text-xs text-neutral-400 mb-6 font-serif">ਕਲਾਊਡ ਆਧਾਰਿਤ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕ</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={mode === "forgot" ? "ਆਪਣੀ ਈਮੇਲ ਲਿਖੋ..." : "ਯੂਜ਼ਰ ਨਾਮ / ID (Username)"}
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
          <button className="w-full bg-amber-500 text-black font-bold p-3 rounded-xl text-xs shadow-lg">
            {mode === "login" ? "ਲੌਗ ਇൻ (Log In)" : mode === "signup" ? "ਸਾਈਨ ਅੱਪ (Sign Up)" : "ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ"}
          </button>
        </form>
        {message && <p className="text-xs text-amber-300 mt-3 bg-amber-500/10 p-2 rounded-lg">{message}</p>}
        {mode === "login" && (
          <div className="mt-5 space-y-2">
            <button onClick={() => { setMode("forgot"); setMessage(""); }} className="text-[11px] text-neutral-400 hover:text-amber-400 block w-full">ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?</button>
            <button onClick={() => { setMode("signup"); setMessage(""); }} className="text-xs text-amber-400 font-bold block w-full pt-2 border-t border-neutral-800">ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅੱਪ ਕਰੋ</button>
          </div>
        )}
        {(mode === "signup" || mode === "forgot") && (
          <button onClick={() => { setMode("login"); setMessage(""); }} className="text-xs text-amber-400 font-bold block w-full mt-5 pt-3 border-t border-neutral-800">ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲੌਗ ਇਨ ਕਰੋ</button>
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
          <span className="text-xs font-bold">ਨਵੀਂ ਪੋਸਟ</span>
        </button>
        <button onClick={() => setTab("create-reel")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Film size={32} className="text-orange-500" />
          <span className="text-xs font-bold">ਰੀਲ</span>
        </button>
        <button onClick={() => setTab("camera")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Camera size={32} className="text-yellow-400" />
          <span className="text-xs font-bold">ਕੈਮਰਾ</span>
        </button>
        <button onClick={() => setTab("live")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition">
          <Radio size={32} className="text-red-500 animate-pulse" />
          <span className="text-xs font-bold">ਲਾਈਵ</span>
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ posts, setTab, currentUser, reload }) {
  return (
    <div className="space-y-2">
      <div className="h-[100px] flex items-center">
        <div className="flex gap-3 overflow-x-auto px-3 py-2 scrollbar-none w-full">
          {[currentUser, "jassu_082", "randeep_pb", "simran.kaur", "gurpreet"].map((name, i) => (
            <div key={i} onClick={() => setTab("story")} className="flex flex-col items-center shrink-0 cursor-pointer">
              <div className="w-[64px] h-[64px] rounded-full p-[2px] bg-amber-500">
                <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center text-white">
                  <User size={28} />
                </div>
              </div>
              <span className="text-[12px] text-white/70 mt-1 truncate w-16 text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-neutral-800 opacity-20" />

      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-neutral-500 text-xs mb-3">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setTab("create-menu")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ</button>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} currentUser={currentUser} />)
      )}
    </div>
  );
}

function PostCard({ post, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(12);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Punjab Post', text: post.caption, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ ਹੈ!");
    }
  }

  return (
    <div className="bg-black border-b border-neutral-900 pb-3">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
            {(post.author || "P")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-white font-bold text-sm">@{post.author}</div>
            <div className="text-gray-400 text-xs">{post.location || "Punjab, India"}</div>
          </div>
        </div>
        <MoreHorizontal className="text-white" />
      </div>

      <div className="h-[350px] bg-neutral-900">
        <img src={post.image} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center">
          <button onClick={() => { setLiked(!liked); setLikesCount(liked ? likesCount - 1 : likesCount + 1); }}>
            <Heart size={24} className={liked ? "text-red-500 fill-red-500" : "text-white"} />
          </button>
          <MessageCircle size={24} className="text-white ml-4" />
          <Send size={24} className="text-white ml-4 cursor-pointer" onClick={handleShare} />
          <Bookmark size={24} className="text-white ml-auto" />
        </div>
        <div className="text-white font-bold text-sm mt-2">{likesCount} likes</div>
        <div className="text-white/70 text-xs mt-1">
          <span className="font-bold text-white mr-2">@{post.author}</span>
          {post.caption}
        </div>
      </div>
    </div>
  );
}

function CreateScreen({ user, setTab, reload, type }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
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

  async function handlePublish(e) {
    e.preventDefault();
    if (!preview || busy) return;
    setBusy(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          author: user,
          caption: caption + (type === 'reel' ? ' #Reels' : ''),
          image: preview,
          location: "Punjab, India",
        }),
      });

      if (res.ok) {
        await reload();
        setTab(type === 'reel' ? 'reels' : 'home');
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">{type === 'reel' ? 'ਨਵੀਂ ਰੀਲ' : 'ਨਵੀਂ ਪੋਸਟ'}</h2>
        <button onClick={() => setTab("home")}><X size={20} /></button>
      </div>
      <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} className="hidden" />
      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-3xl p-16 text-center cursor-pointer bg-neutral-900">
          <Camera className="mx-auto text-amber-500 mb-2" size={40} />
          <p className="text-xs text-neutral-300">ਫ਼ੋਟੋ ਚੁਣਨ ਲਈ ਕਲਿੱਕ ਕਰੋ</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPreview("")} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-xs">✕</button>
        </div>
      )}
      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none" />
      <button onClick={handlePublish} disabled={!preview || busy} className="w-full bg-amber-500 text-black font-bold p-3.5 rounded-xl text-xs">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਸ਼ੇਅਰ ਕਰੋ"}
      </button>
    </div>
  );
}

function CameraScreen({ user, setTab, reload }) {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => alert("Camera unavailable"));
    return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
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

  async function publishCaptured(e) {
    e.preventDefault();
    if (!capturedImage) return;
    await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ author: user, caption: caption || "Captured 📸", image: capturedImage, location: "Punjab" }),
    });
    await reload();
    setTab("home");
  }

  return (
    <div className="p-4 space-y-4 text-center">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setTab("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">ਕੈਮਰਾ</h2>
        <div className="w-5"></div>
      </div>
      {!capturedImage ? (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
          <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white mx-auto border-4 border-amber-500 shadow-xl"></button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
            <img src={capturedImage} alt="" className="w-full h-full object-cover" />
          </div>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ..." className="w-full bg-neutral-900 p-3 rounded-xl text-xs text-white" />
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
      .then(s => { if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
  }, []);
  return (
    <div className="relative min-h-[85vh] bg-black flex flex-col justify-between p-4">
      <div className="flex items-center justify-between z-10">
        <div className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white">LIVE</div>
        <button onClick={() => setTab("home")} className="bg-black/60 p-2 rounded-full"><X size={20} /></button>
      </div>
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
      </div>
      <div className="z-10 text-center text-xs text-amber-300 font-bold">@{user} ਲਾਈਵ ਹੈ!</div>
    </div>
  );
}

function ReelsScreen({ posts, currentUser }) {
  const reelPosts = posts.filter(p => p.type === 'reel' || p.caption?.includes('#Reels'));
  const displayPosts = reelPosts.length > 0 ? reelPosts : posts;
  return (
    <div className="space-y-4 pb-10">
      <div className="p-3 font-bold text-sm border-b border-neutral-900 sticky top-14 bg-black z-40">Reels</div>
      {displayPosts.map(p => (
        <div key={p.id} className="bg-black border-b border-neutral-900 relative">
          <img src={p.image} alt="" className="w-full aspect-[9/16] object-cover bg-neutral-900 max-h-[500px]" />
          <div className="absolute bottom-4 left-3 right-3 text-xs bg-gradient-to-t from-black/90 to-transparent p-3 rounded-xl">
            <span className="font-bold text-amber-400 text-sm">@{p.author}</span>
            <p className="text-neutral-200 mt-1">{p.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, posts, setUser, setTab }) {
  const myPosts = posts.filter(p => p.author === user);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-lg">
            {user[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-sm">@{user}</h2>
            <p className="text-xs text-neutral-400">Punjab Creator</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("settings")} className="border border-neutral-800 p-2 rounded-xl bg-neutral-900"><Settings size={16} /></button>
          <button onClick={() => { localStorage.removeItem("punjab_user"); setUser(""); }} className="border border-neutral-800 p-2 rounded-xl text-red-400 bg-neutral-900"><LogOut size={16} /></button>
        </div>
      </div>
      <div className="flex justify-around py-2 border-b border-neutral-900 text-center text-xs">
        <div><span className="font-bold block text-sm">{myPosts.length}</span><span className="text-neutral-500">Posts</span></div>
        <div><span className="font-bold block text-sm">1,248</span><span className="text-neutral-500">Followers</span></div>
        <div><span className="font-bold block text-sm">21</span><span className="text-neutral-500">Following</span></div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {myPosts.map(p => <div key={p.id} className="aspect-square bg-neutral-900"><img src={p.image} className="w-full h-full object-cover" /></div>)}
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
      <button onClick={() => { localStorage.removeItem("punjab_user"); setUser(""); }} className="w-full p-3 bg-red-500/10 text-red-400 font-bold rounded-xl mt-4">Log Out</button>
    </div>
  );
}

function ExploreScreen({ posts }) {
  return (
    <div className="p-3 space-y-3">
      <div className="bg-neutral-900 px-3 py-2 rounded-xl flex items-center gap-2 text-xs">
        <Search size={16} />
        <input placeholder="Search..." className="w-full bg-transparent text-white outline-none" />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {posts.map(p => <div key={p.id} className="aspect-square bg-neutral-900"><img src={p.image} className="w-full h-full object-cover" /></div>)}
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
      <div className="text-xs text-neutral-400">No new notifications.</div>
    </div>
  );
}

function MessagesScreen({ setTab, currentUser }) {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([{ sender: "jassu_082", text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਵੀਰ ਜੀ!" }]);
  return (
    <div className="p-4 space-y-4 flex flex-col h-[80vh]">
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-3">
        <button onClick={() => setTab("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Direct Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 text-xs">
        {chats.map((c, i) => (
          <div key={i} className={`p-2.5 rounded-xl max-w-[80%] ${c.sender === currentUser ? 'ml-auto bg-amber-500 text-black' : 'bg-neutral-900 text-white'}`}>
            {c.text}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!msg.trim()) return; setChats([...chats, { sender: currentUser, text: msg }]); setMsg(""); }} className="flex gap-2 pt-2 border-t border-neutral-900">
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
        <span className="text-xs font-bold">@punjab_story</span>
        <button onClick={() => setTab("home")}><X size={22} /></button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-amber-400">ਸਾਡਾ ਪੰਜਾਬ</span>
      </div>
    </div>
  );
}
