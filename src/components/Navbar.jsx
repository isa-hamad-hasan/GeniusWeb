import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "HOME", href: "#home" },
  { label: "PRODUCTS", href: "#products" },
  { label: "ABOUT", href: "#story" },
  { label: "TEAM", href: "#team" },
  { label: "CONTACT", href: "#contact" },
];

const NavBar = () => {
  const navContainerRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      setMenuOpen(false);
    } else {
      setIsNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.25,
    });
  }, [isNavVisible]);

  return (
    <div ref={navContainerRef} className="fixed top-4 left-0 right-0 z-50 px-5">
      <header className="rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between px-6 py-3">
          {/* LEFT — logo only */}
          <a href="#home" className="flex items-center gap-3">
            <img
              src="/img/logo.png"
              alt="GENIUS Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="hidden sm:block text-white font-bold tracking-widest text-sm uppercase">
              Genius
            </span>
          </a>

          {/* CENTER — nav links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-400 text-sm tracking-widest uppercase transition hover:text-yellow-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT — single CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#products"
              className="rounded-full bg-yellow-300 px-5 py-2 text-black text-sm font-bold tracking-wide transition hover:scale-105 hover:bg-yellow-200"
            >
              Purchase
            </a>

            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 text-sm tracking-widest uppercase transition hover:text-yellow-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
