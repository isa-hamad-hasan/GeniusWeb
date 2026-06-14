import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";
import { supabase } from "../lib/supabase";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const Team = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("team")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        setMembers(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="team" className="w-screen bg-black py-24 text-blue-50">
      <div className="container mx-auto px-5 md:px-10">
        <AnimatedTitle
          title="Meet the <b>G</b>ENIUS team"
          containerClass="mt-5 !text-blue-50"
        />

        <p className="mt-4 max-w-2xl font-circular-web text-base text-blue-50/60">
          We're building practical, sustainable technology. Avalanche is our
          first product — and the start of a growing GENIUS ecosystem.
        </p>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:border-neutral-700"
              >
                {/* Image area — fixed height, no aspect-square to avoid compositing issues */}
                <div className="relative h-64 w-full bg-neutral-800">
                  {m.image_url ? (
                    <img
                      src={m.image_url}
                      alt={m.name}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-3xl font-bold text-neutral-600">
                        {getInitials(m.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-sm text-blue-50/50">
                    {m.title?.trim() || "Title TBD"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member detail modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex w-full max-w-3xl flex-col md:flex-row overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950"
              >
                {/* Image */}
                <div className="h-64 md:h-auto md:w-2/5 shrink-0 bg-neutral-800">
                  {selectedMember.image_url ? (
                    <img
                      src={selectedMember.image_url}
                      alt={selectedMember.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-neutral-600">
                      {getInitials(selectedMember.name)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center p-8 md:p-10">
                  {/* Close */}
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm"
                  >
                    ✕
                  </button>

                  <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-3">
                    GENIUS Team
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedMember.name}
                  </h2>
                  {selectedMember.title && (
                    <p className="mt-1 text-sm text-blue-50/50">
                      {selectedMember.title}
                    </p>
                  )}
                  <p className="mt-5 text-sm leading-relaxed text-gray-400">
                    {selectedMember.description}
                  </p>
                  <button
                    className="mt-8 w-fit rounded-full bg-yellow-300 px-6 py-2.5 text-sm font-bold text-black hover:bg-yellow-200 transition"
                    onClick={() => setSelected(null)}
                  >
                    Close
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
