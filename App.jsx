import React, { useState, useEffect } from "react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => localStorage.getItem("punjab_active_user") || "");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none overflow-hidden relative">
        {/* ਪਜ਼ਲ ਵਾਂਗ ਘੁੰਮ ਕੇ ਇਕੱਠੇ ਹੋਣ ਵਾਲਾ ਐਨੀਮੇਸ਼ਨ ਇਫੈਕਟ */}
        <div className="relative flex items-center justify-center">
          {/* ਬਾਹਰੀ ਘੁੰਮਦਾ ਹੋਇਆ ਰਿੰਗ (Puzzle Rotation) */}
          <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-amber-500/50 animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-orange-500/40 animate-ping opacity-20"></div>

          {/* ਸੈਂਟਰ ਵਾਲਾ ਅਸਲੀ ਲੋਗੋ ਬਾਕਸ ਜਿਹੜਾ ਜ਼ੂਮ ਹੋ ਕੇ ਜੁੜਦਾ ਹੈ */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-500 p-1 shadow-2xl animate-bounce">
            <div className="w-full h-full bg-black rounded-[22px] flex flex-col items-center justify-center p-2">
              <span className="text-2xl font-black text-amber-400 font-serif tracking-wider">ਪੰਜਾਬ</span>
              <span className="text-[10px] text-amber-200/80 font-serif tracking-widest mt-0.5">Panjaab</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-black tracking-widest text-amber-400 mt-8 font-serif animate-pulse">ਪੰਜਾਬ</h1>
        <p className="text-[10px] text-neutral-400 mt-2 tracking-widest uppercase font-serif">ਅਸਲੀ ਪੰਜਾਬੀ ਸੋਸ਼ਲ ਨੈੱਟਵਰਕ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-amber-400 font-serif">ਜੀ ਆਇਆਂ ਨੂੰ, @{user || "ਵੀਰ ਜੀ"}!</h1>
      <p className="text-xs text-neutral-400 mt-2">ਸਪਲੈਸ਼ ਪਜ਼ਲ ਐਨੀਮੇਸ਼ਨ ਸਫ਼ਲਤਾਪੂਰਵਕ ਲਾਗੂ ਹੋ ਗਈ ਹੈ।</p>
    </div>
  );
}
