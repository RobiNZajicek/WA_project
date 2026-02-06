import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useApp } from "../context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t, language } = useApp();

  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-poppins text-sm uppercase md:text-[10px] text-accent-blue tracking-wider">
          {t("whyJecnaGames")}
        </p>

        {/* Big title with special font */}
        <h2 className="font-zentry special-font text-5xl md:text-7xl lg:text-8xl font-black text-white text-center mt-5 leading-tight">
          {language === "cs" ? (
            <>V<b>Y</b>BER HR<b>U</b></>
          ) : (
            <>P<b>I</b>CK G<b>A</b>ME</>
          )}
        </h2>

        <div className="about-subtext max-w-2xl text-center mt-4">
          <p className="text-text-secondary font-poppins">
            {t("aboutDesc1")}
          </p>
          <p className="text-text-muted font-poppins mt-2">
            {t("aboutDesc2")}
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-jecna-darker via-accent-blue/10 to-jecna-darker flex items-center justify-center">
            {/* Background glows */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-blue/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-accent-purple/20 rounded-full blur-[100px]" />
            
            {/* PLAY text */}
            <div className="relative z-10 text-center">
              <h2 className="font-zentry special-font text-[8vw] md:text-[10vw] font-black text-white leading-none tracking-tight">
                PL<b>A</b>Y
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
