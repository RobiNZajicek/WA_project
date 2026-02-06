import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useApp } from "../context/AppContext";

gsap.registerPlugin(ScrollTrigger);

// Mini phone component for each game
const GamePhone = ({ game }) => {
  return (
    <div className="relative">
      <div 
        className="relative w-full bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[2rem] p-[2px] border border-gray-700/50"
        style={{ boxShadow: `0 0 40px ${game.color}30, 0 0 80px ${game.color}15` }}
      >
        <div className="relative bg-black rounded-[1.9rem] overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-16 h-5 bg-black rounded-full border border-gray-800"></div>
          </div>
          <div className="aspect-[9/16] w-full bg-jecna-dark p-4 flex flex-col">
            <div className="mt-8 mb-4">
              <p className="text-xs font-mono mb-1" style={{ color: game.color }}>// {game.tag}</p>
              <h3 className="text-white font-bold text-lg">{game.name}</h3>
            </div>
            <div 
              className="flex-1 rounded-xl p-4 flex flex-col items-center justify-center"
              style={{ backgroundColor: `${game.color}10`, border: `1px solid ${game.color}30` }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-mono font-bold mb-4"
                style={{ backgroundColor: `${game.color}20`, color: game.color }}
              >
                {game.icon}
              </div>
              <div className="text-center">{game.preview}</div>
            </div>
            <button 
              className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105"
              style={{ backgroundColor: game.color, color: '#0a0a0f' }}
            >
              Hrát
            </button>
            <div className="mt-3 mx-auto w-20 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Games = () => {
  const { t, language } = useApp();
  const containerRef = useRef(null);
  const mainPhoneRef = useRef(null);

  const games = [
    {
      icon: "W",
      name: "Word Jecna",
      color: "#60a5fa",
      tag: "wordle",
      preview: (
        <div className="flex gap-1">
          {["A", "R", "R", "A", "Y"].map((l, i) => (
            <span key={i} className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${i < 3 ? "bg-[#60a5fa]/40 text-[#60a5fa]" : "bg-gray-700 text-gray-400"}`}>{l}</span>
          ))}
        </div>
      ),
    },
    {
      icon: "⬡",
      name: "Connections",
      color: "#a78bfa",
      tag: "connect",
      preview: (
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          {["getter", "setter", "public", "private"].map((term, i) => (
            <span key={i} className="px-2 py-1 bg-[#a78bfa]/30 text-[#a78bfa] rounded text-center">{term}</span>
          ))}
        </div>
      ),
    },
    {
      icon: "</>",
      name: "Fix Code",
      color: "#f472b6",
      tag: "debug",
      preview: <pre className="text-[10px] text-[#f472b6] text-left"><code>{`for(i=0; i<10)\n  print(i)`}</code></pre>,
    },
    {
      icon: "✚",
      name: "Cross Route",
      color: "#facc15",
      tag: "crossword",
      preview: (
        <div className="grid grid-cols-4 gap-0.5">
          {["L", "O", "O", "P", "", "O", "", "", "", "P", "", ""].map((c, i) => (
            <span key={i} className={`w-4 h-4 text-[8px] font-mono flex items-center justify-center ${c ? "bg-[#facc15]/30 text-[#facc15]" : ""}`}>{c}</span>
          ))}
        </div>
      ),
    },
  ];

  useGSAP(() => {
    // Pin the section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=2000",
      pin: true,
      pinSpacing: true,
    });

    // Timeline for the split animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1500",
        scrub: 1,
      },
    });

    // Phase 1: Main phone scales down
    tl.to(mainPhoneRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
    });

    // Phase 2: Four phones appear and spread out
    tl.fromTo(
      ".split-phone",
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.05, duration: 0.6 },
      "-=0.2"
    );
  });

  return (
    <div ref={containerRef} id="games" className="h-screen w-screen bg-jecna-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[120px]" />

      {/* Title - always visible at top */}
      <div className="absolute top-8 left-0 right-0 text-center z-20 px-4">
        <p className="font-mono text-sm text-accent-blue mb-2">{t("dailyChallenges")}</p>
        <h2 className="font-poppins text-3xl md:text-5xl font-bold text-white uppercase">
          4 {t("games")}
        </h2>
      </div>

      {/* Main single phone (initial state) */}
      <div 
        ref={mainPhoneRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] sm:w-[320px]"
      >
        <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[3rem] p-[3px] shadow-[0_0_80px_rgba(96,165,250,0.3),0_0_120px_rgba(167,139,250,0.2)] border border-gray-700/50">
          <div className="relative bg-black rounded-[2.8rem] overflow-hidden">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-24 h-7 bg-black rounded-full border border-gray-800 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              </div>
            </div>
            <div className="aspect-[9/19] w-full bg-jecna-dark p-5 flex flex-col">
              <div className="mt-10 mb-6 text-center">
                <p className="text-accent-blue text-sm font-mono mb-2">// choose_game</p>
                <h3 className="text-white font-bold text-xl uppercase">{t("newLevel")}</h3>
                <p className="text-text-muted text-xs mt-1">{language === "cs" ? "každý den" : "every day"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {games.map((game, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-3 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-bold mb-2 bg-white/10 text-white">{game.icon}</div>
                    <span className="text-white text-xs font-medium">{game.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-around py-3 mt-4 border-t border-white/10">
                <span className="text-white/40 text-lg">⌂</span>
                <span className="text-white text-lg">▣</span>
                <span className="text-white/40 text-lg">◈</span>
                <span className="text-white/40 text-lg">⚙</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="absolute -inset-10 bg-gradient-to-r from-accent-blue/20 via-accent-purple/15 to-accent-blue/20 blur-[60px] -z-10 rounded-full"></div>
      </div>

      {/* Four split phones (end state) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 max-w-7xl">
          {games.map((game, i) => (
            <div key={i} className="split-phone w-[180px] sm:w-[200px] md:w-[240px] lg:w-[260px] opacity-0">
              <GamePhone game={game} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-text-muted text-sm">Scroll</span>
        <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-accent-blue rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Games;
