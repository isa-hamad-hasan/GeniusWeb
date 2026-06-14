import {
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const SIZES = ["Small", "Medium", "Large", "Custom"];

export default function ManufacturingModal({ onClose }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState({});

  useEffect(() => {
    supabase
      .from("parts")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        setParts(data || []);
        setLoading(false);
      });
  }, []);

  const addToCart = (part) => {
    const size = sizes[part.id] || "Medium";
    const qty = Number(quantities[part.id] || 1);
    const key = `${part.id}-${size}`;
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + qty } : i,
        ),
      );
    } else {
      setCart([
        ...cart,
        { key, id: part.id, name: part.name, size, quantity: qty },
      ]);
    }
    setAdded((prev) => ({ ...prev, [part.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [part.id]: false })), 1200);
  };

  const removeFromCart = (key) => setCart(cart.filter((i) => i.key !== key));
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const sendEmail = () => {
    if (cart.length === 0) return;
    const lines = cart
      .map((i) => `• ${i.name} — Size: ${i.size}, Qty: ${i.quantity}`)
      .join("\n");
    const body = `Hi GENIUS team,\n\nI'd like to request the following 3D printed parts:\n\n${lines}${notes ? `\n\nAdditional notes:\n${notes}` : ""}`;
    window.location.href = `mailto:genius.co.313@gmail.com?subject=3D Manufacturing Request&body=${encodeURIComponent(body)}`;
  };

  const sendWhatsApp = () => {
    if (cart.length === 0) return;
    const lines = cart
      .map((i) => `• ${i.name} — Size: ${i.size}, Qty: ${i.quantity}`)
      .join("\n");
    const msg = `Hi GENIUS! I'd like to request:\n\n${lines}${notes ? `\n\nNotes: ${notes}` : ""}`;
    window.open(
      `https://wa.me/97300000000?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black overflow-y-auto text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-300 transition group"
          >
            <span className="transition-transform group-hover:-translate-x-1 inline-block">
              ←
            </span>
            Back
          </button>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${cart.length > 0 ? "border-yellow-300/50 bg-yellow-300/5" : "border-neutral-800"}`}
          >
            <FaShoppingCart
              size={13}
              className={cart.length > 0 ? "text-yellow-300" : "text-gray-600"}
            />
            <span
              className={`text-sm font-semibold ${cart.length > 0 ? "text-yellow-300" : "text-gray-600"}`}
            >
              {totalItems} {totalItems === 1 ? "item" : "items"} in basket
            </span>
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-14">
          <p className="text-yellow-300 uppercase tracking-[0.4em] text-xs mb-4">
            Manufacturing
          </p>
          <h1 className="text-6xl font-bold leading-none">
            Custom
            <br />
            <span className="text-yellow-300">3D Printing</span>
          </h1>
          <p className="text-gray-400 mt-5 max-w-lg text-sm leading-relaxed">
            Pick your parts, set size and quantity, add them to your basket,
            then send us the request in one click.
          </p>
        </div>

        {/* PARTS GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No parts available yet. Check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {parts.map((part) => (
              <div
                key={part.id}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col hover:border-neutral-700 transition duration-300"
              >
                <div className="h-44 bg-neutral-800 overflow-hidden">
                  {part.image_url ? (
                    <img
                      src={part.image_url}
                      alt={part.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      Image Coming Soon
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {part.name}
                    </h3>
                    {part.description && (
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {part.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs block mb-1.5">
                      Size
                    </label>
                    <select
                      value={sizes[part.id] || "Medium"}
                      onChange={(e) =>
                        setSizes({ ...sizes, [part.id]: e.target.value })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-300/50"
                    >
                      {SIZES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs block mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantities({
                            ...quantities,
                            [part.id]: Math.max(
                              1,
                              (quantities[part.id] || 1) - 1,
                            ),
                          })
                        }
                        className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 text-white hover:border-yellow-300/50 transition flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-white font-semibold">
                        {quantities[part.id] || 1}
                      </span>
                      <button
                        onClick={() =>
                          setQuantities({
                            ...quantities,
                            [part.id]: (quantities[part.id] || 1) + 1,
                          })
                        }
                        className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 text-white hover:border-yellow-300/50 transition flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(part)}
                    className={`mt-auto w-full rounded-full py-2.5 text-sm font-bold transition ${added[part.id] ? "bg-green-500 text-white scale-95" : "bg-yellow-300 text-black hover:bg-yellow-200 hover:scale-105"}`}
                  >
                    {added[part.id] ? "✓ Added!" : "Add to Basket"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BASKET */}
        <div className="mb-10 rounded-3xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <FaShoppingCart size={16} className="text-yellow-300" />
              <h2 className="text-white font-bold text-xl">Your Basket</h2>
              {cart.length > 0 && (
                <span className="bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1.5"
              >
                <FaTrash size={11} />
                Clear all
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-2xl">
                📦
              </div>
              <p className="text-gray-400 font-medium">Your basket is empty</p>
              <p className="text-gray-600 text-sm">
                Add parts above to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-8 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-sm">
                      🖨
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Size: <span className="text-gray-400">{item.size}</span>
                        &nbsp;·&nbsp;Qty:{" "}
                        <span className="text-yellow-300 font-semibold">
                          {item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-gray-500 flex items-center justify-center transition"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEND REQUEST */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-yellow-300 uppercase tracking-[0.4em] text-xs mb-4">
                Send Request
              </p>
              <h2 className="text-3xl font-bold mb-2">Ready to order?</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Add any extra notes — materials, colors, dimensions, or special
                requirements. Then send your basket via email or WhatsApp.
              </p>
              <textarea
                rows="5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. PLA material, black color, tolerances ±0.2mm..."
                className="w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-300/50 resize-none"
              />
            </div>

            <div className="flex flex-col gap-4 md:pt-10">
              {cart.length === 0 && (
                <div className="rounded-2xl border border-neutral-700 bg-neutral-800/50 px-5 py-4 text-sm text-gray-500 text-center">
                  Add items to your basket first
                </div>
              )}

              <button
                onClick={sendEmail}
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition ${cart.length === 0 ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" : "bg-yellow-300 text-black hover:bg-yellow-200 hover:scale-105"}`}
              >
                <FaEnvelope size={14} />
                Send Basket via Email
                {cart.length > 0 && (
                  <span className="ml-1 bg-black/20 text-black text-xs px-2 py-0.5 rounded-full">
                    {totalItems} items
                  </span>
                )}
              </button>

              <button
                onClick={sendWhatsApp}
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition ${cart.length === 0 ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-400 hover:scale-105"}`}
              >
                <FaWhatsapp size={16} />
                Send Basket via WhatsApp
              </button>

              <div className="border-t border-neutral-800 pt-4 mt-2">
                <p className="text-gray-600 text-xs text-center mb-3">
                  Or just reach out directly
                </p>
                <div className="flex gap-3">
                  <a
                    href="mailto:genius.co.313@gmail.com"
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border border-neutral-700 px-5 py-3 text-xs text-gray-400 hover:border-yellow-300/50 hover:text-yellow-300 transition"
                  >
                    <FaEnvelope size={12} />
                    Email
                  </a>
                  <a
                    href="https://wa.me/97300000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border border-neutral-700 px-5 py-3 text-xs text-gray-400 hover:border-green-500/50 hover:text-green-400 transition"
                  >
                    <FaWhatsapp size={12} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
