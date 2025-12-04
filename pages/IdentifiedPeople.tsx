
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        .order('last_seen', { ascending: false });

      if (error) throw error;

      if (data) {
        setPeople(data as any);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-dark text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-background-dark/95 px-4 backdrop-blur-sm">
        <button 
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">Pessoas Identificadas</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {loading ? (
           <div className="flex h-40 items-center justify-center">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary"></div>
           </div>
        ) : people.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center text-center opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
            <p>Nenhuma pessoa identificada ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {people.map((person) => {
              // Use first scan as profile image or a placeholder
              const profileImage = person.face_scans?.[0]?.image_url || null;
              
              return (
                <div 
                    key={person.id} 
                    className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-white/5 p-3 transition-colors hover:bg-white/10 active:bg-white/15"
                >
                  <div className="relative">
                    <div 
                        className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-colors bg-[#1c271f]"
                        style={profileImage ? {backgroundImage: `url("${profileImage}")`} : {}}
                    >
                      {!profileImage && (
                         <div className="flex h-full w-full items-center justify-center">
                            <span className="material-symbols-outlined text-[#9db9a6]">person</span>
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-center gap-0.5">
                    <p className="text-base font-bold leading-none text-white">{person.full_name}</p>
                    <p className="text-sm text-[#9db9a6]">{formatLastSeen(person.last_seen)}</p>
                  </div>
                  
                  <div className="flex h-10 w-10 items-center justify-center text-[#9db9a6] group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-0 left-0 mx-auto w-full max-w-md px-6 pointer-events-none">
        <div className="flex justify-end pointer-events-auto">
            <button 
                onClick={() => navigate('/register')}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-xl shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
            >
            <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default IdentifiedPeople;
