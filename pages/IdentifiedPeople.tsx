
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

interface Person {
  id: string;
  full_name: string;
  last_seen: string;
  face_scans: { image_url: string }[];
}

const IdentifiedPeople: React.FC = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          last_seen,
          face_scans (
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      if (data) setPeople(data as any);
    } catch (error) {
      toast.error("Erro ao carregar banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const Skeleton = () => (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-3xl glass opacity-40">
          <div className="w-14 h-14 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 skeleton" />
            <div className="h-3 w-1/3 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-white overflow-hidden pb-10">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between glass px-6">
        <button onClick={() => navigate('/')} className="h-10 w-10 glass rounded-full flex items-center justify-center transition-all active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h1 className="text-xs font-black uppercase tracking-[0.2em]">Bio-Database</h1>
          <p className="text-[10px] text-primary font-bold uppercase">{people.length} Perfis Ativos</p>
        </div>
        <button className="h-10 w-10 glass rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Skeleton />
            </motion.div>
          ) : people.length === 0 ? (
            <motion.div
              key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mt-20 flex flex-col items-center justify-center text-center gap-4 opacity-40"
            >
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">folder_off</span>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">Base de Dados Vazia</p>
            </motion.div>
          ) : (
            <motion.div
              key="list" initial="hidden" animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="flex flex-col gap-4 pb-24"
            >
              {people.map((person) => (
                <motion.div
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                  key={person.id}
                  className="group flex items-center gap-4 rounded-[2rem] glass p-4 transition-all hover:bg-white/5 relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="relative">
                    <div
                      className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center border border-white/10 group-hover:border-primary transition-all glow-primary shadow-2xl relative z-10"
                      style={person.face_scans?.[0] ? { backgroundImage: `url("${person.face_scans[0].image_url}")` } : {}}
                    >
                      {!person.face_scans?.[0] && (
                        <div className="flex h-full w-full items-center justify-center bg-surface-dark">
                          <span className="material-symbols-outlined text-white/20 text-3xl">person</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-base font-black text-white group-hover:text-primary transition-colors">{person.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">visto em: {formatLastSeen(person.last_seen)}</p>
                    </div>
                  </div>

                  <div className="text-white/20 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 right-8 z-30">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/register')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-background-dark shadow-2xl glow-primary transition-all"
        >
          <span className="material-symbols-outlined text-3xl font-black">add</span>
        </motion.button>
      </div>

      <style>{`
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
};

export default IdentifiedPeople;
