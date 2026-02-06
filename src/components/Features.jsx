import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useApp } from "../context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const GameCard = ({ icon, title, description, color, index, playLabel }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-jecna-border bg-jecna-card/50 backdrop-blur-sm p-8 transition-all duration-500 hover:border-opacity-50"
        style={{ 
          borderColor: isHovered ? color : undefined,
          boxShadow: isHovered ? `0 0 60px ${color}15` : undefined 
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-500"
          style={{ backgroundColor: color, opacity: isHovered ? 0.3 : 0.1 }}
        />
        
        {/* Number badge */}
        <div 
          className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {index + 1}
        </div>

        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-mono font-bold mb-6 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-poppins text-2xl font-bold text-white mb-3">
          {title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Play button */}
        <button
          className="flex items-center gap-2 font-poppins font-medium text-sm transition-all duration-300 group-hover:gap-3"
          style={{ color }}
        >
          <span>{playLabel}</span>
          <TiLocationArrow className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);
  const { t } = useApp();

  useGSAP(() => {
    gsap.from(".game-card", {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });

    gsap.from(".stat-item", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 85%",
      },
    });
  });

  const games = [
    {
      icon: "W",
      title: "Word Jecna",
      description: t("wordJecnaDesc"),
      color: "#60a5fa",
    },
    {
      icon: "⬡",
      title: "Connections",
      description: t("connectionsDesc"),
      color: "#a78bfa",
    },
    {
      icon: "</>",
      title: "Fix Code",
      description: t("fixCodeDesc"),
      color: "#f472b6",
    },
    {
      icon: "✚",
      title: "Cross Route",
      description: t("crossRouteDesc"),
      color: "#facc15",
    },
  ];

  const stats = [
    { value: "4", label: t("dailyGames"), color: "#60a5fa" },
    { value: "∞", label: t("challenges"), color: "#a78bfa" },
    { value: "24h", label: t("newLevel"), color: "#f472b6" },
    { value: "0", label: t("boredHours"), color: "#facc15" },
  ];

  return (
    <section id="games" className="bg-jecna-dark py-24">
      <div ref={containerRef} className="container mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-sm text-accent-blue mb-4">
            {t("dailyChallenges")}
          </p>
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-white mb-6">
            {t("gamesTitle")}
          </h2>
          <p className="text-text-secondary text-lg">
            {t("gamesDesc")}
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {games.map((game, i) => (
            <div key={i} className="game-card">
              <GameCard {...game} index={i} playLabel={t("playNowBtn")} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-item text-center p-8 rounded-2xl bg-jecna-card/30 border border-jecna-border hover:border-opacity-50 transition-all duration-300"
                style={{ 
                  ["--stat-color"]: stat.color,
                }}
              >
                <div 
                  className="text-5xl md:text-6xl font-bold font-poppins mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-text-secondary text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
