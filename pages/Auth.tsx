import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => stopCamera();
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
            setIsCameraActive(true);
        } catch (err) {
            toast.error("Erro ao abrir câmera", { description: "Verifique as permissões do navegador." });
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsCameraActive(false);
    };

    const handleInitialScan = () => {
        if (!isCameraActive) {
            startCamera();
            return;
        }

        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            stopCamera();
            toast.warning("Biometria não reconhecida", { description: "Por favor, identifique-se manualmente." });
            setShowForm(true);
        }, 2500);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Acesso Autorizado");
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success("Cadastro realizado com sucesso!");
            }
            navigate('/');
        } catch (err: any) {
            toast.error(err.message || "Erro na autenticação");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden font-display">
            {/* Camera Layer (Shows over global background) */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    {isCameraActive && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full"
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="h-full w-full object-cover mirror opacity-80"
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
                    )}
                </AnimatePresence>
            </div>

            {/* Main UI Overlay */}
            <AnimatePresence>
                {!showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 h-full flex flex-col items-center justify-between p-12"
                    >
                        {/* Logo positioned to the side as requested */}
                        <div className="w-full flex justify-end">
                            <div className="text-right">
                                <motion.div
                                    animate={isAnalyzing ? { scale: [1, 1.1, 1] } : {}}
                                    className="h-10 w-10 rounded-xl bg-primary/10 glass flex items-center justify-center text-primary glow-primary mb-2 ml-auto"
                                >
                                    <span className="material-symbols-outlined text-xl">shield_person</span>
                                </motion.div>
                                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">FaceGuard<br /><span className="text-primary italic">BR</span></h1>
                                <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">Biometria Inteligente</p>
                            </div>
                        </div>


                        {/* High-Tech Biometric Shutter */}
                        <div className="w-full flex flex-col items-center gap-8 mb-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                                onClick={handleInitialScan}
                                disabled={isAnalyzing}
                                className={`relative h-24 w-24 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-primary/20 bg-white/5 shadow-none' :
                                    'border-white/20 bg-transparent shadow-[0_0_40px_rgba(19,236,91,0.2)] hover:border-primary/50'
                                    }`}
                            >
                                <div className={`h-16 w-16 rounded-full transition-all flex items-center justify-center ${isAnalyzing ? 'bg-primary/20' : 'bg-primary glow-primary'
                                    }`}>
                                    {isAnalyzing ? (
                                        <span className="material-symbols-outlined text-primary/40 text-4xl animate-spin">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-background-dark font-black text-3xl">
                                            {isCameraActive ? 'biometrics' : 'power_settings_new'}
                                        </span>
                                    )}
                                </div>

                                {/* Rotating Ring during analysis */}
                                {isAnalyzing && (
                                    <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                )}
                            </motion.button>

                            <div className="flex flex-col items-center gap-2 text-center">
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em]">
                                    {isAnalyzing ? 'Identificando...' : (isCameraActive ? 'Posicione o Rosto' : 'Toque para Iniciar')}
                                </p>
                                <p className="text-[8px] text-primary font-bold uppercase tracking-[0.2em] opacity-40">Security Layer v1.5</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Form Slide-up */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 z-50 flex items-end"
                    >
                        <div className="w-full glass-auth rounded-t-[3rem] p-10 pb-12 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identificação</h2>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                                    Acesso reservado a usuários cadastrados
                                </p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-MAIL"
                                    className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 text-sm tracking-widest"
                                />
                                <input
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="SENHA"
                                    className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 text-sm tracking-widest"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading}
                                    className="w-full h-16 bg-primary text-background-dark font-black rounded-2xl shadow-xl uppercase tracking-widest transition-all glow-primary mt-4"
                                >
                                    {loading ? 'Acessando...' : (isLogin ? 'Entrar' : 'Registrar')}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center flex items-center justify-between">
                                <button onClick={() => setIsLogin(!isLogin)} className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                    {isLogin ? "Criar conta" : "Voltar ao login"}
                                </button>
                                <button onClick={() => { setShowForm(false); setIsCameraActive(false); }} className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                                    Tentar Scan Novamente
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .mirror { transform: scaleX(-1); }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .glass-auth { background: rgba(13, 18, 14, 0.98); backdrop-filter: blur(40px); }
        .glow-primary { box-shadow: 0 0 30px rgba(19, 236, 91, 0.3); }
      `}</style>
        </div >
    );
};

export default Auth;
