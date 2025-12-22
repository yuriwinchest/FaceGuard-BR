
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

type Step = 'start' | 'front' | 'left' | 'right' | 'details' | 'success';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('start');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scans, setScans] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Erro ao acessar a câmera. Verifique as permissões.");
      setStep('start');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setScans(prev => [...prev, dataUrl]);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `scan_${scans.length}.jpg`, { type: 'image/jpeg' });
            setFiles(prev => [...prev, file]);
          }
        }, 'image/jpeg', 0.9);

        // Transition logic
        if (step === 'front') setStep('left');
        else if (step === 'left') setStep('right');
        else if (step === 'right') {
          setStep('details');
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
        toast.info("Captura realizada!", { duration: 1000 });
      }
    }
  };

  const uploadImages = async (profileId: string) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${profileId}/${Date.now()}_${index}.jpg`;
      const { data, error: uploadError } = await supabase.storage.from('scans').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('scans').getPublicUrl(fileName);
      await supabase.from('face_scans').insert([{ profile_id: profileId, image_url: publicUrl }]);
    });
    await Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.includes('@')) {
      toast.warning("Por favor, preencha nome e e-mail corretamente.");
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase.from('profiles').insert([{ full_name: name, email: email }]).select().single();
      if (error) throw error;
      if (data) {
        await uploadImages(data.id);
        setShowSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#13ec5b', '#ffffff', '#102216']
        });
        toast.success("Perfil criado com sucesso!");
        setTimeout(() => navigate('/people'), 3000);
      }
    } catch (err) {
      toast.error("Erro ao finalizar cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      <header className="shrink-0 flex items-center justify-between p-4 glass z-10">
        <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <span className="text-sm font-black uppercase tracking-widest text-primary">Biometria Facial</span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 relative flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div
              key="start" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center p-8 text-center gap-8"
            >
              <div className="h-24 w-24 rounded-3xl glow-primary glass flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">face_6</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black leading-tight uppercase tracking-tighter">Iniciando Biometria</h2>
                <p className="text-sm text-white/50 leading-relaxed max-w-[280px] mx-auto">Proteja sua conta com um scan facial 3D. Precisamos de 3 ângulos para precisão máxima.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setStep('front'); startCamera(); }}
                className="w-full h-16 bg-primary text-background-dark font-black rounded-2xl shadow-2xl uppercase tracking-widest transition-all glow-primary"
              >
                Ativar Escaneamento
              </motion.button>
            </motion.div>
          )}

          {(step === 'front' || step === 'left' || step === 'right') && (
            <motion.div
              key="camera-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8 p-4 h-full pt-10"
            >
              <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ borderColor: ['rgba(19,236,91,0.2)', 'rgba(19,236,91,0.6)', 'rgba(19,236,91,0.2)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2/3 aspect-[4/5] border-[3px] rounded-[3rem] shadow-[0_0_0_9999px_rgba(16,34,22,0.6)]"
                  />
                </div>
                <div className="absolute top-6 left-0 right-0 text-center">
                  <div className="inline-block px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {step === 'front' ? 'Olhe de Frente' : step === 'left' ? 'Vire à Esquerda' : 'Vire à Direita'}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-black uppercase tracking-widest">
                  {step === 'front' ? 'Mantenha-se centralizado' : step === 'left' ? 'Mostre seu perfil esquerdo' : 'Mostre seu perfil direito'}
                </h3>
                <div className="flex gap-2 justify-center">
                  {['front', 'left', 'right'].map((s, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${step === s ? 'bg-primary w-12 glow-primary' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capturePhoto}
                className="h-20 w-20 rounded-full border-4 border-white/20 p-1.5 transition-all hover:border-primary"
              >
                <div className="h-full w-full rounded-full bg-white transition-all active:bg-primary shadow-xl" />
              </motion.button>
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8 p-6 overflow-y-auto pt-10"
            >
              <div className="flex justify-center gap-3">
                {scans.map((url, i) => (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                    key={i} className="w-16 h-16 rounded-2xl glass overflow-hidden border border-primary/20 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${url})` }}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Identificação do Perfil"
                      className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">E-mail Seguro</label>
                    <input
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="seu@exemplo.com"
                      className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading || !name || !email}
                  className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl ${isLoading || !name || !email ? 'bg-white/5 text-white/20' : 'bg-primary text-background-dark glow-primary'
                    }`}
                >
                  {isLoading ? 'Sincronizando...' : 'Ativar Proteção Facial'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 p-10 rounded-[3rem] glass border border-primary/30 shadow-[0_0_100px_rgba(19,236,91,0.2)] text-center"
          >
            <div className="h-20 w-20 rounded-full bg-primary/10 text-primary glow-primary glass flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl">task_alt</span>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Bio-Segurança Ativa</h3>
              <p className="text-white/50 text-xs mt-2 uppercase tracking-widest">Acesso liberado para seu perfil</p>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .mirror { transform: scaleX(-1); }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
};

export default Registration;
