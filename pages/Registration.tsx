
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      {/* Top App Bar */}
      <div className="shrink-0 flex items-center justify-between bg-background-dark/80 p-4 backdrop-blur-sm z-10 border-b border-white/5">
        <button 
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight text-white">
          Criar Seu Perfil
        </h2>
        <div className="h-10 w-10"></div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-40 scrollbar-hide">
        {/* Profile Header */}
        <div className="flex w-full flex-col items-center gap-4 py-8">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[#3b5443] bg-[#1c271f]">
              <span className="material-symbols-outlined text-5xl text-[#9db9a6]">sentiment_satisfied</span>
            </div>
            <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background-dark bg-primary text-background-dark shadow-md transition-transform hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined">add_a_photo</span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-[22px] font-bold leading-tight text-white">Adicionar Rosto</p>
            <p className="text-sm font-normal text-[#9db9a6] mt-1">
              Isso será usado para reconhecimento seguro.
            </p>
          </div>
        </div>

        {/* Text Fields Section */}
        <div className="flex w-full flex-col gap-5 py-2">
          <label className="flex flex-col gap-2">
            <span className="text-base font-medium text-white">Nome Completo</span>
            <input
              className="h-14 w-full rounded-xl border border-[#3b5443] bg-[#1c271f] px-4 text-base text-white placeholder-[#9db9a6] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Digite seu nome completo"
              type="text"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-base font-medium text-white">Endereço de E-mail</span>
            <input
              className="h-14 w-full rounded-xl border border-[#3b5443] bg-[#1c271f] px-4 text-base text-white placeholder-[#9db9a6] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Digite seu e-mail"
              type="email"
            />
          </label>
        </div>

        {/* Facial Data Section */}
        <div className="mt-8">
            <h3 className="text-lg font-bold text-white">Seus Dados Faciais</h3>
            <p className="mt-1 text-sm text-[#9db9a6]">
            Adicione alguns scans para melhor reconhecimento em diferentes condições.
            </p>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {/* Scan 1 */}
                <div className="flex flex-col items-center gap-2">
                    <div 
                        className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center border border-[#3b5443]"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlj2GpOUAMPUlUmCDrAQnul8zPBRG85fzgODl2avJgXHKu904-Z1SmDvzKeEB3x3brVoN3HZlexBK-XJoddQqjXNJnI27JkkZXOCp0tuwHotE6foyLAQqMy702qwZl4vbiupkPBhBzDfVgT4GSNehfB1iZ_pi6hq4f4WHueUOGNkn9tKn0MZ5YmrHB6u4nSM36uoIG3QMNGhC-KBIjRRRtHGPg1w_XkDU0sUQTLtaGa76oUMJtGsAsDln5yEyUGL5vT15FafZpKrQ0")'}}
                    ></div>
                    <span className="text-xs font-medium text-white">Frente</span>
                </div>

                {/* Scan 2 */}
                <div className="flex flex-col items-center gap-2">
                    <div 
                        className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center border border-[#3b5443]"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAaF5A38mRlW3qC-o7ekLZ4_Dngl5y09oALjn4TbK2UW42tqJCdRuSa5wN4qCIHuxo6m9xZ8a2UPUgZJOFbUGOxtuK6UH6OByiI5lez3qNxNVnQvXtccOP89_Aw4WyXQl-Y0RD_4NfB_5orXsrIm4-5R_h_Pbp1ejeszFCqKy6cWvZZ2FwvbM5NX9MC87Q2zLzNRavIXSz8A6B8HtciG2euXyJ6LEXxXq-ghQ99J7RlT4rCawCo53E_stHOukAtqwyXcaeG7j0zEDbg")'}}
                    ></div>
                    <span className="text-xs font-medium text-white">Perfil</span>
                </div>

                {/* Add Button */}
                <div className="flex flex-col items-center gap-2">
                    <button className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#3b5443] text-[#9db9a6] transition-colors hover:border-primary hover:text-primary active:bg-[#1c271f]">
                        <span className="material-symbols-outlined text-3xl">add_circle</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Adicionar</span>
                    </button>
                    <span className="text-xs font-medium text-transparent">Placeholder</span>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-background-dark/95 p-4 backdrop-blur-md w-full">
        <button 
            onClick={() => navigate('/people')}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-background-dark shadow-lg transition-transform active:scale-[0.98]"
        >
          Escanear Rosto & Registrar
        </button>
        <p className="pt-3 text-center text-xs text-[#9db9a6]">
          Ao registrar, você concorda com nossos <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default Registration;
