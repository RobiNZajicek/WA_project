import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Games from "./components/Games";
import HowItWorks from "./components/Story";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-jecna-dark">
      <NavBar />
      <Hero />
      <About />
      <Games />
      <HowItWorks />
      <Footer />
    </main>
  );
}

export default App;
