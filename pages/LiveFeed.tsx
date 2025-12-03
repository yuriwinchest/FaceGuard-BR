import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LiveFeed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-background-dark">
      {/* Background Image simulating Camera Feed */}
      <div className="absolute inset-0 h-full w-full">
        <img
          className="h-full w-full object-cover opacity-90"
          alt="Camera Feed"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdDuNguheCuZszKhmB41zDqKOPJsMhlKSrcFtsL7jnSpVTeivagrr-V0pct0AAMDLdJXVHzARl23DH-mKtI5iUW9edDZSmdOj8oOghQbCz37ijcP8scvuUI-Y1HGOK3xk8pDa5Mk3XvI1xd67vzTUqCw-VqqbmS5uhh_6_elNVnKInHmTymFGbE2EzG_0XwOG4RgHbUZzA-BGpUTJ-NoSGrAMQKYsxd9EQf6NeSGM2GJHgydlveiUt3r0oUcpZfzUf3G9LiEAGWAM4"
        />
      </div>

      {/* Overlays Container */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-black/30 p-4 pb-3 backdrop-blur-sm">
          <Link to="/settings" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-white">
            Câmera ao Vivo
          </h2>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
          </button>
        </div>

        {/* Face Detection Boxes */}
        <div className="pointer-events-none absolute inset-0">
          
          {/* Recognized Face (Green) */}
          <div className="absolute top-[25%] left-[35%] h-[25%] w-[30%]">
            <div className="absolute -top-9 left-0 animate-bounce">
              <div className="flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-sm font-bold text-background-dark backdrop-blur-md shadow-lg">
                <span>Jane Doe</span>
                <span className="h-3 w-px bg-background-dark/30"></span>
                <span>98%</span>
              </div>
            </div>
            <div className="h-full w-full rounded-xl border-2 border-primary shadow-[0_0_20px_rgba(19,236,91,0.3)]"></div>
            
            {/* Corner Markers for tech feel */}
            <div className="absolute -top-0.5 -left-0.5 h-4 w-4 border-t-4 border-l-4 border-primary"></div>
            <div className="absolute -top-0.5 -right-0.5 h-4 w-4 border-t-4 border-r-4 border-primary"></div>
            <div className="absolute -bottom-0.5 -left-0.5 h-4 w-4 border-b-4 border-l-4 border-primary"></div>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 border-b-4 border-r-4 border-primary"></div>
          </div>

          {/* Unrecognized Face (Dashed White) */}
          <div className="absolute top-[55%] left-[15%] h-[20%] w-[25%] opacity-60">
            <div className="h-full w-full rounded-xl border-2 border-dashed border-white/60"></div>
          </div>

        </div>

        {/* Bottom Controls */}
        <div className="flex w-full flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent pb-8 pt-10">
          
          <div className="flex w-full items-center justify-around px-8">
             <Link to="/people" className="flex flex-col items-center gap-1 text-white/80 hover:text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                   <span className="material-symbols-outlined">people</span>
                </div>
                <span className="text-xs font-medium">Pessoas</span>
             </Link>

             {/* Shutter Button */}
             <button 
                onClick={() => navigate('/register')}
                className="group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-transparent transition-transform active:scale-95"
             >
                <div className="h-[64px] w-[64px] rounded-full bg-primary transition-all group-hover:scale-105 group-active:scale-90 shadow-[0_0_15px_rgba(19,236,91,0.5)]"></div>
             </button>

             <div className="flex flex-col items-center gap-1 text-white/80 hover:text-white opacity-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                   <span className="material-symbols-outlined">photo_library</span>
                </div>
                <span className="text-xs font-medium">Galeria</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveFeed;