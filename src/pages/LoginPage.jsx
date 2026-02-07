import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useApp } from "../context/AppContext";
import { auth } from "../services/api";

const LoginPage = ({ onSuccess }) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".login-card", {
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
    .from(".login-title-letter", {
      y: 40,
      opacity: 0,
      rotateX: -90,
      stagger: 0.03,
      duration: 0.4,
      ease: "back.out(2)",
    }, "-=0.3")
    .from(".login-field", {
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.2");
  });

  const handleFocus = (field) => {
    gsap.to(`.field-${field} .field-line`, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      gsap.to(`.field-${field} .field-line`, {
        scaleX: 0,
        duration: 0.3,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await auth.login(formData.email, formData.password);
      onSuccess?.(data);
      navigate("/dashboard");
    } catch (err) {
      setError(language === "cs" ? "Neplatné přihlašovací údaje" : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const title = language === "cs" ? "PŘIHLÁŠENÍ" : "LOGIN";

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-screen bg-jecna-dark flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="login-card relative w-full max-w-md bg-jecna-card/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl mt-20">
        {/* Decorative */}
        <div className="absolute top-4 right-4 text-accent-blue/20 font-mono text-xs">
          {"<login />"}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-accent-blue font-mono text-sm mb-2">
            // {language === "cs" ? "vítej zpět" : "welcome back"}
          </p>
          <h1 className="font-display text-4xl font-black text-white flex justify-center gap-1">
            {title.split("").map((letter, i) => (
              <span key={i} className="login-title-letter inline-block">
                {letter === "Í" || letter === "I" ? <b>{letter}</b> : letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="login-field field-email relative">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-colors">
              <span className="text-text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={language === "cs" ? "Email nebo uživatelské jméno" : "Email or username"}
                className="flex-1 bg-transparent text-white placeholder:text-text-muted outline-none font-poppins"
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
              />
            </div>
            <div className="field-line absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple scale-x-0 origin-left" />
          </div>

          {/* Password */}
          <div className="login-field field-password relative">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-colors">
              <span className="text-text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder={language === "cs" ? "Heslo" : "Password"}
                className="flex-1 bg-transparent text-white placeholder:text-text-muted outline-none font-poppins"
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                value={formData.password}
              />
            </div>
            <div className="field-line absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple scale-x-0 origin-left" />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-sm text-text-muted hover:text-accent-blue transition-colors font-poppins">
              {language === "cs" ? "Zapomenuté heslo?" : "Forgot password?"}
            </a>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-poppins">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl font-poppins font-semibold text-white hover:opacity-90 transition-all relative overflow-hidden group disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading 
                ? (language === "cs" ? "Přihlašuji..." : "Signing in...") 
                : (language === "cs" ? "Přihlásit se" : "Sign In")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-text-muted text-sm font-mono">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* School login */}
          <button
            type="button"
            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-poppins font-medium text-white hover:bg-white/10 transition-all"
          >
            {language === "cs" ? "Přihlásit školním účtem" : "Sign in with school account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-muted font-poppins">
            {language === "cs" ? "Nemáš účet?" : "Don't have an account?"}{" "}
            <Link 
              to="/register"
              className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
            >
              {language === "cs" ? "Zaregistruj se" : "Sign up"}
            </Link>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-muted/30 font-mono text-xs">
          {"{ secure: true }"}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
