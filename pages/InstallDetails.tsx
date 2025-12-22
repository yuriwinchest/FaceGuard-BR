
import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstallDetails: React.FC = () => {
    const navigate = useNavigate();

    const handleInstallClick = () => {
        // This will be handled by the index.html script which listens for the button click
        const installBtn = document.getElementById('install-button-trigger');
        if (installBtn) {
            installBtn.click();
        } else {
            alert('Se estiver no iOS, use o menu "Compartilhar" > "Adicionar à Tela de Início". No Android, procure o ícone de instalação na barra do navegador.');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-dark text-white">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background-dark/95 p-4 backdrop-blur-sm border-b border-white/5">
                <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-start text-white/90">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold">Instalar FaceGuard</h1>
                <div className="w-10"></div>
            </div>

            <main className="flex flex-col gap-8 p-6 animate-enter">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl overflow-hidden p-4">
                        <img src="/icons/icon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">FaceGuard BR</h2>
                        <p className="text-[#9db9a6] text-sm mt-1">Sua segurança facial em qualquer lugar</p>
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-primary">smartphone</span>
                        <span className="font-bold">Android</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-white/80">phone_iphone</span>
                        <span className="font-bold">iOS / iPhone</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-white/80">tablet_mac</span>
                        <span className="font-bold">Tablet / iPad</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-white/80">laptop_mac</span>
                        <span className="font-bold">Desktop</span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="flex flex-col gap-4 rounded-2xl bg-[#1c271f] p-5 border border-primary/10">
                    <h3 className="flex items-center gap-2 font-bold text-primary">
                        <span className="material-symbols-outlined">info</span>
                        Como instalar:
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm text-[#9db9a6]">
                        <li className="flex gap-2">
                            <span className="font-bold text-white">1.</span>
                            Clique no botão de destaque "BAIXAR APP" abaixo.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-white">2.</span>
                            Confirme a instalação quando o navegador solicitar.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-white">3.</span>
                            O ícone aparecerá instantaneamente na sua tela inicial!
                        </li>
                    </ul>
                </div>

                {/* The Big Install Button */}
                <div className="mt-4">
                    <button
                        onClick={handleInstallClick}
                        className="relative flex w-full h-16 items-center justify-center gap-3 rounded-2xl bg-primary text-background-dark font-black text-xl tracking-tighter shadow-[0_0_30px_rgba(19,236,91,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse"
                    >
                        <span className="material-symbols-outlined text-3xl">download</span>
                        BAIXAR APP AGORA
                    </button>
                    <p className="text-center text-[10px] text-[#9db9a6] mt-4 uppercase tracking-widest font-bold">
                        Versão 1.2.5 • Seguro • Gratuito
                    </p>
                </div>

                {/* Hidden Bridge for PWA Prompt */}
                <button id="install-button-trigger" className="hidden"></button>
            </main>
        </div>
    );
};

export default InstallDetails;
