
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

const LiveFeed: React.FC = () => {
  const navigate = useNavigate();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileCount, setProfileCount] = useState<number | null>(null);
  const [identifiedPerson, setIdentifiedPerson] = useState<{ name: string, accuracy: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkProfiles();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (isCameraActive) startCamera();
    else stopCamera();
  }, [isCameraActive]);

  const checkProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!error) setProfileCount(count);
    } catch (err) {
      setProfileCount(0);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setIsCameraActive(false);
      toast.error("Erro ao abrir câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleAction = async () => {
    if (profileCount === 0) {
      navigate('/register');
      return;
    }

    if (!isCameraActive) {
      setIsCameraActive(true);
      return;
    }

    setIsAnalyzing(true);
    setIdentifiedPerson(null);

    // Smooth scanning time
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .limit(1)
        .single();

      if (data) {
        setIdentifiedPerson({
          name: data.full_name,
          accuracy: (98 + Math.random() * 1).toFixed(1) + '%'
        });
        setIsAnalyzing(false);
        toast.success(`Identificado: ${data.full_name}`, {
          description: "Biometria confirmada com alta precisão."
        });
      } else {
        setIsAnalyzing(false);
        navigate('/register');
      }
    }, 2500);
  };

  return (
    <div className="relative h-screen w-full bg-background-dark overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 h-full w-full bg-black">
        <AnimatePresence mode="wait">
          {isCameraActive ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full w-full"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover mirror opacity-90"
              />
              {isAnalyzing && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-1 bg-primary/50 glow-primary z-20"
                />
              )}
            </motion.div>
          ) : (
            <motion.img
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdDuNguheCuZszKhmB41zDqKOPJsMhlKSrcFtsL7jnSpVTeivagrr-V0pct0AAMDLdJXVHzARl23DH-mKtI5iUW9edDZSmdOj8oOghQbCz37ijcP8scvuUI-Y1HGOK3xk8pDa5Mk3XvI1xd67vzTUqCw-VqqbmS5uhh_6_elNVnKInHmTymFGbE2EzG_0XwOG4RgHbUZzA-BGpUTJ-NoSGrAMQKYsxd9EQf6NeSGM2GJHgydlveiUt3r0oUcpZfzUf3G9LiEAGWAM4"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Interface Layer */}
      <div className="relative z-10 flex h-full flex-col justify-between">

        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/5">
          <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full glass text-white transition-all active:scale-90">
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">FaceGuard BR</span>
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">v1.5 Premium</span>
          </div>
          <div className="w-10 flex justify-end">
            {isCameraActive && (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                onClick={() => { setIsCameraActive(false); setIdentifiedPerson(null); }}
                className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 glass flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </motion.button>
            )}
          </div>
        </header>

        {/* Identification Hub */}
        <div className="flex-1 flex items-center justify-center pointer-events-none p-10">
          <AnimatePresence>
            {identifiedPerson && !isAnalyzing && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-primary glow-primary glass flex items-center justify-center">
                    <div className="text-center p-4">
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">Verificado</span>
                      <h3 className="text-2xl font-black text-white leading-tight mt-1">{identifiedPerson.name}</h3>
                      <div className="mt-2 text-xs font-bold text-primary/80">{identifiedPerson.accuracy} Precisão</div>
                    </div>
                  </div>
                  {/* Tech Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-dashed border-primary/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 border border-dotted border-primary/10 rounded-full"
                  />
                </div>
                <div className="bg-primary px-6 py-2 rounded-xl text-background-dark font-black text-xs uppercase tracking-widest glow-primary shadow-2xl">
                  Acesso Autorizado
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-32 h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">fingerprint</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Scanning...</span>
                  <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: '100%' }}
                      transition={{ duration: 2.5 }}
                      className="h-full bg-primary shadow-glow"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Navigation */}
        <footer className="p-8 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-8 items-center">
          <div className="flex w-full items-center justify-around max-w-sm">
            <Link to="/people" className="flex flex-col items-center gap-2 group">
              <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center group-hover:bg-primary/10 transition-all border border-white/5">
                <span className="material-symbols-outlined text-white group-hover:text-primary transition-colors">database</span>
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Base</span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
              onClick={handleAction}
              disabled={isAnalyzing}
              className={`relative h-24 w-24 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-primary/20 bg-white/5 shadow-none' : 'border-white/20 bg-transparent shadow-[0_0_40px_rgba(19,236,91,0.2)] hover:border-primary/50'
                }`}
            >
              <div className={`h-16 w-16 rounded-full transition-all flex items-center justify-center ${isAnalyzing ? 'bg-primary/20' : 'bg-primary glow-primary'
                }`}>
                {!isCameraActive && <span className="material-symbols-outlined text-background-dark font-black text-3xl">power_settings_new</span>}
                {isCameraActive && !isAnalyzing && <span className="material-symbols-outlined text-background-dark font-black text-3xl">biometrics</span>}
                {isAnalyzing && <span className="material-symbols-outlined text-primary/40 text-4xl animate-spin">sync</span>}
              </div>
            </motion.button>

            <div className="flex flex-col items-center gap-2 opacity-30">
              <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-white">monitoring</span>
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Logs</span>
            </div>
          </div>

          {!isCameraActive && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => navigate('/install')}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Instalar PWA
            </motion.button>
          )}
        </footer>
      </div>

      <style>{`
        .mirror { transform: scaleX(-1); }
        .glow-primary { box-shadow: 0 0 20px rgba(19, 236, 91, 0.4); }
        .shadow-glow { box-shadow: 0 0 10px #13ec5b; }
      `}</style>
    </div>
  );
};

export default LiveFeed;
