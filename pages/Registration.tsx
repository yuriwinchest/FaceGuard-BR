
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Stop camera when component unmounts
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Erro ao acessar a câmera. Verifique as permissões.");
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

        // Convert to File object for Supabase
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `scan_${scans.length}.jpg`, { type: 'image/jpeg' });
            setFiles(prev => [...prev, file]);
          }
        }, 'image/jpeg', 0.9);

        // Move to next step
        if (step === 'front') setStep('left');
        else if (step === 'left') setStep('right');
        else if (step === 'right') {
          setStep('details');
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
      }
    }
  };

  const uploadImages = async (profileId: string) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/${Date.now()}_${index}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('scans')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('scans')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('face_scans')
        .insert([{ profile_id: profileId, image_url: publicUrl }]);

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.includes('@')) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ full_name: name, email: email }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        await uploadImages(data.id);
        setShowSuccess(true);
        setTimeout(() => navigate('/people'), 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Erro ao registrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'start':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-6 animate-enter">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-5xl">person_add</span>
            </div>
            <h2 className="text-2xl font-bold">Você precisa se cadastrar</h2>
            <p className="text-[#9db9a6]">Para utilizar o reconhecimento seguro, precisamos de fotos do seu rosto de diferentes ângulos.</p>
            <button
              onClick={() => { setStep('front'); startCamera(); }}
              className="w-full h-14 bg-primary text-background-dark font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              Começar Agora
            </button>
          </div>
        );

      case 'front':
      case 'left':
      case 'right':
        return (
          <div className="flex flex-col items-center gap-6 p-4 animate-enter h-full">
            <div className="relative w-full aspect-[3/4] max-h-[60vh] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              {/* Face Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 aspect-[4/5] border-2 border-white/50 rounded-[40%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
              </div>
              <div className="absolute top-4 left-4 right-4 text-center">
                <span className="bg-primary/90 text-background-dark px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  {step === 'front' ? 'Foto de Frente' : step === 'left' ? 'Lado Esquerdo' : 'Lado Direito'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-bold">
                {step === 'front' ? 'Olhe diretamente para a câmera' :
                  step === 'left' ? 'Vire seu rosto levemente para a esquerda' :
                    'Vire seu rosto levemente para a direita'}
              </p>
              <p className="text-sm text-[#9db9a6]">Toque no botão abaixo para capturar</p>
            </div>
            <button
              onClick={capturePhoto}
              className="h-20 w-20 rounded-full border-4 border-white/30 p-1 bg-transparent active:scale-95 transition-transform"
            >
              <div className="h-full w-full rounded-full bg-primary shadow-[0_0_20px_rgba(19,236,91,0.5)]"></div>
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        );

      case 'details':
        return (
          <div className="flex flex-col gap-6 p-4 animate-enter scrollbar-hide overflow-y-auto">
            <div className="flex justify-center gap-3">
              {scans.map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-primary/20 bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#9db9a6] uppercase">Nome Completo</span>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-14 bg-[#1c271f] border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none transition-colors"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#9db9a6] uppercase">E-mail</span>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-14 bg-[#1c271f] border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none transition-colors"
                />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !name || !email}
              className={`h-14 rounded-xl font-bold shadow-lg transition-all ${isLoading || !name || !email ? 'bg-white/10 text-white/30' : 'bg-primary text-background-dark active:scale-95'
                }`}
            >
              {isLoading ? 'Salvando...' : 'Finalizar Registro'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">Registro de Perfil</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        {renderCurrentStep()}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-enter">
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#1c271f] border border-primary/30 shadow-2xl">
            <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <h3 className="text-xl font-bold">Cadastro Realizado!</h3>
            <p className="text-[#9db9a6] text-center">Sua biometria facial agora<br />está ativa e segura.</p>
          </div>
        </div>
      )}

      <style>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
};

export default Registration;
