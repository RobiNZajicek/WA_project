import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "../context/AppContext";
import { leaderboard as leaderboardApi } from "../services/api";
import { FaTrophy, FaMedal, FaUsers, FaUser, FaCrown, FaFire } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Avatars based on rank
const avatars = ["🔥", "⚡", "🥷", "👑", "🎯", "💎", "🚀", "🎮", "💻", "🧠"];

const PlayerRow = ({ player, index }) => {
  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/50";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/50";
    return "bg-white/5 border-white/10";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-400 text-lg" />;
    if (rank === 2) return <FaMedal className="text-gray-300 text-lg" />;
    if (rank === 3) return <FaMedal className="text-amber-600 text-lg" />;
    return <span className="text-text-muted font-mono">#{rank}</span>;
  };

  return (
    <div
      className={`player-row flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(player.rank)} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10`}
      style={{ opacity: 0, transform: "translateX(-20px)" }}
    >
      <div className="w-10 flex justify-center">{getRankIcon(player.rank)}</div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xl">
        {player.avatar}
      </div>
      <div className="flex-1">
        <p className="text-white font-poppins font-semibold">{player.username}</p>
        <p className="text-text-muted text-sm font-mono">{player.class}</p>
      </div>
      {player.streak > 5 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full">
          <FaFire className="text-orange-400 text-sm" />
          <span className="text-orange-400 text-xs font-bold">{player.streak}</span>
        </div>
      )}
      <div className="text-right">
        <p className="text-accent-blue font-bold font-mono text-lg">{player.score.toLocaleString()}</p>
        <p className="text-text-muted text-xs">bodů</p>
      </div>
    </div>
  );
};

const ClassRow = ({ classData, index }) => {
  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-accent-blue/20 to-accent-purple/10 border-accent-blue/50";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/50";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/50";
    return "bg-white/5 border-white/10";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-accent-blue text-lg" />;
    if (rank === 2) return <FaMedal className="text-gray-300 text-lg" />;
    if (rank === 3) return <FaMedal className="text-amber-600 text-lg" />;
    return <span className="text-text-muted font-mono">#{rank}</span>;
  };

  return (
    <div
      className={`class-row flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(classData.rank)} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10`}
      style={{ opacity: 0, transform: "translateX(20px)" }}
    >
      <div className="w-10 flex justify-center">{getRankIcon(classData.rank)}</div>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
        <span className="text-white font-bold font-mono text-sm">{classData.class}</span>
      </div>
      <div className="flex-1">
        <p className="text-white font-poppins font-semibold">{classData.class}</p>
        <div className="flex items-center gap-1 text-text-muted text-sm">
          <FaUsers className="text-xs" />
          <span>{classData.members} hráčů</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-accent-purple font-bold font-mono text-lg">{classData.totalScore.toLocaleString()}</p>
        <p className="text-text-muted text-xs">ø {classData.avgScore}/hráč</p>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const { t, language } = useApp();
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("players");
  const [players, setPlayers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, classesData] = await Promise.all([
          leaderboardApi.getPlayers(),
          leaderboardApi.getClasses(),
        ]);
        // Add avatars to players
        const playersWithAvatars = playersData.slice(0, 10).map((p, i) => ({
          ...p,
          avatar: avatars[i % avatars.length],
        }));
        setPlayers(playersWithAvatars);
        // Add rank and members to classes
        const classesWithRank = classesData.slice(0, 10).map((c, i) => ({
          ...c,
          rank: c.rank || i + 1,
          members: c.players || 0,
          totalScore: c.totalScore || (c.avgScore * (c.players || 1)),
        }));
        setClasses(classesWithRank);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        ".leaderboard-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate tabs
      gsap.fromTo(
        ".leaderboard-tabs",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Animate rows when tab changes
    const rows = activeTab === "players" ? ".player-row" : ".class-row";
    gsap.fromTo(
      rows,
      { opacity: 0, x: activeTab === "players" ? -20 : 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [activeTab]);

  return (
    <section
      ref={containerRef}
      id="leaderboard"
      className="relative min-h-screen w-screen py-20 bg-jecna-dark overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="leaderboard-title text-center mb-12">
          <p className="font-mono text-sm text-accent-blue mb-3">// leaderboard</p>
          <h2 className="font-display special-font text-4xl md:text-6xl font-black text-white uppercase">
            {language === "cs" ? (
              <>
                KD<b>O</b> VE<b>D</b>E?
              </>
            ) : (
              <>
                WH<b>O</b>'S ON T<b>O</b>P?
              </>
            )}
          </h2>
          <p className="text-text-secondary font-poppins mt-4 max-w-lg mx-auto">
            {language === "cs"
              ? "Soutěž za sebe i za svou třídu. Každý bod se počítá!"
              : "Compete for yourself and your class. Every point counts!"}
          </p>
        </div>

        {/* Tabs */}
        <div className="leaderboard-tabs flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("players")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-medium transition-all duration-300 ${
              activeTab === "players"
                ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/30"
                : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
            }`}
          >
            <FaUser />
            {language === "cs" ? "Hráči" : "Players"}
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-medium transition-all duration-300 ${
              activeTab === "classes"
                ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/30"
                : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
            }`}
          >
            <FaUsers />
            {language === "cs" ? "Třídy" : "Classes"}
          </button>
        </div>

        {/* Leaderboard content */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-text-muted mt-4 font-mono text-sm">// loading...</p>
            </div>
          ) : activeTab === "players" ? (
            players.length > 0 ? (
              players.map((player, i) => <PlayerRow key={player.rank || i} player={player} index={i} />)
            ) : (
              <p className="text-center text-text-muted py-12 font-mono">// {language === "cs" ? "zatím žádní hráči" : "no players yet"}</p>
            )
          ) : (
            classes.length > 0 ? (
              classes.map((classData, i) => <ClassRow key={classData.rank || i} classData={classData} index={i} />)
            ) : (
              <p className="text-center text-text-muted py-12 font-mono">// {language === "cs" ? "zatím žádné třídy" : "no classes yet"}</p>
            )
          )}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-accent-blue hover:text-white transition-colors font-poppins"
          >
            {language === "cs" ? "Zobrazit celý žebříček" : "View full leaderboard"}
            <span className="text-lg">→</span>
          </a>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { value: "847", label: language === "cs" ? "Aktivních hráčů" : "Active players", icon: "👥" },
            { value: "32", label: language === "cs" ? "Tříd soutěží" : "Classes competing", icon: "🏫" },
            { value: "12.5k", label: language === "cs" ? "Her odehráno" : "Games played", icon: "🎮" },
            { value: "A4A", label: language === "cs" ? "Vedoucí třída" : "Leading class", icon: "🏆" },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-white font-bold font-mono text-xl">{stat.value}</p>
              <p className="text-text-muted text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
