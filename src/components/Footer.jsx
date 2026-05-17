// Footer.jsx
import { geniusContent } from "../data/geniusContent";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

const socialLinks = [
  { href: geniusContent.links.instagram, icon: <FaInstagram /> },
  { href: geniusContent.links.linkedin, icon: <FaLinkedin /> },
  //{ href: geniusContent.links.youtube, icon: <FaYoutube /> },
  { href: geniusContent.links.tiktok, icon: <FaTiktok /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-[var(--genius-gold)] text-black pb-10">
      <div className="container mx-auto px-4">
        <div className="border-t border-black/15 pt-6" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm font-light md:text-left text-black/70">
            © {geniusContent.brand.name} 2025. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 transition hover:text-black hover:scale-110"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <a
            href="#privacy-policy"
            className="text-center text-sm font-light md:text-right text-black/70 hover:text-black hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
