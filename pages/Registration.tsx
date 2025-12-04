
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scans, setScans] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic validation: name must not be empty, email must contain '@' and '.'
  const isFormValid = name.trim().length > 0 && email.includes('@') && email.includes('.');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setScans([...scans, imageUrl]);
    }
    // Reset input so same file can be selected again if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

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
          <div className="relative cursor-pointer" onClick={triggerFileInput}>
            <div className={`flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[#3b5443] bg-[#1c271f] overflow-hidden ${scans.length > 0 ? 'border-primary border-solid' : ''}`}>
              {scans.length > 0 ? (
                <img src={scans[0]} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-[#9db9a6]">sentiment_satisfied</span>
              )}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-base font-medium text-white">Endereço de E-mail</span>
            <input
              className="h-14 w-full rounded-xl border border-[#3b5443] bg-[#1c271f] px-4 text-base text-white placeholder-[#9db9a6] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Digite seu e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        {/* Facial Data Section */}
        <div className="mt-8">
            <h3 className="text-lg font-bold text-white">Seus Dados Faciais</h3>
            <p className="mt-1 text-sm text-[#9db9a6]">
            Adicione alguns scans para melhor reconhecimento em diferentes condições.
            </p>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {/* Dynamic Scans List */}
                {scans.map((scanUrl, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 animate-enter">
                        <div 
                            className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center border border-[#3b5443]"
                            style={{backgroundImage: `url("${scanUrl}")`}}
                        ></div>
                        <span className="text-xs font-medium text-white">Scan {index + 1}</span>
                    </div>
                ))}

                {/* Add Button */}
                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={triggerFileInput}
                        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#3b5443] text-[#9db9a6] transition-colors hover:border-primary hover:text-primary active:bg-[#1c271f]"
                    >
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
            onClick={() => isFormValid && navigate('/people')}
            disabled={!isFormValid}
            className={`flex h-14 w-full items-center justify-center rounded-xl text-base font-bold text-background-dark shadow-lg transition-all ${
              isFormValid 
                ? 'bg-primary active:scale-[0.98] cursor-pointer' 
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
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
