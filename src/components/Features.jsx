import { useState, useEffect } from "react";
import { FaWhatsapp, FaEnvelope, FaCube } from "react-icons/fa";
import ModelViewer from "./ModelViewer";
import ManufacturingModal from "./ManufacturingModal";
import { supabase } from "../lib/supabase";

const Features = () => {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  // Fallback while loading
  if (loading)
    return (
      <section
        id="products"
        className="bg-black py-28 flex items-center justify-center min-h-[400px]"
      >
        <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
      </section>
    );

  return (
    <>
      <section
        id="products"
        className="relative overflow-hidden bg-black py-28"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* HEADER */}
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-4">
                Products
              </p>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
                Built For
                <br />
                <span className="text-yellow-300">Real Impact</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm md:text-right">
              Every product by Genius combines innovation, functionality, and
              scalable engineering designed for real-world challenges.
            </p>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.id}
                onClick={() => item.available && setActiveProduct(item)}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border bg-neutral-900 transition duration-500 hover:-translate-y-2 ${
                  item.available
                    ? "border-white/10 hover:border-yellow-300/60"
                    : "border-neutral-800/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="relative h-[400px] overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-800 flex items-center justify-center text-gray-600">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  {item.available && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <span className="text-xs bg-yellow-300 text-black font-bold px-3 py-1 rounded-full tracking-wide">
                        View
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-yellow-300 text-sm font-medium">
                      {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Coming soon placeholders if less than 3 products */}
            {Array.from({ length: Math.max(0, 3 - products.length) }).map(
              (_, i) => (
                <div
                  key={`soon-${i}`}
                  className="rounded-3xl border border-neutral-800/50 bg-neutral-900 opacity-50"
                >
                  <div className="relative h-[400px] flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Coming Soon
                      </h3>
                      <p className="mt-1 text-yellow-300 text-sm font-medium">
                        TBA
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* MANUFACTURING CALLOUT */}
          <div className="mt-20 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-yellow-400/5 blur-[80px] pointer-events-none" />
            <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-yellow-400/5 blur-[60px] pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-10 md:p-14">
                <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-6">
                  Manufacturing Services
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white leading-none mb-5">
                  Custom 3D
                  <br />
                  <span className="text-yellow-300">Printing</span>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                  Need a prototype, replacement component, or a small production
                  run? We bring your designs to life — fast, precise, and
                  affordable.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Custom Parts",
                    "Rapid Prototyping",
                    "Small Runs",
                    "Collaboration",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 bg-neutral-800/60 rounded-2xl px-4 py-3 border border-neutral-700/50"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />
                      <span className="text-white text-sm font-medium">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-neutral-800 p-10 md:p-14 flex flex-col justify-center gap-5">
                <div>
                  <p className="text-white font-bold text-xl mb-1">
                    Ready to build?
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Browse our parts catalogue, configure your order, and send
                    it to us in one click.
                  </p>
                </div>
                <button
                  onClick={() => setShowPartsModal(true)}
                  className="w-full rounded-full bg-yellow-300 py-4 text-black font-bold text-sm hover:bg-yellow-200 hover:scale-105 transition"
                >
                  Explore Manufacturing →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPartsModal && (
        <ManufacturingModal onClose={() => setShowPartsModal(false)} />
      )}

      {/* PRODUCT MODAL */}
      {activeProduct && !show3D && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[280px] md:h-full min-h-[400px]">
              {activeProduct.image_url ? (
                <img
                  src={activeProduct.image_url}
                  alt={activeProduct.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/40" />
            </div>

            <div className="flex flex-col justify-center p-10 md:p-14">
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                ✕
              </button>
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-yellow-300">
                Genius Product
              </p>
              <h2 className="text-4xl font-bold text-white mb-2">
                {activeProduct.name}
              </h2>
              <p className="text-2xl font-bold text-yellow-300 mb-4">
                {activeProduct.price}
              </p>
              <p className="text-sm leading-relaxed text-gray-400 mb-6">
                {activeProduct.description}
              </p>

              {activeProduct.has_3d && (
                <button
                  onClick={() => setShow3D(true)}
                  className="flex items-center gap-2 w-fit mb-6 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:border-yellow-300 hover:text-yellow-300 transition"
                >
                  <FaCube size={14} />
                  View in 3D
                </button>
              )}

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                  To purchase, contact us:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/97300000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white hover:scale-105 hover:bg-green-400 transition"
                  >
                    <FaWhatsapp size={16} />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:genius.co.313@gmail.com?subject=Purchase Request - ${activeProduct.name}`}
                    className="flex items-center gap-2 rounded-full border border-yellow-300/60 px-6 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-300 hover:text-black transition"
                  >
                    <FaEnvelope size={14} />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {show3D && activeProduct && (
        <ModelViewer
          productName={activeProduct.name}
          modelUrl={activeProduct.model_url || null}
          onClose={() => setShow3D(false)}
        />
      )}
    </>
  );
};

export default Features;
