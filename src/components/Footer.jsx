import { FaGithub, FaInstagram } from "react-icons/fa";
import { useApp } from "../context/AppContext";

const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="w-screen bg-jecna-darker border-t border-jecna-border py-12">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-blue/20 border border-accent-blue/30">
                <span className="font-mono text-accent-blue text-lg font-bold">
                  J
                </span>
              </div>
              <span className="font-poppins text-xl font-bold text-white">
                Jecna<span className="text-accent-blue">Games</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-sm">
              {t("footerDesc")}
            </p>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-white font-bold mb-4">{t("gamesLabel")}</h4>
            <ul className="space-y-2 text-sm">
              {["Word Jecna", "Connections", "Fix Code", "Cross Route"].map(
                (game) => (
                  <li key={game}>
                    <a
                      href="#games"
                      className="text-text-secondary hover:text-accent-blue transition-colors"
                    >
                      {game}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">{t("linksLabel")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://spsejecna.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-blue transition-colors"
                >
                  SPŠE Ječná
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent-blue transition-colors"
                >
                  GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent-blue transition-colors"
                >
                  {t("docsLabel")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-jecna-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            {t("copyright")}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-text-muted hover:text-accent-blue transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-accent-blue transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>

          <p className="text-text-muted text-xs font-mono">
            {t("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
