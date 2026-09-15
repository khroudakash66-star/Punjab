import React, { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = "https://ggylacnqrxezjxqjoeuq.supabase.co";
const SUPABASE_KEY = "Sb_publishable_B7kdNhTOApIbatGO9Ez1qA_VPD2UEBR";

const getStore = (k, d) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const setStore = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(() => getStore('punjab_usr', null));
  const [authMode, setAuthMode] = useState('login');
  const [uid, setUid] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const [tab, setTab] = useState('home');
  const [profileTab, setProfileTab] = useState('posts');
  const [story, setStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);

  const fileRef = useRef(null);
  const [postImg, setPostImg] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const stories = [
    { id: 1, u: "amritsar", img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd1?w=600&auto=format&fit=crop" },
    { id: 2, u: "virasat", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" },
    { id: 3, u: "kisaan", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop" }
  ];

  const reels = [
    { id: 101, u: "virasat_punjab", desc: "Rangla Punjab 🌾✨ #Punjab #Reels", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop", likes: 3420 },
    { id: 102, u: "kisaan_jatt", desc: "Fields of Punjab 🚜❤️", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop", likes: 5120 }
  ];

  const t = {
    en: { login: "Log In", signup: "Sign Up", uid: "User ID", pwd: "Password", name: "Full Name", need: "Need an account? Sign up", has: "Have an account? Log in", out: "Log Out", share: "Share Post", newP: "New Post", cam: "Choose Photo / Camera", change: "Change Photo", cap: "Write a caption...", likes: "likes", posts: "Posts", fol: "Followers", fing: "Following" },
    pa: { login: "ਲਾਗ ਇਨ", signup: "ਸਾਈਨ ਅੱਪ", uid: "ਯੂਜ਼ਰ ਆਈਡੀ", pwd: "ਪਾਸਵਰਡ", name: "ਪੂਰਾ ਨਾਮ", need: "ਖਾਤਾ ਬਣਾਓ", has: "ਲਾਗ ਇਨ ਕਰੋ", out: "ਲੌਗ ਆਉਟ", share: "ਪੋਸਟ ਕਰੋ", newP: "ਨਵੀਂ ਪੋਸਟ", cam: "ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ ਚੋਂ ਚੁਣੋ", change: "ਹੋਰ ਫੋਟੋ ਲਵੋ", cap: "ਕੁਝ ਲਿਖੋ...", likes: "ਪਸੰਦ", posts: "ਪੋਸਟਾਂ", fol: "ਫੋਲੋਅਰਜ਼", fing: "ਫੋਲੋਇੰਗ" }
  }[lang];

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      if (res.ok) {
        const d = await res.json();
        setPosts(d.map(p => ({ id: p.id, u: p.author, loc: p.location || 'Punjab', img: p.image, cap: p.caption, likes: p.likes || 0, liked: false, saved: false })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
