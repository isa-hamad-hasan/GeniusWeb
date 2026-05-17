import { useState } from "react";
import PurchasePage from "./PurchasePage";

const products = [
  {
    id: "avalanche",
    name: "Avalanche",
    tagline: "Smart cooling for harsh environments.",
    description:
      "Avalanche is our flagship product — an advanced personal cooling system engineered for extreme outdoor heat. Built for durability, portability, and real-world impact.",
    price: "BD 120",
    available: true,
    img: "/img/products/Avalanche.jpg",
  },
  {
    id: "soon-1",
    name: "Coming Soon",
    tagline: "Next innovation in development.",
    description: "Our next product is currently being engineered.",
    price: "TBA",
    available: false,
    img: "/img/comingsoon.png",
  },
  {
    id: "soon-2",
    name: "Coming Soon",
    tagline: "More solutions on the way.",
    description: "Another next-generation solution is on the way.",
    price: "TBA",
    available: false,
    img: "/img/comingsoon.png",
  },
];

const Purchase = () => {
  const [purchaseProduct, setPurchaseProduct] = useState(null);

  return (
    <>
      <section
        id="purchase"
        className="min-h-screen bg-black text-white px-6 md:px-16 py-28"
      >
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-16">
            <p className="text-yellow-300 uppercase tracking-[0.4em] text-xs mb-4">
              Purchase
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tight">
                Build The
                <br />
                Future With Us
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Choose a product below to begin your purchase.
              </p>
            </div>
          </div>

          {/* PRODUCT CARD GRID */}
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`group relative overflow-hidden rounded-3xl border bg-neutral-900 flex flex-col transition duration-500 ${
                  product.available
                    ? "border-neutral-800 hover:border-yellow-300/60 hover:-translate-y-2"
                    : "border-neutral-800/50 opacity-50"
                }`}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`h-full w-full object-cover transition duration-700 ${
                      product.available ? "group-hover:scale-105" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/20 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        product.available
                          ? "bg-yellow-300 text-black"
                          : "bg-neutral-700 text-gray-400"
                      }`}
                    >
                      {product.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {product.available ? (
                      <button
                        onClick={() => setPurchaseProduct(product)}
                        className="w-full rounded-full bg-yellow-300 py-3 text-black text-sm font-bold tracking-wide hover:bg-yellow-200 hover:scale-105 transition"
                      >
                        Purchase →
                      </button>
                    ) : (
                      <div className="w-full rounded-full border border-neutral-700 py-3 text-center text-neutral-600 text-sm font-semibold">
                        Not Available Yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {purchaseProduct && (
        <PurchasePage
          product={purchaseProduct}
          onClose={() => setPurchaseProduct(null)}
        />
      )}
    </>
  );
};

export default Purchase;
