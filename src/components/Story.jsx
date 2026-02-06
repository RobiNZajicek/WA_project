import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import { useApp } from "../context/AppContext";

gsap.registerPlugin();

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { t } = useApp();

  useGSAP(() => {
    gsap.from(".step-card", {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });
  });

  const steps = [
    { number: "01", title: t("step1Title"), description: t("step1Desc"), icon: "👤" },
    { number: "02", title: t("step2Title"), description: t("step2Desc"), icon: "🎮" },
    { number: "03", title: t("step3Title"), description: t("step3Desc"), icon: "🧩" },
    { number: "04", title: t("step4Title"), description: t("step4Desc"), icon: "🏆" },
  ];

  return (
    <div
      id="how-it-works"
      ref={containerRef}
      className="min-h-dvh w-screen bg-jecna-darker py-24"
    >
      <div className="container mx-auto px-5 md:px-10">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm uppercase text-accent-blue tracking-wider">
            {t("howItWorksLabel")}
          </p>
          <AnimatedTitle
            title={`${t("howItWorksTitle1")} <br /> ${t("howItWorksTitle2")}`}
            containerClass="mt-5 !text-white uppercase"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card group relative rounded-2xl bg-jecna-card border border-jecna-border p-8 hover:border-accent-blue/50 transition-all duration-300"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-2 font-poppins text-7xl font-extrabold text-accent-blue/10 group-hover:text-accent-blue/20 transition-colors">
                {step.number}
              </div>

              {/* Icon */}
              <div className="relative text-4xl mb-6">{step.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (not on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-jecna-border to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Daily challenge callout */}
        <div className="mt-20 relative rounded-3xl bg-gradient-to-r from-accent-blue/10 via-jecna-card to-accent-blue/10 border border-jecna-border p-10 md:p-16 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <p className="text-accent-blue font-mono text-sm mb-4">
              {t("ctaComment")}
            </p>
            <h2 className="font-poppins text-3xl md:text-5xl font-extrabold text-white mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              {t("ctaDesc")}
            </p>
            <button className="px-8 py-4 bg-accent-blue text-white font-bold rounded-full hover:scale-105 transition-transform">
              {t("startPlaying")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
