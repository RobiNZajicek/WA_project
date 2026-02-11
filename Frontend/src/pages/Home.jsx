import About from "../components/About";
import Hero from "../components/Hero";
import Games from "../components/Games";
import HowItWorks from "../components/Story";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Games />
      <Leaderboard />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;
