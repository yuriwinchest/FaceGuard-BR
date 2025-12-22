import React, { useState } from 'react';
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
                toast.success("Conta criada! Verifique seu e-mail.");
            }
            navigate('/');
        } catch (err: any) {
            toast.error(err.message || "Erro na autenticação");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden font-display">
            {/* Background Image - The high-tech woman intro image */}
            <div className="absolute inset-0">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdDuNguheCuZszKhmB41zDqKOPJsMhlKSrcFtsL7jnSpVTeivagrr-V0pct0AAMDLdJXVHzARl23DH-mKtI5iUW9edDZSmdOj8oOghQbCz37ijcP8scvuUI-Y1HGOK3xk8pDa5Mk3XvI1xd67vzTUqCw-VqqbmS5uhh_6_elNVnKInHmTymFGbE2EzG_0XwOG4RgHbUZzA-BGpUTJ-NoSGrAMQKYsxd9EQf6NeSGM2GJHgydlveiUt3r0oUcpZfzUf3G9LiEAGWAM4"
                    className="h-full w-full object-cover opacity-60"
                    alt="Face Recognition Intro"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>

            {/* Intro Branding Overlay */}
            <AnimatePresence>
                {!showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 h-full flex flex-col items-center justify-between p-12 text-center"
                    >
                        <div className="mt-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="h-20 w-20 rounded-3xl bg-primary/10 glass flex items-center justify-center text-primary glow-primary mb-6 mx-auto"
                            >
                                <span className="material-symbols-outlined text-5xl">shield_person</span>
                            </motion.div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">FaceGuard<br /><span className="text-primary italic">BR</span></h1>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold mt-4">Sistema de Biometria Inteligente</p>
                        </div>

                        <div className="w-full max-w-xs space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowForm(true)}
                                className="w-full h-16 bg-primary text-background-dark font-black rounded-2xl shadow-2xl uppercase tracking-widest transition-all glow-primary flex items-center justify-center gap-3"
                            >
                                <span>Iniciar Sistema</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </motion.button>
                            <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">v1.5 Premium Edition</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Form Overlay */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute inset-0 z-20 flex items-end"
                    >
                        <div className="w-full glass-auth rounded-t-[3rem] p-10 pb-14 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {isLogin ? 'Bem-vindo' : 'Cadastro'}
                                </h2>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                                    {isLogin ? 'Entre para acessar sua base' : 'Crie sua conta privada'}
                                </p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="space-y-1.5">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="E-MAIL"
                                        className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 text-sm tracking-widest"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="SENHA"
                                        className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 text-sm tracking-widest"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 bg-primary text-background-dark font-black rounded-2xl shadow-xl uppercase tracking-widest transition-all glow-primary mt-4"
                                >
                                    {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Registrar')}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center flex items-center justify-between">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                                >
                                    {isLogin ? "Criar nova conta" : "Já sou cadastrado"}
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
    .glass { background: rgba(255, 255, 255, 0.05); backdrop - filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .glass - auth { background: rgba(13, 18, 14, 0.95); backdrop - filter: blur(30px); }
        .glow - primary { box - shadow: 0 0 30px rgba(19, 236, 91, 0.3); }
`}</style>
        </div>
    );
};

export default Auth;
