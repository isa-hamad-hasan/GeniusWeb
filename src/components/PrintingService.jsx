import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const PrintingService = () => {
  return (
    <section
      id="printing"
      className="bg-black text-white px-6 md:px-16 py-28 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — text */}
          <div>
            <p className="text-yellow-300 uppercase tracking-[0.4em] text-xs mb-4">
              Manufacturing
            </p>
            <h2 className="text-5xl md:text-6xl font-bold leading-none tracking-tight mb-6">
              Custom 3D
              <br />
              Printing
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Beyond our products, GENIUS offers custom 3D printing and
              prototyping services. Whether it's a one-off part, a full
              prototype, or a manufacturing run — we can build it. Reach out
              directly to discuss your project.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="https://wa.me/97300000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-bold text-white hover:scale-105 hover:bg-green-400 transition"
              >
                <FaWhatsapp size={18} />
                WhatsApp Us
              </a>
              <a
                href="mailto:genius@example.com?subject=3D Printing Request"
                className="flex items-center gap-2 rounded-full border border-yellow-300/60 px-7 py-3.5 text-sm font-semibold text-yellow-300 hover:bg-yellow-300 hover:text-black transition"
              >
                <FaEnvelope size={16} />
                Email Us
              </a>
            </div>
          </div>

          {/* RIGHT — feature tiles */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Custom Parts",
                desc: "Precision-made to your exact specifications.",
              },
              {
                label: "Prototyping",
                desc: "From concept to physical prototype, fast.",
              },
              {
                label: "Small Runs",
                desc: "Low-volume manufacturing without the overhead.",
              },
              {
                label: "Collaboration",
                desc: "Work with our team from design to delivery.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-yellow-300/40 transition duration-300"
              >
                <h4 className="text-base font-bold mb-2">{item.label}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrintingService;
