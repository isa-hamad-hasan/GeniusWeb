import gsap from "gsap";
import { useRef, useState } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

const FloatingImage = () => {
  const frameRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // --------------------
  // 3D Tilt Effect
  // --------------------
  const handleMouseMove = (e) => {
    const element = frameRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(element, {
      rotateX,
      rotateY,
      duration: 0.3,
      transformPerspective: 600,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;
    if (!element) return;

    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <section
      id="story"
      className="min-h-screen w-screen bg-black text-white relative overflow-hidden"
    >
      <div className="flex flex-col items-center py-14 px-6 md:px-12">
        {/* LABEL */}
        <p className="uppercase text-xs tracking-widest text-gray-400">
          GENIUS MINDSET
        </p>

        {/* TITLE */}
        <div className="mt-4 text-center">
          <AnimatedTitle
            title="great res<b>u</b>lts <br/> come from great eff<b>o</b>rts"
            containerClass="mix-blend-difference"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full">
          {/* IMAGE */}
          <div className="flex-1">
            <img
              ref={frameRef}
              src="/img/Lightbulbscolors.jpg"
              alt="Innovation"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full rounded-xl shadow-2xl object-cover"
            />
          </div>

          {/* TEXT */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-300 leading-relaxed">
              At <span className="text-white font-semibold">Genius</span>, we
              believe innovation is built through persistence, experimentation,
              and bold thinking. Our mission is to design technology that solves
              real-world challenges — not just concepts, but scalable solutions
              that create real impact.
            </p>

            <p className="mt-4 text-gray-400 text-sm">
              From idea to execution, every product reflects dedication,
              precision, and a commitment to pushing boundaries.
            </p>

            <div className="mt-6 flex justify-center md:justify-start">
              <Button
                id="effort-btn"
                title="Watch Our Journey"
                containerClass="bg-yellow-400 text-black"
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- VIDEO MODAL ---------------- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="relative w-full max-w-3xl">
            {/* Back Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>

            {/* Video */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                <source src="/videos/firstvideotest.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FloatingImage;
