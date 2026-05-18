import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Shield, Zap, Globe, Smartphone, Play, Video, Music, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn, trackAdClick, trackDownload } from './lib/firebase';
import ActivityFeed from './components/ActivityFeed';

// Mock UI State for demonstration
type DownloadState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<DownloadState>('idle');

  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    signIn().catch((err: any) => {
      if (err.code === 'auth/admin-restricted-operation') {
        // Log a more helpful message to the console for the developer
        console.error("Firebase Anonymous Auth is disabled. Please enable it in Firebase Console -> Build -> Authentication -> Sign-in method.");
      } else {
        console.error("Firebase Auth initialization failed:", err);
      }
    });
  }, []);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setState('loading');
    setVideoData(null);

    try {
      const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (response.ok) {
        setVideoData(data);
        setState('success');
        // Track the download attempt
        try {
          const platform = new URL(url).hostname.replace('www.', '').split('.')[0];
          trackDownload(url, platform);
        } catch (e) {
          trackDownload(url, 'unknown');
        }
      } else {
        setState('error');
      }
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 font-sans selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Download size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase italic">Ultimate<span className="text-orange-500">Loader</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Supported Sites</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </nav>

          <button className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded-full hover:bg-white/5 transition-colors uppercase tracking-widest bg-white/5">
            IP: 103.xxx.xxx.xxx
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase italic"
          >
            Download Any Video <br />
            <span className="text-orange-500">Instantly</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Highest quality MP4 and MP3 downloader for Facebook, Instagram, Twitter, and YouTube. No limits, no junk.
          </motion.p>
        </div>

        {/* Downloader Widget */}
        <section className="max-w-3xl mx-auto mb-20 px-1">
          <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
            <div className="bg-[#1a1c23] rounded-[15px] p-6 md:p-8 backdrop-blur-xl">
              <form onSubmit={handleFetch} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                    <LinkIcon size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Paste video URL here..."
                    className="w-full h-14 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-gray-200 transition-all placeholder:text-gray-600"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={state === 'loading'}
                  className="h-14 px-8 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                >
                  {state === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>FETCH VIDEO</span>
                      <Zap size={18} className="fill-current group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Status Message */}
              <AnimatePresence>
                {state === 'success' && videoData && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-white/5"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-64 aspect-video bg-black/40 rounded-lg overflow-hidden relative group cursor-pointer border border-white/5">
                        <img src={videoData.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"} alt="Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={40} className="text-white opacity-80" />
                        </div>
                        {videoData.duration && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono">
                            {Math.floor(videoData.duration / 60)}:{String(videoData.duration % 60).padStart(2, '0')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg leading-tight mb-1">{videoData.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 lowercase italic font-mono">
                            < Globe size={12} /> {new URL(url).hostname}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {videoData.formats && videoData.formats.map((format: any, idx: number) => (
                            <a 
                              key={idx}
                              href={format.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                {format.ext === 'mp3' ? <Music size={18} className="text-blue-500" /> : <Video size={18} className="text-orange-500" />}
                                <span className="text-sm font-medium">{format.resolution} {format.ext.toUpperCase()}</span>
                              </div>
                              <Download size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {state === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center"
                  >
                    Failed to fetch video. Please check the URL or try again later.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Ad Placeholder Section */}
        <div className="max-w-4xl mx-auto mb-20 text-center space-y-4">
          <div 
            onClick={() => trackAdClick('native-banner-1')}
            className="bg-white/5 border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 transition-all active:scale-95"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-mono opacity-20 group-hover:opacity-100 transition-opacity">Adsterra Native Banner Slot</span>
            <div className="w-full h-24 mt-4 flex items-center justify-center">
              <p className="text-gray-600 text-sm italic">Monetization space ready for your scripts. (Click to test Firebase Tracking)</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <FeatureCard 
            icon={<Zap className="text-orange-500" />}
            title="Fast Processing"
            description="Our advanced backend servers fetch any video content in seconds using high-performance IP rotation."
          />
          <FeatureCard 
            icon={<Shield className="text-blue-500" />}
            title="Privacy First"
            description="We don't track your downloads. No registration, no cookies, just pure downloading service."
          />
          <FeatureCard 
            icon={<Smartphone className="text-purple-500" />}
            title="Mobile Friendly"
            description="Fully responsive design that works perfectly on Android, iOS, and all desktop browsers."
          />
        </section>

        {/* Trust/Stats */}
        <section className="border-t border-white/5 pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black italic uppercase italic">50+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sites Supported</div>
          </div>
          <div>
            <div className="text-3xl font-black italic uppercase italic">4K</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">HD Downloading</div>
          </div>
          <div>
            <div className="text-3xl font-black italic uppercase italic">0%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Failure Rate</div>
          </div>
          <div>
            <div className="text-3xl font-black italic uppercase italic">28</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Secure IP Blocks</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 contrast-0 grayscale">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
              <Download size={12} className="text-black" />
            </div>
            <span className="font-bold text-sm tracking-tight uppercase italic underline decoration-white/20 underline-offset-4">UltimateLoader</span>
          </div>
          <p className="text-xs text-gray-600 font-mono">
            &copy; 2026 ULTIMATELOADER. ALL RIGHTS RESERVED. NOT AFFILIATED WITH YOUTUBE OR META.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white">API Docs</a>
            <a href="#" className="hover:text-white">Help</a>
          </div>
        </div>
      </footer>

      {/* Real-time testing feed */}
      <ActivityFeed />
    </div>
  );
}

// Utility to inject Adsterra script (Example Usage)
/*
function useAdsterra(containerId: string, scriptSrc: string) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    const container = document.getElementById(containerId);
    if (container) container.appendChild(script);
    return () => { if (container) container.removeChild(script); };
  }, [containerId, scriptSrc]);
}
*/

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[#14161c] border border-white/5 hover:border-white/10 transition-colors group">
      <div className="mb-6 scale-110 group-hover:scale-125 transition-transform origin-left">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight italic uppercase italic">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
        <CheckCircle2 size={10} className="text-orange-500" /> Secure Encryption
      </div>
    </div>
  );
}
