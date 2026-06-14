import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

/*
  DROP THIS COMPONENT INSIDE YOUR Contact.jsx
  Import it at the top: import PrintingCallout from "./PrintingCallout";
  Then place <PrintingCallout /> anywhere inside your Contact section JSX.
  It's a self-contained card — no props needed.
*/

const PrintingCallout = () => {
  return (
    <div className="mt-12 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* LEFT */}
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-3">
            Manufacturing
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Need Custom 3D Parts?
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Beyond our products, GENIUS offers custom 3D printing and
            prototyping services — one-off parts, full prototypes, or small
            manufacturing runs. Reach out to discuss your project.
          </p>
        </div>

        {/* RIGHT — CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="https://wa.me/97300000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-bold text-white hover:scale-105 hover:bg-green-400 transition"
          >
            <FaWhatsapp size={17} />
            WhatsApp Us
          </a>
          <a
            href="mailto:genius@example.com?subject=3D Printing Request"
            className="flex items-center justify-center gap-2 rounded-full border border-yellow-300/60 px-7 py-3.5 text-sm font-semibold text-yellow-300 hover:bg-yellow-300 hover:text-black transition"
          >
            <FaEnvelope size={15} />
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrintingCallout;
