
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LiveFeed: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileCount, setProfileCount] = useState<number | null>(null);
  const [identifiedPerson, setIdentifiedPerson] = useState<{ name: string, accuracy: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkProfiles();
    startCamera();
    return () => stopCamera();
  }, []);

  const checkProfiles = async () => {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!error) setProfileCount(count);
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
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleAction = async () => {
    if (profileCount === 0) {
      // No one registered yet
      navigate('/register');
    } else {
      // Simulating recognition workflow
      setIsAnalyzing(true);
      setIdentifiedPerson(null);

      // Wait 2 seconds to "find" someone
      setTimeout(async () => {
        // Fetch a random profile to "recognize"
        const { data } = await supabase.from('profiles').select('full_name').limit(1).single();

        if (data) {
          setIdentifiedPerson({
            name: data.full_name,
            accuracy: (95 + Math.random() * 4).toFixed(1) + '%'
          });
          setIsAnalyzing(false);

          // Optionally auto-navigate after recognition
          // setTimeout(() => navigate('/people'), 3000);
        } else {
          setIsAnalyzing(false);
          navigate('/register');
        }
      }, 2000);
    }
  };

  return (
    <div className="relative h-screen w-full bg-background-dark overflow-hidden">
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(19, 236, 91, 0.5);
          box-shadow: 0 0 15px rgba(19, 236, 91, 0.8);
          animation: scan 2s linear infinite;
        }
        .mirror { transform: scaleX(-1); }
      `}</style>

      {/* Camera Feed */}
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover mirror opacity-80"
        />
        {isAnalyzing && <div className="scan-line z-20" />}
      </div>

      {/* Main UI Overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between">

        {/* Top Bar */}
        <div className="flex items-center justify-between bg-black/40 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
          <h2 className="flex-1 text-center font-bold text-white uppercase tracking-widest text-sm">FaceGuard Live Feed</h2>
          <div className="w-10"></div>
        </div>

        {/* Recognition Visuals */}
        <div className="flex-1 relative flex items-center justify-center pointer-events-none">
          {identifiedPerson && !isAnalyzing && (
            <div className="absolute animate-scale-up flex flex-col items-center gap-4">
              <div className="w-48 h-48 border-4 border-primary rounded-full shadow-[0_0_50px_rgba(19,236,91,0.4)] flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center p-4">
                  <span className="text-xs font-bold text-primary uppercase mb-1">Identificado</span>
                  <span className="text-xl font-black text-white leading-tight">{identifiedPerson.name}</span>
                  <span className="text-sm font-bold text-primary mt-1">{identifiedPerson.accuracy}</span>
                </div>
              </div>
              <div className="bg-primary px-4 py-1 rounded-full text-background-dark font-black text-xs uppercase animate-pulse">
                Acesso Liberado
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-white/50 rounded-full animate-spin flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-white">sync</span>
              </div>
              <span className="text-white font-bold uppercase tracking-widest text-xs">Analisando Biometria...</span>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col gap-6 items-center">

          <div className="flex w-full items-center justify-between max-w-sm">
            <Link to="/people" className="flex flex-col items-center gap-1 group">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-white group-hover:text-primary">group</span>
              </div>
              <span className="text-[10px] font-bold text-white/60 uppercase">Base de Dados</span>
            </Link>

            <button
              onClick={handleAction}
              disabled={isAnalyzing}
              className={`relative h-20 w-20 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-primary/20 bg-white/5' : 'border-white/30 bg-transparent active:scale-90 hover:border-primary'
                }`}
            >
              <div className={`h-14 w-14 rounded-full shadow-2xl transition-all ${isAnalyzing ? 'bg-primary/20 animate-pulse' : 'bg-primary'
                }`}></div>
              {isAnalyzing && <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>}
            </button>

            <div className="flex flex-col items-center gap-1 opacity-40">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">history</span>
              </div>
              <span className="text-[10px] font-bold text-white/60 uppercase">Histórico</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/install')}
            className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-6 py-2 rounded-full text-primary font-bold text-xs uppercase tracking-tighter hover:bg-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Instalar App
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
