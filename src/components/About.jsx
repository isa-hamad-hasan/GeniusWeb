import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";
import { geniusContent } from "../data/geniusContent";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[20px]">
          Welcome to GENIUS
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver technology built <br /> with purpose"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Created by a team that believes in building with purpose</p>
          <p className="text-gray-500">
            We focus on turning ideas into reliable technology by working
            together, prioritizing usability, longevity, and real-world value.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip" style={{ zIndex: 1 }}>
        <div className="mask-clip-path about-image" style={{ zIndex: 1 }}>
          <img
            src="img/GPS.jpeg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
