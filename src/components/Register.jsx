import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useApp } from "../context/AppContext";
import { auth } from "../services/api";

const Register = ({ onSwitchToLogin, onClose, onSuccess }) => {
  const { language } = useApp();
  const containerRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = ["1.A", "1.B", "1.C", "2.A", "2.B", "2.C", "3.A", "3.B", "3.C", "4.A", "4.B", "4.C"];

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 0.3,
    })
    .from(".register-card", {
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "back.out(1.7)",
    })
    .from(".register-title-letter", {
      y: 40,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.3,
      ease: "back.out(2)",
    }, "-=0.2")
    .from(".step-indicator", {
      scale: 0,
      stagger: 0.1,
      duration: 0.3,
      ease: "back.out(2)",
    }, "-=0.2")
    .from(".register-field", {
      x: -30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.1");
  });

  const animateToStep = (newStep) => {
    gsap.to(".step-content", {
      x: newStep > step ? -50 : 50,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setStep(newStep);
        gsap.fromTo(".step-content", 
          { x: newStep > step ? 50 : -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    });
  };

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
    
    if (step < 2) {
      animateToStep(step + 1);
    } else {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError(language === "cs" ? "Hesla se neshodují" : "Passwords don't match");
        return;
      }
      
      if (formData.password.length < 6) {
        setError(language === "cs" ? "Heslo musí mít alespoň 6 znaků" : "Password must be at least 6 characters");
        return;
      }
      
      setLoading(true);
      
      // Final submit
      gsap.to(".register-btn", {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
      
      try {
        const data = await auth.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          class: formData.class,
        });
        onSuccess?.(data);
      } catch (err) {
        setError(language === "cs" ? "Registrace selhala. Zkuste jiný email nebo uživatelské jméno." : "Registration failed. Try a different email or username.");
      } finally {
        setLoading(false);
      }
    }
  };

  const title = language === "cs" ? "REGISTRACE" : "SIGN UP";

  const renderField = (name, type, placeholder, icon) => (
    <div className={`register-field field-${name} relative`}>
      <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 transition-colors hover:border-white/20">
        <span className="field-icon text-text-muted">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder:text-text-muted outline-none font-poppins"
          onFocus={() => handleFocus(name)}
          onBlur={() => handleBlur(name)}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          value={formData[name]}
        />
      </div>
      <div className="field-line absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-purple to-accent-blue scale-x-0 origin-left" />
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === containerRef.current && onClose?.()}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent-blue/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Register Card */}
      <div className="register-card relative w-full max-w-md mx-4 bg-jecna-card/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
        {/* Close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        )}

        {/* Decorative */}
        <div className="absolute top-4 left-4 text-accent-purple/20 font-mono text-xs">
          {"// new_player"}
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-accent-purple font-mono text-sm mb-2">
            // {language === "cs" ? "připoj se k nám" : "join the game"}
          </p>
          <h2 className="font-zentry text-3xl font-black text-white flex justify-center gap-0.5 flex-wrap">
            {title.split("").map((letter, i) => (
              <span key={i} className="register-title-letter inline-block">
                {letter === "A" || letter === "I" ? <b>{letter}</b> : letter}
              </span>
            ))}
          </h2>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div 
              key={s}
              className={`step-indicator w-12 h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "bg-gradient-to-r from-accent-purple to-accent-blue" : 
                s < step ? "bg-accent-purple" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="step-content space-y-4">
            {step === 1 && (
              <>
                {renderField("username", "text", language === "cs" ? "Uživatelské jméno" : "Username",
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {renderField("email", "email", "Email",
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                )}
                
                {/* Class selector */}
                <div className="register-field field-class relative">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <span className="text-text-muted">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <select
                      className="flex-1 bg-transparent text-white outline-none font-poppins appearance-none cursor-pointer"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    >
                      <option value="" className="bg-jecna-dark">{language === "cs" ? "Vyber třídu" : "Select class"}</option>
                      {classes.map((c) => (
                        <option key={c} value={c} className="bg-jecna-dark">{c}</option>
                      ))}
                    </select>
                    <span className="text-text-muted">▼</span>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {renderField("password", "password", language === "cs" ? "Heslo" : "Password",
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {renderField("confirmPassword", "password", language === "cs" ? "Potvrď heslo" : "Confirm password",
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                
                {/* Password strength indicator */}
                <div className="px-1">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          formData.password.length >= i * 3 
                            ? i <= 2 ? "bg-red-500" : i === 3 ? "bg-yellow-500" : "bg-green-500"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted font-mono">
                    {formData.password.length < 6 && "// min 6 characters"}
                    {formData.password.length >= 6 && formData.password.length < 12 && "// getting there..."}
                    {formData.password.length >= 12 && "// strong password 💪"}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-poppins">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => animateToStep(step - 1)}
                disabled={loading}
                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-poppins font-medium text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                ← {language === "cs" ? "Zpět" : "Back"}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="register-btn flex-1 py-4 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-poppins font-semibold text-white hover:opacity-90 transition-all relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading
                  ? (language === "cs" ? "Vytvářím..." : "Creating...")
                  : step < 2 
                    ? (language === "cs" ? "Pokračovat →" : "Continue →")
                    : (language === "cs" ? "Vytvořit účet" : "Create account")
                }
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-muted font-poppins">
            {language === "cs" ? "Už máš účet?" : "Already have an account?"}{" "}
            <button 
              onClick={onSwitchToLogin}
              className="text-accent-purple hover:text-accent-blue transition-colors font-semibold"
            >
              {language === "cs" ? "Přihlas se" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-muted/30 font-mono text-xs">
          {`{ step: ${step}/2 }`}
        </div>
      </div>
    </div>
  );
};

export default Register;
