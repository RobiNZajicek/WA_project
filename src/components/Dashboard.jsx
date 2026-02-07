import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useApp } from "../context/AppContext";

const Dashboard = ({ user, onClose, onLogout }) => {
  const { language } = useApp();
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - bude z API
  const mockUser = user || {
    username: "player123",
    class: "3.A",
    avatar: "🎮",
    joined: "2026-01-15",
    stats: {
      totalGames: 47,
      wins: 32,
      streak: 5,
      bestStreak: 12,
    },
    gameScores: {
      wordJecna: { played: 15, won: 12, avgGuesses: 3.2 },
      connections: { played: 12, won: 8, avgTime: "2:15" },
      fixCode: { played: 10, won: 7, languages: { csharp: 4, java: 3, python: 3 } },
      crossRoute: { played: 10, won: 5, avgTime: "4:30" },
    },
  };

  // Mock leaderboard
  const leaderboard = [
    { rank: 1, username: "hackerman", class: "4.A", score: 2450, avatar: "👑" },
    { rank: 2, username: "codemaster", class: "3.B", score: 2120, avatar: "🥈" },
    { rank: 3, username: "debugger", class: "4.C", score: 1980, avatar: "🥉" },
    { rank: 4, username: "player123", class: "3.A", score: 1750, avatar: "🎮", isCurrentUser: true },
    { rank: 5, username: "syntaxerror", class: "2.A", score: 1620, avatar: "💀" },
    { rank: 6, username: "nullpointer", class: "3.C", score: 1540, avatar: "🔥" },
    { rank: 7, username: "stackover", class: "2.B", score: 1420, avatar: "📚" },
    { rank: 8, username: "gitpush", class: "4.B", score: 1380, avatar: "🚀" },
  ];

  const classLeaderboard = [
    { rank: 1, class: "4.A", avgScore: 1850, players: 24 },
    { rank: 2, class: "3.B", avgScore: 1720, players: 22 },
    { rank: 3, class: "3.A", avgScore: 1680, players: 25, isCurrentClass: true },
    { rank: 4, class: "4.C", avgScore: 1590, players: 21 },
    { rank: 5, class: "2.A", avgScore: 1450, players: 26 },
  ];

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 0.3,
    })
    .from(".dashboard-card", {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    })
    .from(".dashboard-header", {
      y: -20,
      opacity: 0,
      duration: 0.3,
    }, "-=0.2")
    .from(".stat-card", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
    }, "-=0.1")
    .from(".leaderboard-row", {
      x: -20,
      opacity: 0,
      stagger: 0.03,
      duration: 0.2,
    }, "-=0.2");
  });

  const tabs = [
    { id: "overview", label: language === "cs" ? "Přehled" : "Overview", icon: "📊" },
    { id: "leaderboard", label: language === "cs" ? "Žebříček" : "Leaderboard", icon: "🏆" },
    { id: "history", label: language === "cs" ? "Historie" : "History", icon: "📜" },
    { id: "settings", label: language === "cs" ? "Nastavení" : "Settings", icon: "⚙️" },
  ];

  const games = [
    { id: "wordJecna", name: "Word Jecna", icon: "W", color: "#60a5fa" },
    { id: "connections", name: "Connections", icon: "⬡", color: "#a78bfa" },
    { id: "fixCode", name: "Fix Code", icon: "</>", color: "#f472b6" },
    { id: "crossRoute", name: "Cross Route", icon: "✚", color: "#facc15" },
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === containerRef.current && onClose?.()}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-purple/5 rounded-full blur-[120px]" />
      </div>

      {/* Dashboard Card */}
      <div className="dashboard-card relative w-full max-w-5xl max-h-[90vh] bg-jecna-card/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="dashboard-header flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-2xl">
              {mockUser.avatar}
            </div>
            <div>
              <h2 className="font-poppins text-xl font-bold text-white">{mockUser.username}</h2>
              <p className="text-text-muted text-sm font-mono">// {mockUser.class} • {language === "cs" ? "Série" : "Streak"}: {mockUser.stats.streak} 🔥</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm font-poppins text-text-muted hover:text-white transition-colors"
            >
              {language === "cs" ? "Odhlásit" : "Logout"}
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 mx-6 mt-4 bg-white/5 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-poppins text-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: language === "cs" ? "Celkem her" : "Total Games", value: mockUser.stats.totalGames, icon: "🎮" },
                  { label: language === "cs" ? "Výher" : "Wins", value: mockUser.stats.wins, icon: "✅" },
                  { label: language === "cs" ? "Aktuální série" : "Current Streak", value: mockUser.stats.streak, icon: "🔥" },
                  { label: language === "cs" ? "Nejlepší série" : "Best Streak", value: mockUser.stats.bestStreak, icon: "⭐" },
                ].map((stat, i) => (
                  <div key={i} className="stat-card bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{stat.icon}</span>
                      <span className="text-text-muted text-xs font-mono">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Game Stats */}
              <div>
                <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-accent-blue">{">"}</span>
                  {language === "cs" ? "Statistiky her" : "Game Stats"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {games.map((game) => {
                    const stats = mockUser.gameScores[game.id];
                    const winRate = stats ? Math.round((stats.won / stats.played) * 100) : 0;
                    return (
                      <div 
                        key={game.id}
                        className="stat-card bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-opacity-50 transition-colors"
                        style={{ borderColor: `${game.color}30` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold"
                            style={{ backgroundColor: `${game.color}20`, color: game.color }}
                          >
                            {game.icon}
                          </div>
                          <div>
                            <p className="font-poppins font-medium text-white">{game.name}</p>
                            <p className="text-xs text-text-muted">{stats?.played || 0} {language === "cs" ? "her" : "games"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ width: `${winRate}%`, backgroundColor: game.color }}
                            />
                          </div>
                          <span className="text-sm font-mono" style={{ color: game.color }}>{winRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              {/* Player Leaderboard */}
              <div>
                <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-accent-blue">{">"}</span>
                  {language === "cs" ? "Top hráči" : "Top Players"}
                </h3>
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  {leaderboard.map((player, i) => (
                    <div 
                      key={i}
                      className={`leaderboard-row flex items-center gap-4 p-4 border-b border-white/5 last:border-0 transition-colors ${
                        player.isCurrentUser ? "bg-accent-blue/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        player.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        player.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                        player.rank === 3 ? "bg-orange-500/20 text-orange-500" :
                        "bg-white/10 text-text-muted"
                      }`}>
                        {player.rank}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {player.avatar}
                      </div>
                      <div className="flex-1">
                        <p className={`font-poppins font-medium ${player.isCurrentUser ? "text-accent-blue" : "text-white"}`}>
                          {player.username}
                          {player.isCurrentUser && <span className="ml-2 text-xs">({language === "cs" ? "ty" : "you"})</span>}
                        </p>
                        <p className="text-xs text-text-muted font-mono">{player.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-white">{player.score.toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{language === "cs" ? "bodů" : "pts"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Leaderboard */}
              <div>
                <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-accent-purple">{">"}</span>
                  {language === "cs" ? "Top třídy" : "Top Classes"}
                </h3>
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  {classLeaderboard.map((cls, i) => (
                    <div 
                      key={i}
                      className={`leaderboard-row flex items-center gap-4 p-4 border-b border-white/5 last:border-0 transition-colors ${
                        cls.isCurrentClass ? "bg-accent-purple/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        cls.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        cls.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                        cls.rank === 3 ? "bg-orange-500/20 text-orange-500" :
                        "bg-white/10 text-text-muted"
                      }`}>
                        {cls.rank}
                      </div>
                      <div className="flex-1">
                        <p className={`font-poppins font-medium ${cls.isCurrentClass ? "text-accent-purple" : "text-white"}`}>
                          {cls.class}
                          {cls.isCurrentClass && <span className="ml-2 text-xs">({language === "cs" ? "tvoje" : "yours"})</span>}
                        </p>
                        <p className="text-xs text-text-muted font-mono">{cls.players} {language === "cs" ? "hráčů" : "players"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-white">{cls.avgScore.toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{language === "cs" ? "průměr" : "avg"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📜</p>
              <p className="text-text-muted font-poppins">{language === "cs" ? "Historie her bude brzy..." : "Game history coming soon..."}</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">⚙️</p>
              <p className="text-text-muted font-poppins">{language === "cs" ? "Nastavení bude brzy..." : "Settings coming soon..."}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-text-muted/50 font-mono text-xs">
            {"// "}rank: #{leaderboard.find(p => p.isCurrentUser)?.rank || "?"} • score: {leaderboard.find(p => p.isCurrentUser)?.score.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
