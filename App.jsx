import React, { useEffect, useState, useRef } from "react";
import {
  Home,
  Plus,
  Play,
  User,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  ArrowLeft,
} from "lucide-react";

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOAplbatGO9Ez1qA_VPD2UEBR";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('punjab_user') || '');
  const [screen, setScreen] = useState("home");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) loadPosts();
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
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-50 bg-black/90 border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-black tracking-widest text-amber-400">PUNJAB</span>
        <button onClick={() => { localStorage.removeItem('punjab_user'); setUser(''); }} className="text-xs text-red-400">ਲੌਗ ਆਉਟ</button>
      </header>

      <main className="max-w-md mx-auto pb-24 pt-2">
        {screen === "home" && <HomeScreen posts={posts} reload={loadPosts} setScreen={setScreen} />}
        {screen === "create" && <CreateScreen user={user} reload={loadPosts} setScreen={setScreen} />}
        {screen === "reels" && <ReelsScreen posts={posts} />}
        {screen === "profile" && <ProfileScreen user={user} posts={posts} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 border-t border-white/10 flex justify-around py-3 z-50">
        <button onClick={() => setScreen("home")} className={screen === "home" ? "text-amber-400" : "text-white/50"}><Home size={22} /></button>
        <button onClick={() => setScreen("reels")} className={screen === "reels" ? "text-amber-400" : "text-white/50"}><Play size={22} /></button>
        <button onClick={() => setScreen("create")} className={screen === "create" ? "text-amber-400" : "text-white/50"}><Plus size={24} /></button>
        <button onClick={() => setScreen("profile")} className={screen === "profile" ? "text-amber-400" : "text-white/50"}><User size={22} /></button>
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
      <div className="w-full max-w-sm bg-neutral-900 p-6 rounded-2xl border border-neutral-800 text-center">
        <h1 className="text-2xl font-black text-amber-400 mb-2">PUNJAB</h1>
        <p className="text-xs text-neutral-400 mb-6">ਸਾਡਾ ਪੰਜਾਬ - ਸੋਸ਼ਲ ਮੀਡੀਆ</p>
        <form onSubmit={login} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ਆਪਣਾ ਨਾਮ / ID ਲਿਖੋ..." required className="w-full bg-neutral-800 p-3 rounded-xl text-xs outline-none text-white border border-neutral-700" />
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3 rounded-xl text-xs">ਐਂਟਰ ਕਰੋ</button>
        </form>
      </div>
    </div>
  );
}

function HomeScreen({ posts, reload, setScreen }) {
  return (
    <div className="space-y-4 px-2">
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 text-xs mb-4">ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਹੈ!</p>
          <button onClick={() => setScreen("create")} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl">ਪਹਿਲੀ ਪੋਸਟ ਪਾਓ</button>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-3 text-xs font-bold text-amber-400">@{post.author}</div>
            <img src={post.image} alt="" className="w-full aspect-square object-cover bg-neutral-900" />
            <div className="p-3 text-xs">
              <div className="flex gap-4 mb-2"><Heart size={20} /><MessageCircle size={20} /><Send size={20} /></div>
              <p><span className="font-bold mr-2 text-amber-400">@{post.author}</span>{post.caption}</p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function CreateScreen({ user, reload, setScreen }) {
  const [caption, setCaption] = useState("");
  const [postImg, setPostImg] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setPostImg(r.result);
    r.readAsDataURL(f);
  }

  async function publish(e) {
    e.preventDefault();
    if (!postImg || busy) return;
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
          location: "Punjab",
          image: postImg,
          caption: caption,
          likes: 0
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
      <h2 className="text-sm font-bold">ਨਵੀਂ ਪੋਸਟ ਪਾਓ</h2>
      <input type="file" accept="image/*" ref={fileRef} onChange={pickFile} className="hidden" />
      {!postImg ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-2xl p-10 text-center cursor-pointer bg-neutral-900">
          <Plus className="mx-auto text-amber-500 mb-2" size={32} />
          <p className="text-xs text-neutral-300">ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਫ਼ੋਟੋ ਚੁਣੋ</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800">
          <img src={postImg} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPostImg(null)} className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs">✕</button>
        </div>
      )}
      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੁਝ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none" />
      <button onClick={publish} disabled={!postImg || busy} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold p-3 rounded-xl text-xs disabled:opacity-40">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਪੋਸਟ ਕਰੋ"}
      </button>
    </div>
  );
}

function ReelsScreen({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map(p => (
        <div key={p.id} className="bg-black border-b border-neutral-800">
          <img src={p.image} alt="" className="w-full aspect-square object-cover" />
          <div className="p-3 text-xs"><span className="font-bold text-amber-400">@{p.author}</span> {p.caption}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, posts }) {
  const myPosts = posts.filter(p => p.author === user);
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
        <div className="w-14 h-14 rounded-full bg-neutral-900 border border-amber-500 flex items-center justify-center font-bold text-amber-400">
          {user[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-sm">@{user}</h2>
          <p className="text-xs text-neutral-400">ਪੰਜਾਬ ਯੂਜ਼ਰ</p>
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
