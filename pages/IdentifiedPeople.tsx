import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Person {
  id: number;
  name: string;
  lastSeen: string;
  image: string;
}

const people: Person[] = [
  {
    id: 1,
    name: "Jane Doe",
    lastSeen: "Visto por último: há 2 horas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMcVW6fM4ku8PTGxoYczmTS3VPw5Eo0IYQMyEArhgqAQ1V9GzjCbV0hJKi4YU0aI1_JFL6tf7PGxZSOgk5y_JXTwXi6mLT9moONURz7cufIrVqHYlJsY5ON0fO8uxd-MJyLnEjm6d-oJPyFfe_nUxQhAAPdDEDqI60EYyvO-D13jUb-T2UnQM1iMJ4VOtN0j_IH02qFOg1BNQ_jL7iQ68y_LJl5QObF1iVfmT3I4egyXpyUUYFxK-gvRaij0nWt_a8O1L2h1OLidj4"
  },
  {
    id: 2,
    name: "John Smith",
    lastSeen: "Visto por último: Hoje, 10:45",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0xFmtyXGgCABpCEcV0iThwDEzNx3gBQM0FjdvtN0QuY_VTXFIUpcjd4NZCY4m4nRRSZWWXqYH_jTQBZ7JB2J0138AW89QqKYJUbqvC48ypH4zgUpR_B2Pml0emALy2QctI167YXJ-qOwVYXZQXxetrf_Sd_Q3slPkfXgUNOBUyw0i4lNWONyPa3w1dWxXKCy1-E-0yc5URgbrmJLLs4phWP__m-ugfxpnInupfZNG15KCOqgsnELgG0wybaqdur7h-IK2BCVUhqQ"
  },
  {
    id: 3,
    name: "Alex Ray",
    lastSeen: "Visto por último: Ontem",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ4nUZtRBwMVTSeCVXeJCHcH6HQzyDFiyXoexHD-IGM2JiRot99SthoOOFJprJwV-cbKwwp8po6BdF9EGfPuhaQwsSrq5HndavrU6gQ7EvAw8gWjCliZYC5-N4sHPTQ-w-e_a0UMto7O2M3p3ftN5HOWEOdIjEJsQcVgrGXpDUh3g9zDfAeTyheceE7ivRfLqQDbRHtxAo6-4qh1ua506MG6SD8pqkLPwp7BgbLRJCxm3BRXTEeY1nLVRvDhciU8Ilebz7GeHwk89m"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    lastSeen: "Visto por último: há 5 dias",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3IpiccPa9G36HDaurm-9_8YFV1CFlaWk7ZxfabInTT93oZUaFzVufowj33x-5yBfUFiweJZUCFufXMCqC3-s2eJM3FwlgRFLPmy2ZnJvti9H3CUHgWgXHwWZbRm5N2ZEYWJOEDXUsN0i0RlY2M05GTQ5M3bk7R5AGdsMmuYWZe0nbExzYR2YgWhql2DArPqE6uCbepaeFfbMSfkPBCE-T1wjlBbTPnabkb94I81gi-wtMNAxWgp1CJ5ctCUVttMmIUkP3SUC-ceyk"
  }
];

const IdentifiedPeople: React.FC = () => {
  const navigate = useNavigate();

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
        <div className="flex flex-col gap-3">
          {people.map((person) => (
            <div 
                key={person.id} 
                className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-white/5 p-3 transition-colors hover:bg-white/10 active:bg-white/15"
            >
              <div className="relative">
                <div 
                    className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-colors"
                    style={{backgroundImage: `url("${person.image}")`}}
                ></div>
              </div>
              
              <div className="flex flex-1 flex-col justify-center gap-0.5">
                <p className="text-base font-bold leading-none text-white">{person.name}</p>
                <p className="text-sm text-[#9db9a6]">{person.lastSeen}</p>
              </div>
              
              <div className="flex h-10 w-10 items-center justify-center text-[#9db9a6] group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
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