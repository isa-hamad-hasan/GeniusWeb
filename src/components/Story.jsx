import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";
import { supabase } from "../lib/supabase";

const FloatingImage = () => {
  const frameRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("/videos/firstvideotest.mp4");

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "journey_video_url")
      .single()
      .then(({ data }) => {
        if (data?.value) setVideoUrl(data.value);
      });
  }, []);

  // Clean up scroll lock if component unmounts while open
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const openVideo = () => {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  };

  const closeVideo = () => {
    document.body.style.overflow = "";
    setIsOpen(false);
  };

  const handleMouseMove = (e) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      rotateX:
        ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -10,
      rotateY:
        ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10,
      duration: 0.3,
      transformPerspective: 600,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(frameRef.current, {
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
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="flex flex-col items-center py-14 px-6 md:px-12">
        <p className="uppercase text-xs tracking-widest text-gray-400">
          GENIUS MINDSET
        </p>

        <div className="mt-4 text-center">
          <AnimatedTitle
            title="great res<b>u</b>lts <br/> come from great eff<b>o</b>rts"
            containerClass="mix-blend-differenc"
          />
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full">
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
                onClick={openVideo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL — z-[9999] beats every stacking context including GSAP pinned elements */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FloatingImage;
