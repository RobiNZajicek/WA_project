import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

import Button from "./Button";
import heroVideo from "../assets/1088042583-preview.mp4";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const { t } = useApp();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!loading) {
      // Animate title letters
      gsap.from(".hero-letter", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // Animate subtitle
      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
      });

      // Animate CTA
      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out",
      });

      // Animate game cards preview
      gsap.from(".game-preview-card", {
        y: 50,
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.8,
        delay: 1.5,
        ease: "power2.out",
      });
    }
  }, [loading]);

  useGSAP(() => {
    gsap.set("#hero-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#hero-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const games = [
    { name: "Word Jecna", icon: "W", color: "accent-blue" },
    { name: "Connections", icon: "C", color: "accent-blue" },
    { name: "Fix Code", icon: "</>", color: "accent-purple" },
    { name: "Cross Route", icon: "+", color: "accent-yellow" },
  ];

  return (
    <div ref={heroRef} className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-jecna-dark">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="hero-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-jecna-dark"
      >
        {/* Background video */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-jecna-dark/40" />

        {/* Main content */}
        <div className="absolute left-0 top-0 z-40 size-full flex flex-col justify-center">
          <div className="px-5 sm:px-10 lg:px-20">
            {/* Main title */}
            <div ref={titleRef} className="overflow-hidden">
              <h1 className="special-font hero-heading text-white flex flex-wrap">
                {"JECNA".split("").map((letter, i) => (
                  <span key={i} className="hero-letter inline-block">
                    {letter === "E" ? <b>{letter}</b> : letter}
                  </span>
                ))}
              </h1>
            </div>
            <div className="overflow-hidden -mt-4 sm:-mt-8">
              <h1 className="special-font hero-heading text-accent-blue flex flex-wrap">
                {"GAMES".split("").map((letter, i) => (
                  <span key={i} className="hero-letter inline-block">
                    {letter === "A" ? <b>{letter}</b> : letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle mt-6 max-w-md font-poppins text-lg text-text-secondary">
              {t("heroSubtitle")}
              <br />
              <span className="text-accent-blue">{t("heroTagline")}</span>
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta mt-8 flex flex-wrap gap-4">
              <Button
                id="play-today"
                title={t("playToday")}
                leftIcon={<TiLocationArrow />}
                containerClass="!bg-accent-blue !text-white flex-center gap-2 !px-8 !py-4"
              />
              <Button
                id="view-games"
                title={t("viewGames")}
                containerClass="!bg-transparent border border-text-muted !text-white hover:border-accent-blue transition-colors"
              />
            </div>

            {/* Game preview cards */}
            <div className="mt-12 flex flex-wrap gap-4">
              {games.map((game, i) => (
                <div
                  key={i}
                  className={`game-preview-card group flex items-center gap-3 rounded-xl bg-jecna-card/80 backdrop-blur-sm border border-jecna-border px-4 py-3 cursor-pointer hover:border-${game.color}/50 transition-all duration-300`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${game.color}/20 text-${game.color} font-mono font-bold`}
                  >
                    {game.icon}
                  </div>
                  <span className="text-text-primary font-poppins font-medium group-hover:text-white transition-colors">
                    {game.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom right decorative text - inside frame, will clip to black */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-white">
          C<b>O</b>DE
        </h1>
      </div>

      {/* Shadow text behind - stays black, visible after clip animation */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-blue-400">
        C<b>O</b>DE
      </h1>
    </div>
  );
};

export default Hero;
