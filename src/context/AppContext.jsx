import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const translations = {
  cs: {
    // Navbar
    games: "Hry",
    about: "O nás",
    howItWorks: "Jak to funguje",
    leaderboard: "Žebříček",
    playNow: "Hrát",
    
    // Hero
    heroSubtitle: "Denní programátorské výzvy pro studenty SPŠE Ječná.",
    heroTagline: "Hraj. Uč se. Soutěž.",
    playToday: "Hrát dnešní výzvu",
    viewGames: "Prohlédnout hry",
    
    // About
    whyJecnaGames: "Proč JecnaGames?",
    aboutTitle1: "Pojď si",
    aboutTitle2: "vybrat hru",
    aboutDesc1: "Programování nemusí být nuda. S JecnaGames řešíš denní výzvy.",
    aboutDesc2: "Wordle pro IT pojmy. Connections pro OOP koncepty. Debug challenge pro C#, Javu a Python. Křížovky pro algoritmy.",
    dailyChallenge: "// your daily challenge awaits",
    
    // Games
    dailyChallenges: "// daily_challenges",
    gamesTitle: "4 hry. Nový level každý den.",
    gamesDesc: "Procvič si programování zábavnou formou. Soutěž se spolužáky, sleduj své skóre a zlepšuj se každý den.",
    playNowBtn: "Hrát teď",
    
    // Game descriptions
    wordJecnaDesc: "Hádej IT pojem za 6 pokusů. Každý den nové slovo z programování, sítí nebo hardware.",
    connectionsDesc: "Spoj 16 pojmů do 4 skupin. OOP koncepty, datové typy, design patterns a více.",
    fixCodeDesc: "Najdi a oprav chybu v kódu. C#, Java nebo Python - vyber si svůj jazyk.",
    crossRouteDesc: "Programátorská křížovka. Algoritmy, pojmy, zkratky - všechno propojeno.",
    
    // Stats
    dailyGames: "Denní hry",
    challenges: "Výzev",
    newLevel: "Nový level",
    boredHours: "Hodin nudy",
    
    // How it works
    howItWorksLabel: "Jak to funguje",
    howItWorksTitle1: "Od přihlášení",
    howItWorksTitle2: "k vítězství",
    step1Title: "Přihlas se",
    step1Desc: "Použij svůj školní účet nebo si vytvoř nový profil.",
    step2Title: "Vyber hru",
    step2Desc: "Word Jecna, Connections, Fix Code nebo Cross Route - denně nová výzva.",
    step3Title: "Řeš výzvu",
    step3Desc: "Máš omezený počet pokusů. Mysli, programuj, vítěz!",
    step4Title: "Srovnej se",
    step4Desc: "Sleduj žebříček tříd i jednotlivců. Kdo je nejlepší?",
    
    // CTA
    ctaComment: "// Nová výzva každý den o půlnoci",
    ctaTitle: "Připraven na dnešní challenge?",
    ctaDesc: "Každý den nové slovo, nové spojení, nový bug k opravě. Nepromeškej to!",
    startPlaying: "Začít hrát →",
    
    // Footer
    footerDesc: "Denní programátorské výzvy pro studenty SPŠE Ječná. Vytvořeno s 💙 pro lepší učení.",
    gamesLabel: "Hry",
    linksLabel: "Odkazy",
    docsLabel: "Dokumentace",
    copyright: "© 2026 JecnaGames. Školní projekt SPŠE Ječná.",
    madeWith: "// made with <code /> and ☕",
  },
  en: {
    // Navbar
    games: "Games",
    about: "About",
    howItWorks: "How It Works",
    leaderboard: "Leaderboard",
    playNow: "Play",
    
    // Hero
    heroSubtitle: "Daily programming challenges for SPŠE Ječná students.",
    heroTagline: "Play. Learn. Compete.",
    playToday: "Play today's challenge",
    viewGames: "Browse games",
    
    // About
    whyJecnaGames: "Why JecnaGames?",
    aboutTitle1: "Pick your",
    aboutTitle2: "game",
    aboutDesc1: "Programming doesn't have to be boring. With JecnaGames you solve daily challenges.",
    aboutDesc2: "Wordle for IT terms. Connections for OOP concepts. Debug challenge for C#, Java, and Python. Crosswords for algorithms.",
    dailyChallenge: "// your daily challenge awaits",
    
    // Games
    dailyChallenges: "// daily_challenges",
    gamesTitle: "4 games. New level every day.",
    gamesDesc: "Practice programming in a fun way. Compete with classmates, track your score, and improve every day.",
    playNowBtn: "Play now",
    
    // Game descriptions
    wordJecnaDesc: "Guess the IT term in 6 tries. Every day a new word from programming, networks, or hardware.",
    connectionsDesc: "Connect 16 terms into 4 groups. OOP concepts, data types, design patterns, and more.",
    fixCodeDesc: "Find and fix the bug in code. C#, Java, or Python - pick your language.",
    crossRouteDesc: "Programming crossword. Algorithms, terms, abbreviations - all connected.",
    
    // Stats
    dailyGames: "Daily games",
    challenges: "Challenges",
    newLevel: "New level",
    boredHours: "Hours bored",
    
    // How it works
    howItWorksLabel: "How It Works",
    howItWorksTitle1: "From login",
    howItWorksTitle2: "to victory",
    step1Title: "Log in",
    step1Desc: "Use your school account or create a new profile.",
    step2Title: "Pick a game",
    step2Desc: "Word Jecna, Connections, Fix Code, or Cross Route - new challenge daily.",
    step3Title: "Solve it",
    step3Desc: "You have limited attempts. Think, code, win!",
    step4Title: "Compare",
    step4Desc: "Check the leaderboard by class and individuals. Who's the best?",
    
    // CTA
    ctaComment: "// New challenge every day at midnight",
    ctaTitle: "Ready for today's challenge?",
    ctaDesc: "Every day a new word, new connection, new bug to fix. Don't miss it!",
    startPlaying: "Start playing →",
    
    // Footer
    footerDesc: "Daily programming challenges for SPŠE Ječná students. Made with 💙 for better learning.",
    gamesLabel: "Games",
    linksLabel: "Links",
    docsLabel: "Documentation",
    copyright: "© 2026 JecnaGames. School project SPŠE Ječná.",
    madeWith: "// made with <code /> and ☕",
  },
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState("cs");
  const [isDark, setIsDark] = useState(true);

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "cs" ? "en" : "cs"));
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !isDark);
  }, [isDark]);

  return (
    <AppContext.Provider
      value={{ language, toggleLanguage, isDark, toggleTheme, t }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
