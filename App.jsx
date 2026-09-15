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
} from "lucide-react";

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOAplbatGO9Ez1qA_VPD2UEBR";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('punjab_user') || '');
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("home");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile({ username: user, full_name: user, id: user });
      loadPosts();
    }
  }, [user]);

  async function loadPosts() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
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
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative pb-20 border-x border-neutral-900">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-800 px-4 h-14 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-[0.2em] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 bg-clip-text text-transparent leading-none">
            PUNJAB
          </span>
          <span className="text-[9px] text-amber-300 font-serif tracking-widest">ਸਾਡਾ ਪੰਜਾਬ</span>
        </div>
        <button onClick={() => { localStorage.removeItem('punjab_user'); setUser(''); }} className="text-xs text-red-400 hover:text-red-300">
          ਲੌਗ ਆਉਟ
        </button>
      </header>

      <main className="pb-16">
        {screen === "home" && <HomeScreen posts={posts} profile={profile} reload={loadPosts} setScreen={setScreen} />}
        {screen === "search" && <SearchScreen />}
        {screen === "create" && <CreateScreen user={user} reload={loadPosts} setScreen={setScreen} />}
        {screen === "reels" && <ReelsScreen posts={posts} />}
        {screen === "profile" && <ProfileScreen user={user} posts={posts} />}
        {screen === "messages" && <MessagesScreen setScreen={setScreen} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 border-t border-neutral-800 flex justify-around py-3 z-50">
        <button onClick={() => setScreen("home")} className={screen === "home" ? "text-amber-400 scale-110" : "text-white/60"}><Home size={24} /></button>
        <button onClick={() => setScreen("search")} className={screen === "search" ? "text-amber-400 scale-110" : "text-white/60"}><Search size={24} /></button>
        <button onClick={() => setScreen("create")} className={screen === "create" ? "text-amber-400 scale-110" : "text-white/60"}><Plus size={26} /></button>
        <button onClick={() => setScreen("reels")} className={screen === "reels" ? "text-amber-400 scale-110" : "text-white/60"}><Play size={24} /></button>
        <button onClick={() => setScreen("profile")} className={screen === "profile" ? "text-amber-400 scale-110" : "text-white/60"}><User size={24} /></button>
      </nav>
    </div>
  );
}

function AuthScreen({ setUser }) {
  const [name, setName] = useState("");

  function login(e) {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem('punjab_user', name.trim());
    setUser(name.trim());
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-600 to-teal-800 p-0.5 flex items-center justify-center shadow-2xl">
          <div className="w-full h-full bg-black rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-amber-400">ਪੰ</span>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-[0.2em] bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-1">PUNJAB</h1>
        <p className="text-xs text-amber-200/70 mb-6 font-serif">ਸਾਡਾ ਪੰਜਾਬ - ਸੋਸ਼ਲ ਮੀਡੀਆ</p>

        <form onSubmit={login} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ਆਪਣਾ ਯੂਜ਼ਰ ਨਾਮ / ID ਲਿਖੋ..." required className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs outline-none text-white focus:border-amber-500" />
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
            ਸ਼ੁਰੂ ਕਰੋ (Enter)
          </button>
        </form>
      </div>
    </div>
  );
}

function HomeScreen({ posts, profile, reload, setScreen }) {
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-neutral-500 text-xs mb-3">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setScreen("create")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ</button>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-black border-b border-neutral-900">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                  {(post.author || "P")[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold">@{post.author}</div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-0.5"><MapPin size={9} /> Punjab</div>
                </div>
              </div>
            </div>

            {post.image && <img src={post.image} alt="" className="w-full aspect-square object-cover bg-neutral-900" />}

            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => setLikes(l => ({ ...l, [post.id]: !l[post.id] }))}>
                    <Heart size={23} fill={likes[post.id] ? "#ef4444" : "none"} stroke={likes[post.id] ? "#ef4444" : "currentColor"} />
                  </button>
                  <MessageCircle size={23} />
                  <Send size={22} />
                </div>
                <button onClick={() => setSaved(s => ({ ...s, [post.id]: !s[post.id] }))}>
                  <Bookmark size={22} fill={saved[post.id] ? "#f59e0b" : "none"} stroke={saved[post.id] ? "#f59e0b" : "currentColor"} />
                </button>
              </div>

              {post.caption && (
                <p className="text-xs text-neutral-200">
                  <span className="font-bold mr-2 text-amber-400">@{post.author}</span>
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

function CreateScreen({ user, reload, setScreen }) {
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
    if (!preview || busy) return;
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
          author: user,
          caption: caption,
          image: preview,
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
        <h2 className="text-sm font-bold">ਨਵੀਂ ਪੋਸਟ</h2>
        <div className="w-5"></div>
      </div>

      <input type="file" accept="image/*" ref={fileRef} onChange={pickFile} className="hidden" />

      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 text-center cursor-pointer bg-neutral-900/50">
          <Plus className="mx-auto text-amber-500 mb-2" size={36} />
          <p className="text-xs text-neutral-300 font-medium">ਫੋਟੋ ਚੁਣੋ</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPreview("")} className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs">✕</button>
        </div>
      )}

      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੈਪਸ਼ਨ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500 min-h-24" />

      <button onClick={publish} disabled={!preview || busy} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3 rounded-xl text-xs disabled:opacity-40">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਸ਼ੇਅਰ ਕਰੋ (Share)"}
      </button>
    </div>
  );
}

function ReelsScreen({ posts }) {
  return (
    <div className="space-y-4">
      <div className="p-3 font-bold text-sm border-b border-neutral-900">Reels</div>
      {posts.map(p => (
        <div key={p.id} className="bg-black border-b border-neutral-900">
          {p.image && <img src={p.image} alt="" className="w-full aspect-square object-cover" />}
          <div className="p-3 text-xs"><span className="font-bold text-amber-400 mr-2">@{p.author}</span>{p.caption}</div>
        </div>
      ))}
    </div>
  );
}

function SearchScreen() {
  return (
    <div className="p-4">
      <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-neutral-400">ਖੋਜੋ (Search)...</div>
    </div>
  );
}

function ProfileScreen({ user, posts }) {
  const myPosts = posts.filter(p => p.author === user);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-start border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-amber-500 flex items-center justify-center font-bold text-lg text-amber-400">
            {user[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-sm">@{user}</h2>
            <p className="text-xs text-neutral-400">ਪੰਜਾਬ ਯੂਜ਼ਰ</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {myPosts.map(p => (
          <div key={p.id} className="aspect-square bg-neutral-900">
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesScreen({ setScreen }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen("home")}><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Messages</h2>
      </div>
      <p className="text-neutral-500 text-xs text-center py-20">ਕਮਿਊਨਿਟੀ ਚੈਟ ਜਲਦੀ ਆ ਰਹੀ ਹੈ!</p>
    </div>
  );
}
