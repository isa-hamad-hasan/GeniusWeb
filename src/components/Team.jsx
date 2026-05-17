import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";

// Helper: turn a name into a safe filename
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// Helper: get initials
const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Team members array with descriptions
const teamMembers = [
  {
    name: "Ali Hussain Khamis",
    title: "CEO",
    description:
      "Ali leads the GENIUS team with a vision for innovative, sustainable technology.",
  },
  {
    name: "Mohammed Ali Ahmed",
    title: "CTO",
    description:
      "Mohammed drives the technical roadmap and ensures our systems are cutting-edge.",
  },
  {
    name: "Rashed Aldossary",
    title: "",
    description:
      "Rashed contributes to product strategy and development initiatives.",
  },
  {
    name: "Talia Haitham AlRahma",
    title: "CMO",
    description: "Talia manages our marketing strategy and brand presence.",
  },
  {
    name: "Abdulla Saeed Ali",
    title: "CSO",
    description: "Abdulla oversees security and system operations.",
  },
  {
    name: "Mariam Yaser Alkooheji",
    title: "CHRO",
    description: "Mariam focuses on human resources and team growth.",
  },
  {
    name: "Fatema Alzaki",
    title: "CPO",
    description:
      "Fatema ensures our products meet customer needs and high standards.",
  },
  {
    name: "Isa Hamad Hasan",
    title: "CIO",
    description: "Isa manages information systems and technology innovation.",
  },
  {
    name: "Saud Badee Bubshait",
    title: "Head of Information Systems",
    description: "Saud coordinates IT infrastructure and data systems.",
  },

  {
    name: "Osama Ebrahim",
    title: "PM",
    description:
      "Osama specializes in project management, ensuring seamless coordination and effective communication within teams.",
  },
].map((m) => ({
  ...m,
  image: `/img/team/${slugify(m.name)}.jpeg`,
}));

const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="w-screen bg-black py-24 text-blue-50">
      <div className="container mx-auto px-5 md:px-10">
        <AnimatedTitle
          title="Meet the <b>G</b>ENIUS team"
          containerClass="mt-5 !text-blue-50"
        />

        <p className="mt-4 max-w-2xl font-circular-web text-base text-blue-50/60">
          We’re building practical, sustainable technology. Avalanche is our
          first product — and the start of a growing GENIUS ecosystem.
        </p>

        {/* Grid view */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((m, i) => (
            <div
              key={i}
              className="border-hsla rounded-lg bg-black/40 p-5 backdrop-blur cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setSelectedMember(m)}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white/5">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-general text-xl text-blue-50/70">
                    {getInitials(m.name)}
                  </span>
                </div>

                <img
                  src={m.image}
                  alt={m.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              <h3 className="mt-4 font-general text-sm uppercase">{m.name}</h3>
              <p className="mt-1 text-sm text-blue-50/60">
                {m.title?.trim() || "Title TBD"}
              </p>
            </div>
          ))}
        </div>

        {/* Expanded Detail View */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur"
            >
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative flex w-full max-w-4xl flex-col md:flex-row items-center gap-6 bg-black/70 p-6 rounded-lg"
              >
                {/* Image */}
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="h-64 w-full md:w-1/2 rounded-lg object-cover object-center"
                />

                {/* Description */}
                <div className="md:w-1/2 text-blue-50/90">
                  <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                  {selectedMember.title && (
                    <p className="mt-1 text-sm text-blue-50/60">
                      {selectedMember.title}
                    </p>
                  )}
                  <p className="mt-4">{selectedMember.description}</p>

                  <button
                    className="mt-6 rounded bg-yellow-400 px-4 py-2 font-bold text-black hover:bg-yellow-300"
                    onClick={() => setSelectedMember(null)}
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Team;
