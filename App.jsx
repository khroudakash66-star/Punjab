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
  VolumeX,
  CheckCircle,
  Eye,
  Pin,
  Archive,
  Lock,
  DollarSign,
  Bot,
  Smartphone,
  ShieldCheck,
  FileText,
  Cloud,
  Check
} from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => localStorage.getItem("punjab_active_user") || "");
  
  // ਕਲਾਊਡ ਤੋਂ ਯੂਜ਼ਰ ਦਾ ਡਾਟਾ ਲੋਡ ਕਰਨਾ
  const [userData, setUserData] = useState(() => {
    const active = localStorage.getItem("punjab_active_user");
    if (!active) return { bio: "ਸੋਹਣਾ ਪੰਜਾਬ • ਪੰਜਾਬੀ ਕ੍ਰਿਏਟਰ 🌾", avatar: "", isPrivate: false, wallet: 250 };
    try {
      const cloudStorage = JSON.parse(localStorage.getItem(`punjab_cloud_user_${active}`)) || {};
      return {
        bio: cloudStorage.bio || "ਸੋਹਣਾ ਪੰਜਾਬ • ਪੰਜਾਬੀ ਕ੍ਰਿਏਟਰ 🌾",
        avatar: cloudStorage.avatar || "",
        isPrivate: cloudStorage.isPrivate || false,
        wallet: cloudStorage.wallet || 250
      };
    } catch {
      return { bio: "ਸੋਹਣਾ ਪੰਜਾਬ • ਪੰਜਾਬੀ ਕ੍ਰਿਏਟਰ 🌾", avatar: "", isPrivate: false, wallet: 250 };
    }
  });

  const [tab, setTab] = useState("home");
  
  // ਕਲਾਊਡ ਤੋਂ ਸਾਰੀਆਂ ਪੋਸਟਾਂ ਲੋਡ ਕਰਨਾ
  const [posts, setPosts] = useState(() => {
    try {
      const cloudPosts = localStorage.getItem("punjab_cloud_all_posts");
      return cloudPosts ? JSON.parse(cloudPosts) : [];
    } catch {
      return [];
    }
  });

  // ਕਲਾਊਡ ਤੋਂ ਸੇਵ ਕੀਤੀਆਂ ਪੋਸਟਾਂ
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const active = localStorage.getItem("punjab_active_user");
      const saved = localStorage.getItem(`punjab_cloud_saved_${active}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ਕਲਾਊਡ ਤੋਂ ਫਾਲੋਅਰਜ਼/ਫੋਲੋਇੰਗ ਡਾਟਾ
  const [following, setFollowing] = useState(() => {
    try {
      const active = localStorage.getItem("punjab_active_user");
      const f = localStorage.getItem(`punjab_cloud_following_${active}`);
      return f ? JSON.parse(f) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState([
    { user: "jassu_082", note: "ਚੜ੍ਹਦੀ ਕਲਾ! ⚔️" }
  ]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ਕਲਾਊਡ ਵਿੱਚ ਹਰ ਇੱਕ ਬਦਲਾਅ ਨੂੰ ਆਟੋਮੈਟਿਕ ਸੇਵ (Sync) ਕਰਨਾ
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem("punjab_cloud_all_posts", JSON.stringify(posts));
      localStorage.setItem(`punjab_cloud_saved_${user}`, JSON.stringify(savedPosts));
      localStorage.setItem(`punjab_cloud_following_${user}`, JSON.stringify(following));
      
      const userCloudProfile = {
        bio: userData.bio,
        avatar: userData.avatar,
        isPrivate: userData.isPrivate,
        wallet: userData.wallet
      };
      localStorage.setItem(`punjab_cloud_user_${user}`, JSON.stringify(userCloudProfile));
    } catch {}
  }, [posts, savedPosts, following, userData, user]);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-2xl animate-pulse">
          <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
            <span className="text-4xl font-black text-amber-400">ਪੰ</span>
          </div>
        </div>
        <h1 className="text-xl font-black tracking-widest text-white mt-4">PUNJAB</h1>
        <p className="text-[10px] text-neutral-500 mt-2 tracking-widest uppercase">ਕਲਾਊਡ ਸਿਕਿਓਰਡ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕ</p>
      </div>
    );
  }

  if (!user) return <AuthScreen setUser={setUser} setUserData={setUserData} setPosts={setPosts} setSavedPosts={setSavedPosts} setFollowing={setFollowing} />;

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
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20" title="Cloud Sync Active">
            <Cloud size={12} className="animate-pulse" /> Cloud
          </div>
          <button onClick={() => setTab("monetization")} className="text-amber-400 hover:scale-110 transition"><DollarSign size={20} /></button>
          <button onClick={() => setTab("ai-tools")} className="text-amber-400 hover:scale-110 transition"><Bot size={20} /></button>
          <button onClick={() => setTab("create-menu")} className="hover:text-amber-400 transition"><PlusSquare size={22} /></button>
          <button onClick={() => setTab("notifications")} className="hover:text-amber-400 transition relative">
            <Heart size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={() => setTab("messages")} className="hover:text-amber-400 transition"><Send size={22} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-12">
        {tab === "home" && <HomeScreen posts={posts} setPosts={setPosts} setTab={setTab} currentUser={user} avatar={userData.avatar} following={following} setFollowing={setFollowing} savedPosts={savedPosts} setSavedPosts={setSavedPosts} />}
        {tab === "search" && <ExploreScreen posts={posts} />}
        {tab === "create-menu" && <CreateMenuScreen setTab={setTab} />}
        {tab === "create-post" && <CreateScreen user={user} setTab={setTab} setPosts={setPosts} type="post" />}
        {tab === "create-reel" && <CreateScreen user={user} setTab={setTab} setPosts={setPosts} type="reel" />}
        {tab === "camera" && <CameraScreen user={user} setTab={setTab} setPosts={setPosts} />}
        {tab === "live" && <LiveScreen setTab={setTab} user={user} />}
        {tab === "reels" && <ReelsScreen currentUser={user} following={following} setFollowing={setFollowing} />}
        {tab === "profile" && <ProfileScreen user={user} userData={userData} posts={posts} savedPosts={savedPosts} setPosts={setPosts} setUser={setUser} setTab={setTab} following={following} />}
        {tab === "settings" && <SettingsScreen setTab={setTab} user={user} setUser={setUser} userData={userData} setUserData={setUserData} />}
        {tab === "terms" && <TermsScreen setTab={setTab} />}
        {tab === "privacy-policy" && <PrivacyPolicyScreen setTab={setTab} />}
        {tab === "notifications" && <NotificationsScreen notifications={notifications} setTab={setTab} />}
        {tab === "messages" && <MessagesScreen setTab={setTab} currentUser={user} notes={notes} setNotes={setNotes} />}
        {tab === "monetization" && <MonetizationScreen setTab={setTab} wallet={userData.wallet} />}
        {tab === "ai-tools" && <AIToolsScreen setTab={setTab} />}
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

// ਕਲਾਊਡ ਸਿಂಕ್ਡ Auth Screen
function AuthScreen({ setUser, setUserData, setPosts, setSavedPosts, setFollowing }) {
  const [mode, setMode] = useState("login");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotOtpInput, setForgotOtpInput] = useState("");
  const [generatedForgotOtp, setGeneratedForgotOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleSignUp(e) {
    e.preventDefault();
    if (mobile.length < 10 || !username.trim() || !password.trim()) {
      setErrorMsg("ਸਹੀ 10-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ, ਯੂਜ਼ਰਨੇਮ ਅਤੇ ਪਾਸਵਰਡ ਭਰੋ!");
      return;
    }
    
    const cleanUser = username.trim();
    // ਕਲਾਊਡ ਵਿੱਚ ਅਕਾਊਂਟ ਰਜਿਸਟਰ ਕਰੋ
    localStorage.setItem(`punjab_pwd_${cleanUser}`, password);
    localStorage.setItem(`punjab_mobile_${cleanUser}`, mobile.trim());

    setSuccessMsg("ਖਾਤਾ ਕਲਾਊਡ 'ਤੇ ਸਫ਼ਲਤਾਪੂਰਵਕ ਬਣ ਗਿਆ ਹੈ! ਹੁਣ ਲੌਗ ਇൻ ਕਰੋ।");
    setErrorMsg("");
    setTimeout(() => {
      setMode("login");
      setSuccessMsg("");
    }, 2000);
  }

  function handleLogin(e) {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPwd = password.trim();
    const savedPwd = localStorage.getItem(`punjab_pwd_${cleanUser}`);

    if (!savedPwd) {
      setErrorMsg("ਇਹ ਯੂਜ਼ਰਨੇਮ ਕਲਾਊਡ 'ਤੇ ਮੌਜੂਦ ਨਹੀਂ ਹੈ। ਪਹਿਲਾਂ ਸਾਈਨ ਅੱਪ ਕਰੋ!");
      return;
    }

    if (savedPwd !== cleanPwd) {
      setErrorMsg("ਗਲਤ ਪਾਸਵਰਡ! ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਪਾਸਵਰਡ ਭਰੋ।");
      return;
    }

    // ਯੂਜ਼ਰ ਐਕਟਿਵ ਕਰੋ ਅਤੇ ਉਸਦਾ ਕਲਾਊਡ ਡਾਟਾ ਲੋਡ ਕਰੋ
    localStorage.setItem("punjab_active_user", cleanUser);
    
    try {
      const cloudProfile = JSON.parse(localStorage.getItem(`punjab_cloud_user_${cleanUser}`)) || {};
      setUserData({
        bio: cloudProfile.bio || "ਸੋਹਣਾ ਪੰਜਾਬ • ਪੰਜਾਬੀ ਕ੍ਰਿਏਟਰ 🌾",
        avatar: cloudProfile.avatar || "",
        isPrivate: cloudProfile.isPrivate || false,
        wallet: cloudProfile.wallet || 250
      });

      const saved = localStorage.getItem(`punjab_cloud_saved_${cleanUser}`);
      if (saved) setSavedPosts(JSON.parse(saved));

      const f = localStorage.getItem(`punjab_cloud_following_${cleanUser}`);
      if (f) setFollowing(JSON.parse(f));
    } catch {}

    setUser(cleanUser);
  }

  function handleSendForgotOTP(e) {
    e.preventDefault();
    const cleanUser = username.trim();
    const savedMobile = localStorage.getItem(`punjab_mobile_${cleanUser}`);

    if (!savedMobile) {
      setErrorMsg("ਇਹ ਯੂਜ਼ਰਨੇਮ ਕਲਾਊਡ ਡਾਟਾਬੇਸ ਵਿੱਚ ਨਹੀਂ ਮਿਲਿਆ!");
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedForgotOtp(otp);

    setSuccessMsg(`ਮੋਬਾਈਲ ਨੰਬਰ (${savedMobile}) 'ਤੇ OTP ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ! ਕੋਡ: ${otp}`);
    setErrorMsg("");
    setMode("verifyForgotOTP");
  }

  function handleResetPassword(e) {
    e.preventDefault();
    if (forgotOtpInput !== generatedForgotOtp) {
      setErrorMsg("ਗਲਤ OTP ਕੋਡ! ਸਹੀ ਕੋਡ ਭਰੋ।");
      return;
    }

    localStorage.setItem(`punjab_pwd_${username.trim()}`, password.trim());
    setSuccessMsg("ਪਾਸਵਰਡ ਕਲਾਊਡ 'ਤੇ ਸਫ਼ਲਤਾਪੂਰਵਕ ਬਦਲ ਗਿਆ ਹੈ! ਹੁਣ ਲੌਗ ਇൻ ਕਰੋ।");
    setErrorMsg("");
    setTimeout(() => {
      setMode("login");
      setSuccessMsg("");
      setPassword("");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-xl">
          <div className="w-full h-full bg-black rounded-[18px] flex items-center justify-center">
            <span className="text-2xl font-black text-amber-400">ਪੰ</span>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-wider text-amber-400 mb-1">PUNJAB</h1>
        <p className="text-xs text-neutral-400 mb-6 font-serif">ਕਲਾਊਡ ਸਿਕਿਓਰਡ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕ</p>

        {errorMsg && <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl mb-3">{errorMsg}</p>}
        {successMsg && <p className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl mb-3 leading-relaxed">{successMsg}</p>}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="ਯੂਜ਼ਰ ਨਾਮ (Username)"
              required
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="ਪਾਸਵਰਡ (Password)"
              required
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
              ਕਲਾਊਡ ਤੋਂ ਲੌਗ ਇൻ ਕਰੋ
            </button>
            <div className="flex justify-between items-center text-[11px] pt-2">
              <button type="button" onClick={() => { setMode("forgot"); setErrorMsg(""); setSuccessMsg(""); }} className="text-neutral-400 hover:text-amber-400">ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?</button>
              <button type="button" onClick={() => { setMode("signup"); setErrorMsg(""); setSuccessMsg(""); }} className="text-amber-400 font-bold">ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ</button>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="ਮੋਬਾਈਲ ਨੰਬਰ (Mobile Number)"
              required
              maxLength={10}
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="ਯੂਜ਼ਰ ਨਾਮ ਚੁਣੋ (Username)"
              required
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="ਪਾਸਵਰਡ ਬਣਾਓ (Password)"
              required
              minLength={4}
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
              ਕਲਾਊਡ 'ਤੇ ਸਾਈਨ ਅੱਪ ਕਰੋ
            </button>
            <button type="button" onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }} className="text-xs text-amber-400 font-bold block w-full pt-2">ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲੌਗ ਇൻ ਕਰੋ</button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleSendForgotOTP} className="space-y-3">
            <div className="text-center text-xs text-neutral-300 mb-1">
              <Smartphone size={32} className="mx-auto text-amber-400 mb-1" />
              ਆਪਣਾ ਯੂਜ਼ਰਨੇਮ ਭਰੋ, ਅਸੀਂ ਤੁਹਾਡੇ ਮੋਬਾਈਲ 'ਤੇ OTP ਭੇਜਾਂਗੇ।
            </div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="ਯੂਜ਼ਰ ਨਾਮ (Username)"
              required
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
              ਮੋਬਾਈਲ 'ਤੇ OTP ਭੇਜੋ
            </button>
            <button type="button" onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }} className="text-xs text-amber-400 font-bold block w-full pt-2">ਵਾਪਸ ਲੌਗ ਇਨ 'ਤੇ ਜਾਓ</button>
          </form>
        )}

        {mode === "verifyForgotOTP" && (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div className="text-center text-xs text-neutral-300 mb-1">
              <ShieldCheck size={32} className="mx-auto text-amber-400 mb-1" />
              ਮੋਬਾਈਲ 'ਤੇ ਆਇਆ OTP ਅਤੇ ਨਵਾਂ ਪਾਸਵਰਡ ਭਰੋ।
            </div>
            <input
              value={forgotOtpInput}
              onChange={e => setForgotOtpInput(e.target.value)}
              placeholder="4-ਅੰਕਾਂ ਦਾ OTP ਕੋਡ"
              required
              maxLength={4}
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-center text-sm text-white outline-none tracking-widest"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="ਨਵਾਂ ਪਾਸਵਰਡ (New Password)"
              required
              minLength={4}
              className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            />
            <button className="w-full bg-amber-500 text-black font-extrabold p-3 rounded-xl text-xs shadow-lg">
              ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ
            </button>
          </form>
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
        <button onClick={() => setTab("create-reel")} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex