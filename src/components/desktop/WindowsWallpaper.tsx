import React from 'react';

interface WindowsWallpaperProps {
  theme?: string;
}

export default function WindowsWallpaper({ theme = 'bloom-dark' }: WindowsWallpaperProps) {
  // We render the signature Windows 11 "Bloom" - layered folded fabric/petal curves with volumetric lighting
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {theme === 'bloom-blue' ? (
        // Windows 11 Signature Classic Blue Bloom
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1836] via-[#102a5c] to-[#0a1428]">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-blue-600/30 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-cyan-400/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[400px] bg-indigo-600/25 rounded-full blur-[110px] pointer-events-none" />

          {/* Windows 11 Bloom Silk Petals SVG */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-90 animate-bloom-pulse"
            viewBox="0 0 1920 1080"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="petal2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#172554" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="petal3" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="petalCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
              </linearGradient>
              <filter id="bloomBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* Back Fold 1 */}
            <path
              d="M720 380 C880 260 1140 300 1280 440 C1400 560 1350 780 1160 840 C980 900 780 820 700 680 C650 580 620 460 720 380 Z"
              fill="url(#petal1)"
              filter="url(#bloomBlur)"
            />
            {/* Left Ribbon Petal */}
            <path
              d="M680 440 C600 540 620 700 750 790 C880 880 1060 860 1150 760 C1220 680 1200 540 1080 480 C950 420 760 380 680 440 Z"
              fill="url(#petal2)"
            />
            {/* Center Swirl Petal */}
            <path
              d="M840 400 C980 320 1160 360 1220 480 C1280 600 1200 720 1090 760 C980 800 860 760 810 680 C760 600 740 480 840 400 Z"
              fill="url(#petal3)"
            />
            {/* Core Highlight Ribbon */}
            <path
              d="M910 440 C990 380 1100 400 1140 480 C1180 560 1130 640 1060 670 C990 700 910 660 880 600 C850 540 850 480 910 440 Z"
              fill="url(#petalCenter)"
            />
          </svg>
        </div>
      ) : theme === 'bloom-sunset' ? (
        // Windows 11 Sunset Bloom (Purple/Amber)
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f2a] via-[#2d1238] to-[#120824]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-purple-600/30 rounded-full blur-[130px]" />
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-pink-500/25 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[400px] bg-amber-500/20 rounded-full blur-[110px]" />

          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-85 animate-bloom-pulse"
            viewBox="0 0 1920 1080"
            fill="none"
          >
            <defs>
              <linearGradient id="sunset1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="sunset2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#e879f9" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#581c87" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path
              d="M720 380 C880 260 1140 300 1280 440 C1400 560 1350 780 1160 840 C980 900 780 820 700 680 C650 580 620 460 720 380 Z"
              fill="url(#sunset1)"
            />
            <path
              d="M680 440 C600 540 620 700 750 790 C880 880 1060 860 1150 760 C1220 680 1200 540 1080 480 C950 420 760 380 680 440 Z"
              fill="url(#sunset2)"
            />
          </svg>
        </div>
      ) : theme === 'bloom-enterprise' ? (
        // Enterprise Titanium Graphite
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-slate-700/25 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-cyan-700/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[400px] bg-blue-800/20 rounded-full blur-[120px]" />

          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-bloom-pulse"
            viewBox="0 0 1920 1080"
            fill="none"
          >
            <path
              d="M720 380 C880 260 1140 300 1280 440 C1400 560 1350 780 1160 840 C980 900 780 820 700 680 C650 580 620 460 720 380 Z"
              fill="#1e293b"
            />
            <path
              d="M680 440 C600 540 620 700 750 790 C880 880 1060 860 1150 760 C1220 680 1200 540 1080 480 C950 420 760 380 680 440 Z"
              fill="#334155"
              fillOpacity="0.8"
            />
          </svg>
        </div>
      ) : (
        // Default: Windows 11 Signature Dark Bloom (Midnight Navy with Glowing Cyan Petals)
        <div className="absolute inset-0 bg-[#080d1a]">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-radial from-blue-700/20 via-blue-950/10 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-cyan-500/20 rounded-full blur-[110px]" />

          {/* Windows 11 Dark Bloom Vector Silk Ribbons */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-90 animate-bloom-pulse"
            viewBox="0 0 1920 1080"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="darkPetal1" x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#1d4ed8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="darkPetal2" x1="85%" y1="15%" x2="15%" y2="85%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#090d16" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="darkPetalCore" x1="50%" y1="10%" x2="50%" y2="90%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Layer 1 - Deep Fold */}
            <path
              d="M710 390 C870 270 1130 310 1270 450 C1390 570 1340 790 1150 850 C970 910 770 830 690 690 C640 590 610 470 710 390 Z"
              fill="url(#darkPetal1)"
            />
            {/* Layer 2 - Flowing Ribbon */}
            <path
              d="M670 450 C590 550 610 710 740 800 C870 890 1050 870 1140 770 C1210 690 1190 550 1070 490 C940 430 750 390 670 450 Z"
              fill="url(#darkPetal2)"
            />
            {/* Layer 3 - Core Bloom Accent */}
            <path
              d="M830 410 C970 330 1150 370 1210 490 C1270 610 1190 730 1080 770 C970 810 850 770 800 690 C750 610 730 490 830 410 Z"
              fill="url(#darkPetalCore)"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
