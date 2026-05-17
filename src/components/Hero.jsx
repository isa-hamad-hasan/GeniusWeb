// Hero.jsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const nextVdRef = useRef(null);
  const popRef = useRef(null);

  const handleVideoLoad = () => setLoadedVideos((prev) => prev + 1);

  useEffect(() => {
    if (loadedVideos >= 2) setLoading(false);
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [loadedVideos]);

  const handleMiniClick = () => {
    setHasClicked(true);
    setCurrentIndex((prev) => (prev % totalVideos) + 1);
  };

  const handlePopMove = (e) => {
    const el = popRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    gsap.to(el, {
      x: x / 12,
      y: y / 12,
      rotationY: x / 18,
      rotationX: -y / 18,
      transformPerspective: 800,
      duration: 0.6,
      ease: "power1.out",
    });
  };

  const handlePopLeave = () => {
    gsap.to(popRef.current, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "power1.out",
    });
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });

        gsap.to("#next-video", {
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current?.play(),
        });

        gsap.from("#current-media", {
          scale: 0,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true },
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0%",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;

  return (
    <div id="home" className="relative h-dvh w-screen overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-blue-75"
      >
        {/* Hover pop */}
        <div className="absolute-center absolute z-40">
          <div
            className="group cursor-pointer"
            onClick={handleMiniClick}
            onMouseMove={handlePopMove}
            onMouseLeave={handlePopLeave}
          >
            <div className="w-[22rem] h-[22rem] rounded-full overflow-hidden opacity-0 scale-75 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 group-hover:blur-0">
              <div ref={popRef} className="h-full w-full">
                <img
                  src="/img/LightBulb.jpg"
                  id="current-media"
                  className="h-full w-full object-cover scale-[1.35]"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <video
          ref={nextVdRef}
          src={getVideoSrc(currentIndex)}
          loop
          muted
          playsInline
          preload="metadata"
          id="next-video"
          className="absolute-center invisible absolute z-20 size-64 object-cover"
          onLoadedData={handleVideoLoad}
        />

        <video
          src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
          onLoadedData={handleVideoLoad}
        />

        {/* Hero text */}
        <div className="absolute top-24 left-6 z-40 sm:left-10">
          <h1 className="special-font text-blue-100 text-[clamp(28px,4.5vw,64px)] leading-[0.9]">
            REDEFINE
          </h1>
          <p className="mt-4 max-w-64 text-blue-100 text-sm md:text-base">
            Innovate for Real-World Impact <br />
            Build Sustainable Technology
          </p>
        </div>

        {/* TECHNOLOGY watermark — bottom LEFT */}
        <h1 className="special-font absolute bottom-6 left-6 z-30 text-blue-75 text-[clamp(34px,5.6vw,80px)] leading-[0.85]">
          TECHN<b>O</b>LOGY
        </h1>
      </div>
    </div>
  );
};

export default Hero;
