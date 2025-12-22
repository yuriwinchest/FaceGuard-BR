import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModelDownloads: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-transparent p-4 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-start text-white/90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Downloads de Modelos</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex flex-col gap-6 px-4 pt-6">
        <section>
          <h2 className="px-2 pb-3 text-xs font-bold uppercase tracking-wider text-[#9db9a6]">Modelos Disponíveis</h2>
          <div className="overflow-hidden rounded-2xl bg-[#1c271f]">

            {/* Model 1: Downloadable */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium">TinyFaceDetector</span>
                <span className="text-sm text-white/50">1.9 MB</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary transition-colors hover:bg-white/10">
                <span className="material-symbols-outlined text-2xl">download</span>
              </button>
            </div>

            {/* Model 2: Downloading */}
            <div className="flex flex-col gap-3 border-b border-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">SsdMobilenetv1</span>
                  <span className="text-sm text-white/50">5.4 MB</span>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary transition-colors hover:bg-white/10">
                  <span className="material-symbols-outlined text-2xl">pause</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[65%] rounded-full bg-primary transition-all duration-300"></div>
                </div>
                <span className="text-xs font-bold text-primary">65%</span>
              </div>
            </div>

            {/* Model 3: Installed */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">FaceLandmark68Net</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                </div>
                <span className="text-sm text-white/50">350 KB</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-500">
                <span className="material-symbols-outlined text-2xl">delete</span>
              </button>
            </div>

            {/* Model 4: Update Available */}
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium">FaceRecognitionNet</span>
                <span className="text-sm font-medium text-primary">Atualização disponível • 8.1 MB</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary/30">
                <span className="material-symbols-outlined text-2xl">update</span>
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ModelDownloads;