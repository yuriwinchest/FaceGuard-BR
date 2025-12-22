import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-dark text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-dark/95 p-4 backdrop-blur-sm border-b border-white/5">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-start text-white/90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Configurações</h1>
        <div className="flex w-10 items-center justify-end">
          <button onClick={() => navigate('/')} className="text-base font-bold text-primary">Pronto</button>
        </div>
      </div>

      <main className="flex flex-col gap-8 pb-12 pt-4">

        {/* FACIAL RECOGNITION */}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Reconhecimento Facial</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">

            {/* Sensitivity Slider */}
            <div className="border-b border-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-white">Sensibilidade de Detecção</span>
                <span className="text-sm text-primary">Média</span>
              </div>
              <div className="relative flex h-6 w-full items-center">
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div className="h-full w-1/2 rounded-full bg-primary"></div>
                </div>
                <div className="absolute left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-primary shadow-md"></div>
              </div>
            </div>

            {/* Real-time Overlay Toggle */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">visibility</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Sobreposição em Tempo Real</span>
                  <span className="text-xs text-white/50">Mostrar dados na câmera</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-7 w-12 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            {/* Manage Models Link */}
            <Link to="/settings/models" className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">model_training</span>
                </div>
                <span className="font-medium">Gerenciar Modelos</span>
              </div>
              <span className="material-symbols-outlined text-white/40">chevron_right</span>
            </Link>

          </div>
        </section>

        {/* PRIVACY & DATA */}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Privacidade e Dados</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">

            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">memory</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Processamento Local</span>
                  <span className="text-xs text-white/50">Manter dados no dispositivo</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-7 w-12 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <button className="flex w-full items-center justify-between border-b border-white/5 p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">delete</span>
                </div>
                <span className="font-medium">Limpar Dados de Reconhecimento</span>
              </div>
              <span className="material-symbols-outlined text-white/40">chevron_right</span>
            </button>

            <Link to="/settings/privacy" className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">policy</span>
                </div>
                <span className="font-medium">Política de Privacidade</span>
              </div>
              <span className="material-symbols-outlined text-white/40">chevron_right</span>
            </Link>

          </div>
        </section>

        {/* GENERAL */}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Geral</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">

            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">notifications</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Notificações</span>
                  <span className="text-xs text-white/50">Ativar alertas e atualizações</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-7 w-12 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">contrast</span>
                </div>
                <span className="font-medium">Tema do App</span>
              </div>
              <div className="flex rounded-lg bg-white/10 p-1">
                <div className="rounded-md px-3 py-1 text-xs font-medium text-white/60">Claro</div>
                <div className="rounded-md bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-sm">Escuro</div>
                <div className="rounded-md px-3 py-1 text-xs font-medium text-white/60">Sistema</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">vibration</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Feedback Tátil</span>
                  <span className="text-xs text-white/50">Sentir interações</span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-7 w-12 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

          </div>
        </section>

        {/* INSTALLATION */}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Instalação</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">
            <Link to="/install" className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary">download_for_offline</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Instalar no Dispositivo</span>
                  <span className="text-xs text-white/50">Usar como Aplicativo Nativo</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-white/40">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* ABOUT */}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Sobre</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">

            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">tag</span>
                </div>
                <span className="font-medium">Versão do App</span>
              </div>
              <span className="text-sm font-medium text-white/50">1.2.5</span>
            </div>

            <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <span className="material-symbols-outlined text-white/80">help</span>
                </div>
                <span className="font-medium">Ajuda e Suporte</span>
              </div>
              <span className="material-symbols-outlined text-white/40">chevron_right</span>
            </button>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Settings;