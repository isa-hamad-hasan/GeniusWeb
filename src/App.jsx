import { useEffect, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Story from "./components/Story";
import Team from "./components/Team";
import Admin from "./pages/Admin";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Show admin if URL contains /admin
    setIsAdmin(window.location.pathname.includes("/admin"));
  }, []);

  if (isAdmin) return <Admin />;

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <Features />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Story />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <About />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Team />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Contact />
      </div>
      <Footer />
    </main>
  );
}

export default App;
