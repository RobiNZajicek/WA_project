import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useApp } from "../context/AppContext";
import { auth, leaderboard as leaderboardApi } from "../services/api";

const DashboardPage = ({ user, onLogout }) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [leaderboard, setLeaderboard] = useState([]);
  const [classLeaderboard, setClassLeaderboard] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch leaderboards
  useEffect(() => {
    leaderboardApi.getPlayers().then(setLeaderboard).catch(console.error);
    leaderboardApi.getClasses().then(setClassLeaderboard).catch(console.error);
  }, []);

  useGSAP(() => {
    gsap.from(".dashboard-content", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  const handleLogout = () => {
    auth.logout();
    onLogout?.();
    navigate("/");
  };

  const mockUser = user || {
    username: "player",
    class: "3.A",
    stats: { totalGames: 0, wins: 0, streak: 0, bestStreak: 0, score: 0 },
  };

  const tabs = [
    { id: "overview", label: language === "cs" ? "Přehled" : "Overview", icon: "📊" },
    { id: "leaderboard", label: language === "cs" ? "Žebříček" : "Leaderboard", icon: "🏆" },
    { id: "games", label: language === "cs" ? "Hry" : "Games", icon: "🎮" },
  ];

  const games = [
    { id: "wordJecna", name: "Word Jecna", icon: "W", color: "#60a5fa", desc: language === "cs" ? "Hádej IT pojem" : "Guess IT term" },
    { id: "connections", name: "Connections", icon: "⬡", color: "#a78bfa", desc: language === "cs" ? "Spoj pojmy" : "Connect terms" },
    { id: "fixCode", name: "Fix Code", icon: "</>", color: "#f472b6", desc: language === "cs" ? "Oprav bug" : "Fix the bug" },
    { id: "crossRoute", name: "Cross Route", icon: "✚", color: "#facc15", desc: language === "cs" ? "Křížovka" : "Crossword" },
  ];

  return (
    <div className="min-h-screen w-screen bg-jecna-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-jecna-dark/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
              <span className="font-mono text-accent-blue font-bold">J</span>
            </div>
            <span className="font-poppins text-xl font-bold text-white hidden sm:block">
              Jecna<span className="text-accent-blue">Games</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-lg">
                {mockUser.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-poppins font-medium">{mockUser.username}</p>
                <p className="text-text-muted text-xs font-mono">{mockUser.class}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-poppins text-text-muted hover:text-white transition-colors"
            >
              {language === "cs" ? "Odhlásit" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="dashboard-content pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: language === "cs" ? "Skóre" : "Score", value: mockUser.stats?.score || 0, icon: "⭐" },
            { label: language === "cs" ? "Výher" : "Wins", value: mockUser.stats?.wins || 0, icon: "✅" },
            { label: language === "cs" ? "Série" : "Streak", value: mockUser.stats?.streak || 0, icon: "🔥" },
            { label: language === "cs" ? "Her" : "Games", value: mockUser.stats?.totalGames || 0, icon: "🎮" },
          ].map((stat, i) => (
            <div key={i} className="bg-jecna-card rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span>{stat.icon}</span>
                <span className="text-text-muted text-xs font-mono">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-8 max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-poppins text-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white" 
                  : "text-text-muted hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Games */}
            <div className="bg-jecna-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-accent-blue">{">"}</span>
                {language === "cs" ? "Dnešní výzvy" : "Today's Challenges"}
              </h3>
              <div className="space-y-3">
                {games.map((game) => (
                  <div 
                    key={game.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold"
                      style={{ backgroundColor: `${game.color}20`, color: game.color }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{game.name}</p>
                      <p className="text-xs text-text-muted">{game.desc}</p>
                    </div>
                    <span className="text-accent-blue">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Leaderboard */}
            <div className="bg-jecna-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-accent-purple">{">"}</span>
                {language === "cs" ? "Top 5 hráčů" : "Top 5 Players"}
              </h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((player, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.username === mockUser.username ? "bg-accent-blue/10" : "bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-500" :
                      i === 1 ? "bg-gray-400/20 text-gray-400" :
                      i === 2 ? "bg-orange-500/20 text-orange-500" :
                      "bg-white/10 text-text-muted"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="flex-1 text-white font-poppins">{player.username}</span>
                    <span className="text-text-muted font-mono text-sm">{player.score}</span>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-text-muted text-center py-4 font-mono text-sm">
                    // {language === "cs" ? "zatím žádní hráči" : "no players yet"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Players */}
            <div className="bg-jecna-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-poppins font-semibold text-white mb-4">
                🏆 {language === "cs" ? "Hráči" : "Players"}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leaderboard.map((player, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.username === mockUser.username ? "bg-accent-blue/10" : "bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-500" :
                      i === 1 ? "bg-gray-400/20 text-gray-400" :
                      i === 2 ? "bg-orange-500/20 text-orange-500" :
                      "bg-white/10 text-text-muted"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-poppins">{player.username}</span>
                      <span className="text-text-muted text-xs ml-2 font-mono">{player.class}</span>
                    </div>
                    <span className="text-white font-mono font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Classes */}
            <div className="bg-jecna-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-poppins font-semibold text-white mb-4">
                🏫 {language === "cs" ? "Třídy" : "Classes"}
              </h3>
              <div className="space-y-2">
                {classLeaderboard.map((cls, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      cls.class === mockUser.class ? "bg-accent-purple/10" : "bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-500" :
                      i === 1 ? "bg-gray-400/20 text-gray-400" :
                      i === 2 ? "bg-orange-500/20 text-orange-500" :
                      "bg-white/10 text-text-muted"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-poppins font-medium">{cls.class}</span>
                      <span className="text-text-muted text-xs ml-2 font-mono">{cls.players} {language === "cs" ? "hráčů" : "players"}</span>
                    </div>
                    <span className="text-white font-mono font-bold">{cls.avgScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "games" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <div 
                key={game.id}
                className="bg-jecna-card rounded-2xl p-6 border border-white/10 hover:border-opacity-50 transition-all cursor-pointer group"
                style={{ borderColor: `${game.color}30` }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-mono font-bold mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${game.color}20`, color: game.color }}
                >
                  {game.icon}
                </div>
                <h3 className="text-white font-poppins font-semibold mb-1">{game.name}</h3>
                <p className="text-text-muted text-sm mb-4">{game.desc}</p>
                <button 
                  className="w-full py-2 rounded-xl font-poppins font-medium transition-all"
                  style={{ backgroundColor: game.color, color: '#0a0a0f' }}
                >
                  {language === "cs" ? "Hrát" : "Play"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
