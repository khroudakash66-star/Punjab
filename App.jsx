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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        loadProfile(newSession.user.id);
        loadPosts();
      } else {
        setProfile(null);
        setPosts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadSession() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    if (data.session?.user) {
      await loadProfile(data.session.user.id);
      await loadPosts();
    }

    setLoading(false);
  }

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) setProfile(data);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setPosts(data || []);
  }

  async function logout() {
    await supabase.auth.signOut();
    setScreen("home");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-4xl font-black tracking-widest text-amber-400">PUNJAB</div>
          <div className="text-sm mt-2 opacity-60">ਸਾਡਾ ਪੰਜਾਬ</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setScreen("home")}
            className="text-xl font-black tracking-[0.2em] text-amber-400"
          >
            PUNJAB
          </button>

          <div className="flex items-center gap-5">
            <button onClick={() => setScreen("notifications")}>
              <Bell size={21} />
            </button>

            <button onClick={() => setScreen("messages")}>
              <Send size={21} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-24">
        {screen === "home" && (
          <HomeScreen
            posts={posts}
            profile={profile}
            reload={loadPosts}
            setScreen={setScreen}
          />
        )}

        {screen === "search" && (
          <SearchScreen
            search={search}
            setSearch={setSearch}
          />
        )}

        {screen === "create" && (
          <CreateScreen
            profile={profile}
            reload={loadPosts}
            setScreen={setScreen}
          />
        )}

        {screen === "reels" && (
          <ReelsScreen />
        )}

        {screen === "profile" && (
          <ProfileScreen
            profile={profile}
            posts={posts}
            logout={logout}
          />
        )}

        {screen === "notifications" && (
          <NotificationsScreen setScreen={setScreen} />
        )}

        {screen === "messages" && (
          <MessagesScreen />
        )}

        {screen === "memories" && (
          <MemoriesScreen
            posts={posts}
            setScreen={setScreen}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-2xl mx-auto h-16 flex items-center justify-around">
          <NavButton
            icon={<Home size={23} />}
            active={screen === "home"}
            onClick={() => setScreen("home")}
          />

          <NavButton
            icon={<Search size={23} />}
            active={screen === "search"}
            onClick={() => setScreen("search")}
          />

          <NavButton
            icon={<Plus size={25} />}
            active={screen === "create"}
            onClick={() => setScreen("create")}
          />

          <NavButton
            icon={<Play size={23} />}
            active={screen === "reels"}
            onClick={() => setScreen("reels")}
          />

          <NavButton
            icon={<User size={23} />}
            active={screen === "profile"}
            onClick={() => setScreen("profile")}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 transition ${
        active ? "text-amber-400 scale-110" : "text-white/50"
      }`}
    >
      {icon}
    </button>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Account created successfully. You can now log in.");
      }
    }

    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5 font-sans">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl font-black tracking-[0.18em] text-amber-400">
            PUNJAB
          </div>

          <div className="mt-2 text-sm text-amber-200/70">
            ਸਾਡਾ ਪੰਜਾਬ
          </div>

          <div className="mt-5 mx-auto w-16 h-16 border-2 border-amber-500 rounded-2xl bg-gradient-to-br from-red-800 via-amber-700 to-teal-900 flex items-center justify-center text-xl font-bold shadow-lg">
            ਪੰ
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm"
              />

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm"
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm"
          />

          <button
            disabled={busy}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold py-3 rounded-xl text-sm shadow-lg"
          >
            {busy
              ? "Please wait..."
              : mode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>

        {error && (
          <p className="text-xs text-amber-300 mt-4 text-center bg-amber-500/10 p-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="w-full mt-6 text-xs text-neutral-400 hover:text-amber-400 transition"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ posts, profile, reload, setScreen }) {
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});

  async function toggleLike(post) {
    if (!profile) return;

    if (liked[post.id]) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", profile.id);

      setLiked((x) => ({ ...x, [post.id]: false }));
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({
          post_id: post.id,
          user_id: profile.id,
        });

      if (!error) {
        setLiked((x) => ({ ...x, [post.id]: true }));
      }
    }
    reload();
  }

  async function toggleSave(post) {
    if (!profile) return;

    if (saved[post.id]) {
      await supabase
        .from("saved_posts")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", profile.id);

      setSaved((x) => ({ ...x, [post.id]: false }));
    } else {
      const { error } = await supabase
        .from("saved_posts")
        .insert({
          post_id: post.id,
          user_id: profile.id,
        });

      if (!error) {
        setSaved((x) => ({ ...x, [post.id]: true }));
      }
    }
  }

  return (
    <div>
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold">Home Feed</h1>
          <p className="text-white/50 text-xs">Welcome to Punjab Social</p>
        </div>

        <button
          onClick={() => setScreen("memories")}
          className="border border-amber-500/50 bg-amber-500/10 text-amber-400 rounded-full px-4 py-1.5 text-xs font-semibold"
        >
          ਪੰਜਾਬ ਦੀਆਂ ਯਾਦਾਂ
        </button>
      </div>

      <div className="px-4 space-y-6 mt-4">
        {posts.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-10 text-center bg-neutral-900/50">
            <p className="text-white/60 text-sm">No posts yet.</p>
            <button
              onClick={() => setScreen("create")}
              className="mt-4 bg-amber-500 text-black px-5 py-2 rounded-xl text-xs font-bold"
            >
              Create first post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={!!liked[post.id]}
              saved={!!saved[post.id]}
              onLike={() => toggleLike(post)}
              onSave={() => toggleSave(post)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({ post, liked, saved, onLike, onSave }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const author = post.profiles || {};

  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  async function addComment() {
    if (!comment.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: comment.trim(),
    });

    if (!error) {
      setComment("");
      loadComments();
    }
  }

  useEffect(() => {
    loadComments();
  }, [post.id]);

  return (
    <article className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950 shadow-xl">
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-amber-500 bg-neutral-800 flex items-center justify-center text-xs font-bold text-amber-400">
            {(author.username || "P").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold">@{author.username || "Punjab User"}</div>
            <div className="text-[10px] text-white/40 flex items-center gap-1">
              <MapPin size={10} />
              {post.location || "Punjab"}
            </div>
          </div>
        </div>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full aspect-square object-cover bg-neutral-900" />
      )}

      {post.video_url && (
        <video src={post.video_url} controls className="w-full max-h-[600px] bg-black" />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={onLike}>
              <Heart size={22} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} />
            </button>
            <button>
              <MessageCircle size={22} />
            </button>
            <button>
              <Send size={21} />
            </button>
          </div>
          <button onClick={onSave}>
            <Bookmark size={22} fill={saved ? "#f59e0b" : "none"} stroke={saved ? "#f59e0b" : "currentColor"} />
          </button>
        </div>

        <div className="mt-2.5 text-xs font-semibold">{post.likes_count || 0} likes</div>

        {post.caption && (
          <p className="mt-1.5 text-xs text-white/90">
            <span className="font-bold mr-2 text-amber-400">@{author.username || "user"}</span>
            {post.caption}
          </p>
        )}

        <div className="mt-3 space-y-1.5">
          {comments.map((item) => (
            <div key={item.id} className="text-xs">
              <span className="font-bold mr-2 text-amber-300">@{item.profiles?.username || "user"}</span>
              <span className="text-neutral-300">{item.content}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-3 pt-2 border-t border-neutral-900">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-xs py-1.5 outline-none text-white placeholder:text-neutral-500"
          />
          <button onClick={addComment} className="text-xs font-bold text-amber-400">
            Post
          </button>
        </div>
      </div>
    </article>
  );
}

function CreateScreen({ profile, reload, setScreen }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isMemory, setIsMemory] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  function chooseFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function publish() {
    if (!file || !profile || busy) return;
    setBusy(true);

    try {
      const ext = file.name.split(".").pop();
      const path = `${profile.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) {
        console.warn("Storage upload note:", uploadError.message);
      }

      let publicUrl = "";
      try {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        publicUrl = urlData?.publicUrl || "";
      } catch (e) {
        publicUrl = preview;
      }

      const isVideo = file.type.startsWith("video/");

      const { error } = await supabase.from("posts").insert({
        user_id: profile.id,
        caption: caption.trim(),
        image_url: isVideo ? null : publicUrl,
        video_url: isVideo ? publicUrl : null,
        is_memory: isMemory,
        memory_tag: isMemory ? "Punjab Memory" : null,
        location: "Punjab",
      });

      if (error) throw error;

      setCaption("");
      setFile(null);
      setPreview("");
      setIsMemory(false);
      await reload();
      setScreen("home");
    } catch (err) {
      alert(err.message || "Upload failed");
    }
    setBusy(false);
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setScreen("home")}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">New Post / Reel</h1>
      </div>

      <input type="file" accept="image/*,video/*" ref={fileRef} onChange={chooseFile} className="hidden" />

      {!preview ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-neutral-700 rounded-2xl p-10 text-center cursor-pointer bg-neutral-900/50"
        >
          <Plus className="mx-auto text-amber-500 mb-2" size={36} />
          <p className="text-xs text-neutral-300 font-medium">ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਫ਼ੋਟੋ/ਵੀਡੀਓ ਚੁਣੋ</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-800 bg-neutral-900">
          {file?.type.startsWith("video/") ? (
            <video src={preview} controls className="w-full h-full object-cover" />
          ) : (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => { setFile(null); setPreview(""); }}
            className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="ਕੁਝ ਲਿਖੋ ਪੰਜਾਬ ਬਾਰੇ..."
        className="w-full mt-4 bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white ou
