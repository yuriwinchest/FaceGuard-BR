
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    last_seen: string;
    created_at: string;
    user_id: string;
    face_scans: { image_url: string }[];
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [verifyingAccess, setVerifyingAccess] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            const email = user?.email?.toLowerCase().trim();
            setCurrentUserEmail(email || 'Não Logado');

            // Hardcode emails with maximum robustness
            const adminEmails = [
                'yuriwinchest@gmail.com',
                'yuriallmeida@gmail.com',
                'yuriv@example.com'
            ];

            const isUserAdmin = adminEmails.some(ae => ae === email) ||
                email?.includes('admin');

            if (isUserAdmin) {
                setIsAdmin(true);
                fetchGlobalData();
            } else {
                toast.error("Permissão Negada", { description: "Usuário não autorizado." });
            }
        } catch (err) {
            console.error("Auth check failed", err);
        } finally {
            setVerifyingAccess(false);
        }
    };

    const fetchGlobalData = async () => {
        try {
            // Fetching all profiles and their scans
            const { data, error } = await supabase
                .from('profiles')
                .select('*, face_scans(image_url)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data as any);
        } catch (err: any) {
            console.error("Admin fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (verifyingAccess) return (
        <div className="h-screen w-full bg-transparent flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Verificando Credenciais</span>
        </div>
    );

    if (!isAdmin) return (
        <div className="h-screen w-full bg-transparent flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">lock_person</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Acesso Restrito</h2>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-1">
                Área disponível apenas para administradores.
            </p>
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-8">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Logado como:</p>
                <p className="text-xs font-black text-primary lowercase">{currentUserEmail}</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <button
                    onClick={() => navigate('/')}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                    Voltar ao Início
                </button>
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        navigate('/auth');
                    }}
                    className="w-full h-14 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all"
                >
                    Trocar de Conta
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-transparent text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Painel Admin</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gestão de Identidade & Biometria</p>
                </div>
                <button onClick={() => navigate('/')} className="h-12 w-12 glass rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined">home</span>
                </button>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass p-5 rounded-3xl border border-primary/10">
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Total de Perfis</span>
                    <div className="text-2xl font-black mt-1">{profiles?.length || 0}</div>
                </div>
                <div className="glass p-5 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Estado</span>
                    <div className="text-2xl font-black mt-1 text-primary">Sincronizado</div>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] opacity-60 ml-2">Usuários & Registros</h2>

                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 w-full skeleton rounded-[2rem]" />)}
                            </div>
                        ) : profiles.map((p) => (
                            <motion.div
                                layout
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-5 rounded-[2rem] border border-white/5 flex flex-col gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-dark overflow-hidden border border-white/10 shadow-xl">
                                        {p.face_scans?.[0] ? (
                                            <img src={p.face_scans[0].image_url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <span className="material-symbols-outlined">person</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-white uppercase tracking-tighter">{p.full_name}</h3>
                                        <p className="text-[10px] text-white/40 font-bold">{p.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Registrado em</span>
                                        <p className="text-[10px] text-white/40">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {p.face_scans?.map((s, idx) => (
                                        <img
                                            key={idx}
                                            src={s.image_url}
                                            className="w-16 h-16 rounded-xl object-cover border border-white/5 grayscale hover:grayscale-0 transition-all cursor-pointer"
                                            alt="Scan"
                                        />
                                    ))}
                                    {(!p.face_scans || p.face_scans.length === 0) && (
                                        <div className="text-[10px] text-white/20 uppercase font-black px-2 mt-2">Sem fotos registradas</div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">ID: {p.id.slice(0, 8)}...</span>
                                    </div>
                                    <button className="text-[10px] font-black text-red-400/60 uppercase hover:text-red-400 transition-colors">Remover Acesso</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            <style>{`
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .skeleton { background: linear-gradient(90deg, #1c271f 25%, #2a3a2e 50%, #1c271f 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
        </div>
    );
};

export default Admin;
