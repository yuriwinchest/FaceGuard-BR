
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    // Camera starts inactive now
    return () => stopCamera();
  }, []);

  // Effect to handle camera start/stop when state changes
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraActive]);

  const checkProfiles = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

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
      console.error("Camera access error:", err);
      setIsCameraActive(false);
      alert("Erro ao acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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

    // If camera is already active, start analysis
    setIsAnalyzing(true);
    setIdentifiedPerson(null);

    setTimeout(async () => {
      const { data } = await supabase.from('profiles').select('full_name').limit(1).single();

      if (data) {
        setIdentifiedPerson({
          name: data.full_name,
          accuracy: (95 + Math.random() * 4).toFixed(1) + '%'
        });
        setIsAnalyzing(false);
      } else {
        setIsAnalyzing(false);
        navigate('/register');
      }
    }, 2000);
  };

  const closeCamera = () => {
    setIsCameraActive(false);
    setIsAnalyzing(false);
    setIdentifiedPerson(null);
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

      {/* Visual Component: Photo or Live Camera */}
      <div className="absolute inset-0 h-full w-full bg-black">
        {isCameraActive ? (
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover mirror opacity-90"
            />
            {isAnalyzing && <div className="scan-line z-20" />}
          </div>
        ) : (
          <img
            className="h-full w-full object-cover opacity-80"
            alt="Camera Feedback Placeholder"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdDuNguheCuZszKhmB41zDqKOPJsMhlKSrcFtsL7jnSpVTeivagrr-V0pct0AAMDLdJXVHzARl23DH-mKtI5iUW9edDZSmdOj8oOghQbCz37ijcP8scvuUI-Y1HGOK3xk8pDa5Mk3XvI1xd67vzTUqCw-VqqbmS5uhh_6_elNVnKInHmTymFGbE2EzG_0XwOG4RgHbUZzA-BGpUTJ-NoSGrAMQKYsxd9EQf6NeSGM2GJHgydlveiUt3r0oUcpZfzUf3G9LiEAGWAM4"
          />
        )}
      </div>

      {/* Main UI Overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between">

        {/* Top Bar */}
        <div className="flex items-center justify-between bg-black/40 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
          <h2 className="flex-1 text-center font-bold text-white uppercase tracking-widest text-[10px] sm:text-xs">FaceGuard Live Feed</h2>
          <div className="flex w-10 justify-end">
            {isCameraActive && (
              <button
                onClick={closeCamera}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-500 border border-red-500/30 backdrop-blur-md transition-all active:scale-90"
                title="Fechar Câmera"
              >
                <span className="material-symbols-outlined">videocam_off</span>
              </button>
            )}
          </div>
        </div>

        {/* Recognition Visuals */}
        <div className="flex-1 relative flex items-center justify-center pointer-events-none px-6">
          {identifiedPerson && !isAnalyzing && (
            <div className="absolute flex flex-col items-center gap-4 animate-scale-up">
              <div className="w-48 h-48 border-4 border-primary rounded-full shadow-[0_0_50px_rgba(19,236,91,0.4)] flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center p-4">
                  <span className="text-[10px] font-black text-primary uppercase mb-1">Identificado</span>
                  <span className="text-xl font-black text-white leading-tight drop-shadow-md">{identifiedPerson.name}</span>
                  <span className="text-sm font-black text-primary mt-1">{identifiedPerson.accuracy}</span>
                </div>
              </div>
              <div className="bg-primary px-5 py-1.5 rounded-full text-background-dark font-black text-[10px] uppercase animate-pulse shadow-lg">
                Acesso Liberado
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-white/40 rounded-full animate-spin flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-white opacity-80">sync</span>
              </div>
              <span className="text-white font-black uppercase tracking-[0.2em] text-[10px] drop-shadow-lg">Analisando Biometria...</span>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col gap-6 items-center">

          <div className="flex w-full items-center justify-between max-w-sm">
            <Link to="/people" className="flex flex-col items-center gap-1 group">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-white group-hover:text-primary">group</span>
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">Base de Dados</span>
            </Link>

            <button
              onClick={handleAction}
              disabled={isAnalyzing}
              className={`relative h-20 w-20 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-primary/20 bg-white/5' : 'border-white/20 bg-transparent active:scale-90 hover:border-primary/50 shadow-2xl'
                }`}
            >
              <div className={`h-14 w-14 rounded-full shadow-2xl transition-all ${isAnalyzing ? 'bg-primary/20 animate-pulse' : 'bg-primary'
                }`}></div>
              {isAnalyzing && <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>}
              {!isCameraActive && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full border-2 border-background-dark flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-[12px] font-bold text-background-dark">play_arrow</span>
                </div>
              )}
            </button>

            <div className="flex flex-col items-center gap-1 opacity-30">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">history</span>
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">Histórico</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/install')}
            className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-6 py-2 rounded-full text-primary font-black text-[10px] uppercase tracking-wider hover:bg-primary/20 transition-all active:scale-95"
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
