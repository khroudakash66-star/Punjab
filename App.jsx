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
  Bell,
  Send,
  ArrowLeft,
  LogOut,
  MapPin,
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
        <div className="text-2xl font-black text-amber-400 tracking-widest">PUNJAB</div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-50 bg-black/90 border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-black tracking-widest text-amber-400">PUNJAB</span>
        <button onClick={() => supabase.auth.signOut()} className="text-xs text-red-400">ਲੌਗ ਆਉਟ</button>
      </header>

      <main className="max-w-md mx-auto pb-24 pt-2">
        {screen === "home" && <HomeScreen posts={posts} profile={profile} reload={loadPosts} setScreen={setScreen} />}
        {screen === "create" && <CreateScreen profile={profile} reload={loadPosts} setScreen={setScreen} />}
        {screen === "reels" && <ReelsScreen />}
        {screen === "profile" && <ProfileScreen profile={profile} posts={posts} />}
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

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
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
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
        <h1 className="text-2xl font-black text-amber-400 text-center mb-6">PUNJAB</h1>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="w-full bg-neutral-800 p-3 rounded-xl text-xs outline-none text-white" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-neutral-800 p-3 rounded-xl text-xs outline-none text-white" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full bg-neutral-800 p-3 rounded-xl text-xs outline-none text-white" />
          <button className="w-full bg-amber-500 text-black font-bold p-3 rounded-xl text-xs">{mode === "login" ? "Log in" : "Sign up"}</button>
        </form>
        {error && <p className="text-xs text-amber-300 mt-3 text-center">{error}</p>}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="w-full mt-4 text-xs text-neutral-400">
          {mode === "login" ? "Don't have an account? Sign up" : "Have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ posts, profile, reload, setScreen }) {
  async function toggleLike(post) {
    if (!profile) return;
    await supabase.from("post_likes").insert({ post_id: post.id, user_id: profile.id });
    reload();
  }

  return (
    <div className="space-y-4 px-2">
      {posts.length === 0 ? (
        <p className="text-center text-neutral-500 text-xs py-12">No posts yet. Create one!</p>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-3 text-xs font-bold text-amber-400">@{post.profiles?.username || "user"}</div>
            {post.image_url && <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />}
            {post.video_url && <video src={post.video_url} controls className="w-full max-h-96 bg-black" />}
            <div className="p-3 text-xs">
              <button onClick={() => toggleLike(post)} className="mb-2"><Heart size={20} /></button>
              <p><span className="font-bold mr-2 text-amber-400">@{post.profiles?.username}</span>{post.caption}</p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function CreateScreen({ profile, reload, setScreen }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  function chooseFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function publish() {
    if (!file || !profile || busy) return;
    setBusy(true);
    try {
      const path = `${profile.id}/${Date.now()}.${file.name.split(".").pop()}`;
      await supabase.storage.from("media").upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      const isVideo = file.type.startsWith("video/");

      await supabase.from("posts").insert({
        user_id: profile.id,
        caption,
        image_url: isVideo ? null : publicUrl,
        video_url: isVideo ? publicUrl : null,
      });

      reload();
      setScreen("home");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setBusy(false);
  }

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept="image/*,video/*" ref={fileRef} onChange={chooseFile} className="hidden" />
      {!preview ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-neutral-700 rounded-2xl p-10 text-center cursor-pointer bg-neutral-900">
          <Plus className="mx-auto text-amber-500 mb-2" size={32} />
          <p className="text-xs text-neutral-300">ਫ਼ੋਟੋ ਜਾਂ ਵੀਡੀਓ ਚੁਣੋ</p>
        </div>
      ) : (
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setPreview("")} className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs">✕</button>
        </div>
      )}
      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="ਕੁਝ ਲਿਖੋ..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none" />
      <button onClick={publish} disabled={!file || busy} className="w-full bg-amber-500 text-black font-bold p-3 rounded-xl text-xs disabled:opacity-40">
        {busy ? "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..." : "ਪੋਸਟ ਕਰੋ"}
      </button>
    </div>
  );
}

function ReelsScreen() {
  const [reels, setReels] = useState([]);
  useEffect(() => {
    supabase.from("posts").select(`*, profiles:user_id (username)`).not("video_url", "is", null).then(({ data }) => setReels(data || []));
  }, []);

  return (
    <div className="space-y-4">
      {reels.map(r => (
        <div key={r.id} className="bg-black border-b border-neutral-800">
          <video src={r.video_url} controls className="w-full max-h-[600px] object-contain bg-black" />
          <div className="p-3 text-xs"><span className="font-bold text-amber-400">@{r.profiles?.username}</span> {r.caption}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ profile, posts }) {
  const myPosts = posts.filter(p => p.user_id === profile?.id);
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
        <div className="w-14 h-14 rounded-full bg-neutral-800 border border-amber-500 flex items-center justify-center font-bold text-amber-400">
          {(profile?.username || "P")[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-sm">@{profile?.username}</h2>
          <p className="text-xs text-neutral-400">{profile?.full_name}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {myPosts.map(p => (
          <div key={p.id} className="aspect-square bg-neutral-900">
            {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <video src={p.video_url} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
    </div>
  );
}
