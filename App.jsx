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
} from "lucide-react";

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOAplbatGO9Ez1qA_VPD2UEBR";

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
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-neutral-900 px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center text-[10px] font-black text-amber-400">ਪੰ</div>
          </div>
          <span className="text-base font-black tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            PUNJAB
          </span>
        </div>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => setTab("create")}><PlusSquare size={22} /></button>
          <button><Heart size={22} /></button>
          <button><Send size={22} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-12">
        {tab === "home" && <HomeScreen posts={posts} setTab={setTab} reload={loadPosts} currentUser={user} />}
        {tab === "search" && <ExploreScreen posts={posts} />}
        {tab === "create" && <CreateScreen user={user} setTab={setTab} reload={loadPosts} />}
        {tab === "reels" && <ReelsScreen posts={posts} />}
        {tab === "profile" && <ProfileScreen user={user} posts={posts} setUser={setUser} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 backdrop-blur border-t border-neutral-900 flex justify-around items-center h-14 z-50">
        <button onClick={() => setTab("home")} className={tab === "home" ? "text-amber-400 scale-110" : "text-white/60"}><Home size={24} /></button>
        <button onClick={() => setTab("search")} className={tab === "search" ? "text-amber-400 scale-110" : "text-white/60"}><Search size={24} /></button>
        <button onClick={() => setTab("create")} className={tab === "create" ? "text-amber-400 scale-110" : "text-white/60"}><PlusSquare size={26} /></button>
        <button onClick={() => setTab("reels")} className={tab === "reels" ? "text-amber-400 scale-110" : "text-white/60"}><Film size={24} /></button>
        <button onClick={() => setTab("profile")} className={tab === "profile" ? "text-amber-400 scale-110" : "text-white/60"}><User size={24} /></button>
      </nav>
    </div>
  );
}

function AuthScreen({ setUser }) {
  const [name, setName] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("punjab_user", name.trim());
    setUser(name.trim());
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-neutral-900/80 border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl backdrop-blur">
        <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-xl">
          <div className="w-full h-full bg-black rounded-[22px] flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-amber-400">ਪੰ</span>
            <span className="text-[9px] text-neutral-400 tracking-wider">Punjab</span>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-wider text-amber-400 mb-1">PUNJAB</h1>
        <p className="text-xs text-neutral-400 mb-6 font-serif">Connect • Share • Punjab</p>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ਆਪਣਾ ਯੂਜ਼ਰ ਨਾਮ (Username) ਲਿਖੋ..."
            required
            className="w-full bg-neutral-800 border border-neutral-700 p-3.5 rounded-xl text-xs text-white outline-none focus:border-amber-500"
          />
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3.5 rounded-xl text-xs shadow-lg">
            ਐਂਟਰ ਕਰੋ (Log In)
          </button>
        </form>
      </div>
    </div>
  );
}

function HomeScreen({ posts, setTab, reload, currentUser }) {
  const stories = [
    { name: currentUser, active: true },
    { name: "jassu_082" },
    { name: "randeep_pb" },
    { name: "simran.kaur" },
    { name: "gurpreet" },
  ];

  return (
    <div className="space-y-3">
      {/* Stories Row */}
      <div className="flex gap-3 overflow-x-auto px-3 py-2 scrollbar-none border-b border-neutral-900">
        {stories.map((s, i) => (
          <div key={i} className="flex flex-col items-center shrink-0 cursor-pointer">
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

      {/* Feed Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-neutral-500 text-xs mb-3">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setTab("create")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">
            ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ
          </button>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} currentUser={currentUser} />)
      )}
    </div>
  );
}

function PostCard({ post, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 12);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  function handleLike() {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    }
  }

  function handleAddComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentsList([...commentsList, { user: currentUser, text: comment }]);
    setComment("");
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
            <div className="text-xs font-bold">@{post.author}</div>
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
              <Heart size={24} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} />
            </button>
            <MessageCircle size={24} />
            <Send size={24} />
          </div>
          <button onClick={() => setSaved(!saved)}>
            <Bookmark size={24} fill={saved ? "#f59e0b" : "none"} stroke={saved ? "#f59e0b" : "currentColor"} />
          </button>
        </div>

        <div className="text-xs font-bold text-white">{likesCount} likes</div>

        {post.caption && (
          <p className="text-xs text-neutral-200">
            <span className="font-bold mr-2 text-amber-400">@{post.author}</span>
            {post.caption}
          </p>
        )}

        {commentsList.length > 0 && (
          <div className="space-y-1 pt-1">
            {commentsList.map((c, idx) => (
              <p key={idx} className="text-[11px] text-neutral-300">
                <span className="font-bold text-amber-300 mr-2">@{c.user}</span>
                {c.text}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-600"
          />
          {comment && <button type="submit" className="text-xs font-bold text-amber-400">Post</button>}
        </form>
      </div>
    </article>
  );
}

function ExploreScreen({ posts }) {
  return (
    <div className="p-3 space-y-3">
      <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl flex items-center gap-2 text-neutral-400 text-xs">
        <Search size={16} />
        <span>Search Punjab...</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((p) => (
          <div key={p.id} className="aspect-square bg-neutral-900 relative group">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateScreen({ user, setTab, reload }) {
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
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
          caption: caption,
          image: preview,
          location: "Punjab, India",
        }),
      });

      if (res.ok) {
        await reload();
        setTab("home");
      } else {
        const errText = await res.text();
        alert("Upload failed: " + errText);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setBusy(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">ਨਵੀਂ ਪੋਸਟ ਬਣਾਓ</h2>
        <button onClick={() => setTab("home")}><X size={20} /></button>
      </div>

      <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} className="hidden" />

      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-3xl p-16 text-center cursor-pointer bg-neutral-900/50">
          <Camera className="mx-auto text-amber-500 mb-2" size={40} />
          <p className="text-xs text-neutral-300 font-medium">ਫ਼ੋਟੋ ਚੁਣਨ ਲਈ ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ</p>
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

      <button onClick={handlePublish} disabled={!preview || busy} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3.5 rounded-xl text-xs disabled:opacity-40 shadow-lg">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਸ਼ੇਅਰ ਕਰੋ (Share)"}
      </button>
    </div>
  );
}

function ReelsScreen({ posts }) {
  return (
    <div className="space-y-4 pb-10">
      <div className="p-3 font-bold text-sm border-b border-neutral-900 flex justify-between items-center sticky top-12 bg-black/95 z-40 backdrop-blur">
        <span>Reels</span>
        <Sparkles size={18} className="text-amber-400" />
      </div>
      {posts.map((p) => (
        <div key={p.id} className="bg-black border-b border-neutral-900 relative">
          {p.image && <img src={p.image} alt="" className="w-full aspect-[9/16] object-cover bg-neutral-900 max-h-[500px]" />}
          <div className="absolute bottom-4 left-3 right-3 text-xs bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 rounded-xl">
            <span className="font-bold text-amber-400 mr-2 text-sm">@{p.author}</span>
            <p className="text-neutral-200 mt-1">{p.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, posts, setUser }) {
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
        <button onClick={() => { localStorage.removeItem("punjab_user"); setUser(""); }} className="border border-neutral-800 p-2 rounded-xl text-red-400 bg-neutral-900">
          <LogOut size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {myPosts.map((p) => (
          <div key={p.id} className="aspect-square bg-neutral-900">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
