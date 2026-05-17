// App.jsx
import About from "./components/About";
import Contact from "./components/Contact";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Story from "./components/Story";
import Team from "./components/Team";
import Purchase from "./components/Purchase";
import PurchasePage from "./components/PurchasePage";
import PrintingService from "./components/PrintingService";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />

      {/* Sections */}
      <Hero />
      <Features />
      <Purchase />
      <PrintingService />
      <Story />
      <About />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
