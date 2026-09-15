import React, { useEffect, useState, useRef } from "react";
import {
  Home,
  Search,
  Plus,
  Play,
  User,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  ArrowLeft,
  LogOut,
  MapPin,
  MoreHorizontal,
  Share2,
  Trash2
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOAplbatGO9Ez1qA_VPD2UEBR";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("home");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id);
        loadPosts();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id);
        loadPosts();
      } else {
        setProfile(null);
        setPosts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  }

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select(`*, profiles:user_id (username, full_name)`)
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-3xl font-black tracking-widest text-amber-400">PUNJAB</div>
          <div className="text-xs mt-1 text-neutral-500">Instagram Style</div>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative pb-20 border-x border-neutral-900 shadow-2xl">
      {screen !== "reels" && (
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-800 px-4 h-12 flex items-center justify-between">
          <span className="text-lg font-black tracking-widest bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            PUNJAB
          </span>
          <div className="flex items-center gap-4">
            <button onClick={() => setScreen("create")} className="text-white hover:text-amber-400"><Plus size={22} /></button>
            <button onClick={() => setScreen("messages")} className="text-white hover:text-amber-400"><Send size={20} /></button>
          </div>
        </header>
      )}

      <main className={screen === "reels" ? "" : "pb-16"}>
        {screen === "home" && <HomeScreen posts={posts} profile={profile} setScreen={setScreen} />}
        {screen === "search" && <SearchScreen posts={posts} />}
        {screen === "create" && <CreateScreen profile={profile} reload={loadPosts} setScreen={setScreen} />}
        {screen === "reels" && <ReelsScreen posts={posts} setScreen={setScreen} />}
        {screen === "profile" && <ProfileScreen profile={profile} posts={posts} reload={loadPosts} />}
        {screen === "messages" && <MessagesScreen setScreen={setScreen} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 border-t border-neutral-800 flex justify-around py-3 z-50">
        <button onClick={() => setScreen("home")} className={screen === "home" ? "text-amber-400" : "text-white/60"}><Home size={24} /></button>
        <button onClick={() => setScreen("search")} className={screen === "search" ? "text-amber-400" : "text-white/60"}><Search size={24} /></button>
        <button onClick={() => setScreen("create")} className={screen === "create" ? "text-amber-400" : "text-white/60"}><Plus size={26} /></button>
        <button onClick={() => setScreen("reels")} className={screen === "reels" ? "text-amber-400" : "text-white/60"}><Play size={24} /></button>
        <button onClick={() => setScreen("profile")} className={screen === "profile" ? "text-amber-400" : "text-white/60"}><User size={24} /></button>
      </nav>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { username, full_name: username } }
      });
      if (error) setError(error.message);
      else setError("Account created! You can now log in.");
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center text-xl font-black text-amber-400">ਪੰ</div>
        </div>
        <h1 className="text-2xl font-black text-amber-400 tracking-wider mb-1">PUNJAB</h1>
        <p className="text-xs text-neutral-400 mb-6">ਸਾਡਾ ਪੰਜਾਬ - ਸੋਸ਼ਲ ਮੀਡੀਆ</p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username (ਆਈਡੀ)" required className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs outline-none text-white focus:border-amber-500" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs outline-none text-white focus:border-amber-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs outline-none text-white focus:border-amber-500" />
          <button disabled={busy} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-md">
            {busy ? "ਕਿਰਪਾ ਕਰੋ..." : mode === "login" ? "ਲੌਗ ਇਨ (Log In)" : "ਸਾਈਨ ਅੱਪ (Sign Up)"}
          </button>
        </form>

        {error && <p className="text-xs text-amber-300 mt-3 bg-amber-500/10 p-2 rounded-lg">{error}</p>}

        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="w-full mt-6 text-xs text-neutral-400 hover:text-amber-400">
          {mode === "login" ? "ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅੱਪ ਕਰੋ" : "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲੌਗ ਇਨ ਕਰੋ"}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ posts, profile, setScreen }) {
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});
  const [showComments, setShowComments] = useState({});

  async function toggleLike(post) {
    if (!profile) return;
    const isLiked = likes[post.id];
    if (isLiked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", profile.id);
      setLikes(l => ({ ...l, [post.id]: false }));
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: profile.id });
      setLikes(l => ({ ...l, [post.id]: true }));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto px-3 py-3 border-b border-neutral-900 scrollbar-none">
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer" onClick={() => setScreen("create")}>
          <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold relative">
            <Plus size={20} className="absolute bottom-1 right-1 bg-amber-500 text-black rounded-full p-0.5" />
            <User size={24} />
          </div>
          <span className="text-[10px] text-neutral-300 mt-1">ਆਪਣੀ ਸਟੋਰੀ</span>
        </div>
        {posts.slice(0, 6).map((p, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-amber-400 overflow-hidden">
                {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt="" /> : (p.profiles?.username || "P")[0]}
              </div>
            </div>
            <span className="text-[10px] text-neutral-300 mt-1 max-w-[60px] truncate">@{p.profiles?.username || "user"}</span>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-neutral-500 text-xs mb-3">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setScreen("create")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ</button>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-black border-b border-neutral-900">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                  {(post.profiles?.username || "P")[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold">@{post.profiles?.username || "user"}</div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-0.5"><MapPin size={9} /> Punjab, India</div>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-neutral-500" />
            </div>

            {post.image_url && <img src={post.image_url} alt="" className="w-full aspect-square object-cover bg-neutral-900" />}

            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post)}>
                    <Heart size={23} fill={likes[post.id] ? "#ef4444" : "none"} stroke={likes[post.id] ? "#ef4444" : "currentColor"} />
                  </button>
                  <button onClick={() => setShowComments(s => ({ ...s, [post.id]: !s[post.id] }))}>
                    <MessageCircle size={23} />
                  </button>
                  <Share2 size={22} className="cursor-pointer" />
                </div>
                <button onClick={() => setSaved(s => ({ ...s, [post.id]: !s[post.id] }))}>
                  <Bookmark size={22} fill={saved[post.id] ? "#f59e0b" : "none"} stroke={saved[post.id] ? "#f59e0b" : "currentColor"} />
                </button>
              </div>

              {post.caption && (
                <p className="text-xs text-neutral-200 mb-2">
                  <span className="font-bold mr-2 text-amber-400">@{post.profiles?.username}</span>
                  {post.caption}
                </p>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function CreateScreen({ profile, reload, setScreen }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 700;
        const scale = MAX / img.width;
        canvas.width = MAX;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPreview(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    r.readAsDataURL(f);
  }

  async function publish(e) {
    e.preventDefault();
    if (!preview || !profile || busy) return;
    setBusy(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: profile.id,
          caption: caption,
          image_url: preview,
          location: "Punjab"
        })
      });

      if (res.ok) {
        reload();
        setScreen("home");
      } else {
        alert("Upload error.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setBusy(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setScreen("home")}><ArrowLeft size={22} /></button>
        <h2 className="text-sm font-bold">ਨਵੀਂ ਪੋਸਟ / ਸਟੋਰੀ</h2>
        <div className="w-5"></div>
      </div>

      <input type="file" accept="image/*" ref={fileRef} onChange={pickFile} className="hidden" />

      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 text-center cursor-pointer bg-neutral-900/50">
          <Plus className="mx-auto text-amber-500 mb-2" size={36} />
          <p className="text-xs text-neutral-300 font-medium">ਫੋਟੋ ਚੁਣੋ (Select Photo)</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPreview("")} className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs">✕</button>
        </div>
      )}

      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500 min-h-24" />

      <button onClick={publish} disabled={!preview || busy} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3 rounded-xl text-xs disabled:opacity-40 shadow-lg">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਸ਼ੇਅਰ ਕਰੋ (Share)"}
      </button>
    </div>
  );
}

function ReelsScreen({ posts, setScreen }) {
  return (
    <div className="h-screen bg-black relative flex flex-col justify-between pb-20">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <button onClick={() => setScreen("home")} className="bg-black/50 p-1.5 rounded-full"><ArrowLeft size={20} /></button>
        <span className="font-bold text-sm">Punjab Reels</span>
      </div>

      {posts.length > 0 ? (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950">
          <img src={posts[0].image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-16 left-4 right-4 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">
                {(posts[0].profiles?.username || "P")[0]}
              </div>
              <span className="font-bold text-xs">@{posts[0].profiles?.username}</span>
            </div>
            <p className="text-xs text-neutral-200">{posts[0].caption}</p>
          </div>
          <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4 z-10">
            <button className="flex flex-col items-center text-white"><Heart size={26} /><span className="text-[10px]">ਲਾਈਕ</span></button>
            <button className="flex flex-col items-center text-white"><MessageCircle size={26} /><span className="text-[10px]">ਕਮੈਂਟ</span></button>
            <button className="flex flex-col items-center text-white"><Share2 size={26} /><span className="text-[10px]">ਸ਼ੇਅਰ</span></button>
          </div>
        </div>
      ) : (
        <div className="text-center text-neutral-500 text-xs py-20">ਕੋਈ ਰੀਲ ਉਪਲਬਧ ਨਹੀਂ ਹੈ</div>
      )}
    </div>
  );
}

function SearchScreen({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPosts = posts.filter(p => p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || p.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-3 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
        <input 
          type="text" 
          placeholder="ਖੋਜੋ (Search)..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-1">
        {filteredPosts.map(p => (
          <div key={p.id} className="aspect-square bg-neutral-900 overflow-hidden">
            {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ profile, posts, reload }) {
  const myPosts = posts.filter(p => p.user_id === profile?.id);

  async function deletePost(id) {
    if (!confirm("ڈਿਲੀਟ ਕਰਨਾ ਹੈ?")) return;
    await supabase.from("posts").delete().eq("id", id);
    reload();
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-amber-500 flex items-center justify-center font-bold text-lg text-amber-400">
            {(profile?.username || "P")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-sm">@{profile?.username}</h2>
            <p className="text-xs text-neutral-400">{profile?.full_name}</p>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="border border-neutral-800 p-2 rounded-lg text-red-400 bg-neutral-900">
          <LogOut size={16} />
        </button>
      </div>

      <div className="text-xs text-neutral-400 font-bold">ਮੇريਆਂ ਪੋਸਟਾਂ ({myPosts.length})</div>

      <div className="grid grid-cols-3 gap-1">
        {myPosts.map(p => (
