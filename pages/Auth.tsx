
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Bem-vindo de volta!");
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
        <div className="min-h-screen w-full bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm glass p-8 rounded-[2.5rem] border border-white/5 relative z-10"
            >
                <div className="flex flex-col items-center gap-6 mb-8 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary glow-primary glass mb-2">
                        <span className="material-symbols-outlined text-4xl">shield_person</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">FaceGuard BR</h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Ambiente Seguro & Privado</p>
                    </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@exemplo.com"
                            className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-14 glass rounded-2xl px-6 font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary text-background-dark font-black rounded-2xl shadow-xl uppercase tracking-widest transition-all glow-primary mt-4"
                    >
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça Login"}
                    </button>
                </div>
            </motion.div>

            <style>{`
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .glow-primary { box-shadow: 0 0 30px rgba(19, 236, 91, 0.2); }
      `}</style>
        </div>
    );
};

export default Auth;
