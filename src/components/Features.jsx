import { useState } from "react";

const data = [
  {
    product: "Avalanche",
    description:
      "Avalanche is our first product — designed for extreme outdoor heat with a focus on real impact and scalability.",
    img: "/img/products/Avalanche.jpg",
    price: "BD 120",
  },
  {
    product: "Coming Soon",
    description: "More innovative products are currently in development.",
    img: "/img/comingsoon.png",
    price: "TBA",
  },
  {
    product: "Coming Soon",
    description: "Next-generation solutions are on the way.",
    img: "/img/comingsoon.png",
    price: "TBA",
  },
];

const Features = () => {
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <section id="products" className="relative overflow-hidden bg-black py-28">
      {/* Ambient glow */}
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
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveProduct(item)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition duration-500 hover:-translate-y-2 hover:border-yellow-300/60"
            >
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.product}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-xs bg-yellow-300 text-black font-bold px-3 py-1 rounded-full tracking-wide">
                    View
                  </span>
                </div>

                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">
                    {item.product}
                  </h3>
                  <p className="mt-1 text-yellow-300 text-sm font-medium">
                    {item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[280px] md:h-full min-h-[400px]">
              <img
                src={activeProduct.img}
                alt={activeProduct.product}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/40" />
            </div>

            <div className="flex flex-col justify-center p-10 md:p-14">
              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-yellow-300">
                Genius Product
              </p>

              <h2 className="text-4xl font-bold text-white">
                {activeProduct.product}
              </h2>

              <p className="mt-5 text-base leading-relaxed text-gray-400">
                {activeProduct.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#purchase"
                  onClick={() => setActiveProduct(null)}
                  className="rounded-full bg-yellow-300 px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
                >
                  Purchase Product
                </a>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="rounded-full border border-white/20 px-7 py-3 text-sm text-white transition hover:border-yellow-300 hover:text-yellow-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Features;
