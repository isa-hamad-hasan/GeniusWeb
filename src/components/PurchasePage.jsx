import { useEffect } from "react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const PurchasePage = ({ product, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white overflow-y-auto">
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-4 bg-black/90 backdrop-blur-md border-b border-neutral-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-300 transition group"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Products
        </button>
        <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 hidden sm:block">
          Genius — Purchase
        </p>
        <div className="w-32" />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT — product image */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 group">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-2">
              Featured Product
            </p>
            <h2 className="text-4xl font-bold">{product.name}</h2>
          </div>
        </div>

        {/* RIGHT — details */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-3">
              Genius Product
            </p>
            <h1 className="text-5xl font-bold tracking-tight leading-none mb-6">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price + CTA */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                  Price
                </p>
                <p className="text-4xl font-bold text-yellow-300">
                  {product.price}
                </p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-medium">
                In Stock
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              To place an order, reach out via WhatsApp for the fastest
              response, or send an email and we'll get back to you shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/97300000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-bold text-white hover:scale-105 hover:bg-green-400 transition"
              >
                <FaWhatsapp size={18} />
                Order via WhatsApp
              </a>
              <a
                href={`mailto:genius@example.com?subject=Purchase Request — ${product.name}&body=Hi GENIUS team, I'd like to purchase the ${product.name} (${product.price}).`}
                className="flex items-center justify-center gap-2 rounded-full border border-yellow-300/60 px-7 py-3.5 text-sm font-semibold text-yellow-300 hover:bg-yellow-300 hover:text-black transition"
              >
                <FaEnvelope size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-neutral-800 px-6 md:px-12 py-6 flex items-center justify-between flex-wrap gap-4">
        <p className="text-gray-600 text-xs tracking-wide">
          GENIUS © 2026 — Innovating through engineering, creativity, and
          relentless effort.
        </p>
        <button
          onClick={onClose}
          className="text-xs text-gray-600 hover:text-yellow-300 transition tracking-widest uppercase"
        >
          ← Back to Products
        </button>
      </div>
    </div>
  );
};

export default PurchasePage;
