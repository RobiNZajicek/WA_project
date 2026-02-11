import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import { useApp } from "../context/AppContext";

import Button from "./Button";

const NavBar = ({ isLoggedIn, user }) => {
  const navContainerRef = useRef(null);
  const { language, toggleLanguage, isDark, toggleTheme, t } = useApp();

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { label: t("games"), href: "#games" },
    { label: t("leaderboard"), href: "#leaderboard" },
    { label: t("howItWorks"), href: "#how-it-works" },
  ];

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-poppins text-xl font-bold text-white">
              Jecna<span className="text-accent-blue">Games</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex h-full items-center gap-2">
            <div className="hidden md:flex items-center">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="nav-hover-btn"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg bg-jecna-card/50 border border-jecna-border hover:border-accent-blue/50 transition-all"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-jecna-card/50 border border-jecna-border hover:border-accent-blue/50 transition-all font-mono text-sm text-text-secondary font-medium"
              title="Switch language"
            >
              {language.toUpperCase()}
            </button>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/20 border border-accent-blue/30 hover:bg-accent-blue/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <span className="hidden sm:block text-white font-poppins text-sm font-medium">
                  {user?.username || "Player"}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-text-secondary hover:text-white font-poppins text-sm transition-colors"
                >
                  {language === "cs" ? "Přihlásit" : "Login"}
                </Link>
                <Link to="/register">
                  <Button
                    id="register-btn"
                    title={language === "cs" ? "Registrace" : "Sign Up"}
                    containerClass="!bg-accent-blue !text-white"
                  />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
