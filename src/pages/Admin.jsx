import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ── Upload helpers ────────────────────────────────────────
const uploadFile = async (file, bucket = "images") => {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// ── Reusable components ───────────────────────────────────
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </label>
    )}
    <input
      {...props}
      className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-300/60 placeholder-gray-600"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </label>
    )}
    <textarea
      {...props}
      className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-300/60 placeholder-gray-600 resize-none"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${checked ? "bg-yellow-300" : "bg-neutral-700"}`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

const FileUpload = ({ label, current, accept, onUpload, uploading, hint }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    {current && accept === "image/*" && (
      <img
        src={current}
        alt=""
        className="w-24 h-24 object-cover rounded-xl border border-neutral-700"
      />
    )}
    {current && accept === ".glb,.gltf" && (
      <div className="flex items-center gap-2 bg-neutral-800 border border-green-500/30 rounded-xl px-4 py-2.5 w-fit">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-green-400 text-xs font-medium">
          Model uploaded
        </span>
      </div>
    )}
    {hint && <p className="text-gray-600 text-xs">{hint}</p>}
    <label className="flex items-center gap-2 cursor-pointer w-fit">
      <div className="bg-neutral-800 border border-neutral-700 hover:border-yellow-300/50 rounded-xl px-4 py-2 text-sm text-gray-300 transition">
        {uploading
          ? "Uploading..."
          : current
            ? `Change ${label}`
            : `Upload ${label}`}
      </div>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={onUpload}
        disabled={uploading}
      />
    </label>
  </div>
);

const Btn = ({ children, variant = "primary", ...props }) => {
  const styles = {
    primary: "bg-yellow-300 text-black hover:bg-yellow-200",
    danger:
      "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white",
    ghost:
      "border border-neutral-700 text-gray-300 hover:border-white hover:text-white",
  };
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${styles[variant]} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-neutral-800">
      {title}
    </h2>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6">
      <a
        href="/"
        className="absolute top-8 left-8 text-gray-500 hover:text-yellow-300 transition text-sm"
      >
        ← Back to Website
      </a>
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-yellow-300 mb-2">
            Admin
          </p>
          <h1 className="text-4xl font-bold text-white">GENIUS</h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to manage content
          </p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@genius.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-yellow-300 text-black font-bold py-3 hover:bg-yellow-200 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// PRODUCTS MANAGER
// ─────────────────────────────────────────────────────────
const ProductsManager = () => {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    available: true,
    has_3d: false,
    image_url: "",
    model_url: "",
  };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [modelUploading, setModelUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at");
    setProducts(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const url = await uploadFile(file, "images");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
    setImgUploading(false);
  };

  const handleModel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModelUploading(true);
    try {
      const url = await uploadFile(file, "models");
      setForm((f) => ({ ...f, model_url: url }));
    } catch (err) {
      alert("Model upload failed: " + err.message);
    }
    setModelUploading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await supabase.from("products").update(form).eq("id", editing);
    else await supabase.from("products").insert(form);
    setForm(emptyForm);
    setEditing(null);
    await load();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    await load();
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price || "",
      available: p.available,
      has_3d: p.has_3d,
      image_url: p.image_url || "",
      model_url: p.model_url || "",
    });
  };

  return (
    <Section title="Products">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-5">
          {editing ? "Edit Product" : "Add New Product"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Avalanche"
          />
          <Input
            label="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="BD 200"
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Product description..."
          />
        </div>
        <div className="flex flex-wrap gap-6 mb-5">
          <Toggle
            label="Available for purchase"
            checked={form.available}
            onChange={(v) => setForm({ ...form, available: v })}
          />
          <Toggle
            label="Has 3D model"
            checked={form.has_3d}
            onChange={(v) => setForm({ ...form, has_3d: v })}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mb-5">
          <FileUpload
            label="Product Image"
            accept="image/*"
            current={form.image_url}
            onUpload={handleImage}
            uploading={imgUploading}
          />
          <FileUpload
            label="3D Model (.glb)"
            accept=".glb,.gltf"
            current={form.model_url}
            onUpload={handleModel}
            uploading={modelUploading}
            hint="Upload a .glb file to enable the 3D viewer. If none, a placeholder model will be shown."
          />
        </div>
        <div className="flex gap-3">
          <Btn onClick={save} disabled={saving || !form.name}>
            {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
          </Btn>
          {editing && (
            <Btn
              variant="ghost"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </Btn>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
          >
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-neutral-800 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{p.name}</p>
              <p className="text-yellow-300 text-sm">{p.price}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {p.available && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Available
                  </span>
                )}
                {p.has_3d && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    Has 3D toggle
                  </span>
                )}
                {p.model_url && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                    ✓ .glb uploaded
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Btn variant="ghost" onClick={() => startEdit(p)}>
                Edit
              </Btn>
              <Btn variant="danger" onClick={() => remove(p.id)}>
                Delete
              </Btn>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">
            No products yet.
          </p>
        )}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────
// PARTS MANAGER
// ─────────────────────────────────────────────────────────
const PartsManager = () => {
  const emptyForm = { name: "", description: "", image_url: "", model_url: "" };
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [modelUploading, setModelUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("parts")
      .select("*")
      .order("created_at");
    setParts(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const url = await uploadFile(file, "images");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
    setImgUploading(false);
  };

  const handleModel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModelUploading(true);
    try {
      const url = await uploadFile(file, "models");
      setForm((f) => ({ ...f, model_url: url }));
    } catch (err) {
      alert("Model upload failed: " + err.message);
    }
    setModelUploading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await supabase.from("parts").update(form).eq("id", editing);
    else await supabase.from("parts").insert(form);
    setForm(emptyForm);
    setEditing(null);
    await load();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this part?")) return;
    await supabase.from("parts").delete().eq("id", id);
    await load();
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      image_url: p.image_url || "",
      model_url: p.model_url || "",
    });
  };

  return (
    <Section title="3D Parts">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-5">
          {editing ? "Edit Part" : "Add New Part"}
        </h3>
        <Input
          label="Part Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Gear Housing"
        />
        <div className="mt-4 mb-4">
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Brief description..."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mb-5">
          <FileUpload
            label="Part Image"
            accept="image/*"
            current={form.image_url}
            onUpload={handleImage}
            uploading={imgUploading}
          />
          <FileUpload
            label="3D Model (.glb)"
            accept=".glb,.gltf"
            current={form.model_url}
            onUpload={handleModel}
            uploading={modelUploading}
            hint="Optional — lets customers preview the part in 3D."
          />
        </div>
        <div className="flex gap-3">
          <Btn onClick={save} disabled={saving || !form.name}>
            {saving ? "Saving..." : editing ? "Update Part" : "Add Part"}
          </Btn>
          {editing && (
            <Btn
              variant="ghost"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </Btn>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
          >
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-neutral-800 flex items-center justify-center text-gray-600 text-sm">
                No image
              </div>
            )}
            <div className="p-4">
              <p className="text-white font-semibold">{p.name}</p>
              {p.description && (
                <p className="text-gray-500 text-xs mt-1">{p.description}</p>
              )}
              {p.model_url && (
                <span className="inline-block mt-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                  ✓ .glb uploaded
                </span>
              )}
              <div className="flex gap-2 mt-3">
                <Btn variant="ghost" onClick={() => startEdit(p)}>
                  Edit
                </Btn>
                <Btn variant="danger" onClick={() => remove(p.id)}>
                  Delete
                </Btn>
              </div>
            </div>
          </div>
        ))}
        {parts.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8 col-span-3">
            No parts yet.
          </p>
        )}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────
// TEAM MANAGER
// ─────────────────────────────────────────────────────────
const TeamManager = () => {
  const emptyForm = {
    name: "",
    title: "",
    description: "",
    image_url: "",
    display_order: 0,
  };
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("team")
      .select("*")
      .order("display_order");
    setMembers(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "images");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await supabase.from("team").update(form).eq("id", editing);
    else await supabase.from("team").insert(form);
    setForm(emptyForm);
    setEditing(null);
    await load();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Remove this team member?")) return;
    await supabase.from("team").delete().eq("id", id);
    await load();
  };

  const startEdit = (m) => {
    setEditing(m.id);
    setForm({
      name: m.name,
      title: m.title || "",
      description: m.description || "",
      image_url: m.image_url || "",
      display_order: m.display_order || 0,
    });
  };

  return (
    <Section title="Team Members">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-5">
          {editing ? "Edit Member" : "Add Team Member"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ali Hussain"
          />
          <Input
            label="Title / Role"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="CEO"
          />
          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) =>
              setForm({ ...form, display_order: Number(e.target.value) })
            }
            placeholder="0"
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Brief bio..."
          />
        </div>
        <div className="mb-5">
          <FileUpload
            label="Photo"
            accept="image/*"
            current={form.image_url}
            onUpload={handleImage}
            uploading={uploading}
          />
        </div>
        <div className="flex gap-3">
          <Btn onClick={save} disabled={saving || !form.name}>
            {saving ? "Saving..." : editing ? "Update Member" : "Add Member"}
          </Btn>
          {editing && (
            <Btn
              variant="ghost"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </Btn>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
          >
            {m.image_url ? (
              <img
                src={m.image_url}
                alt={m.name}
                className="w-full h-40 object-cover object-center"
              />
            ) : (
              <div className="w-full h-40 bg-neutral-800 flex items-center justify-center text-2xl font-bold text-gray-600">
                {m.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
            <div className="p-4">
              <p className="text-white font-semibold">{m.name}</p>
              <p className="text-yellow-300 text-xs mt-0.5">
                {m.title || "No title"}
              </p>
              <div className="flex gap-2 mt-3">
                <Btn variant="ghost" onClick={() => startEdit(m)}>
                  Edit
                </Btn>
                <Btn variant="danger" onClick={() => remove(m.id)}>
                  Remove
                </Btn>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8 col-span-3">
            No team members yet.
          </p>
        )}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────
const SettingsManager = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "journey_video_url")
      .single()
      .then(({ data }) => {
        if (data) setVideoUrl(data.value);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase
      .from("settings")
      .upsert({ key: "journey_video_url", value: videoUrl });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Section title="Site Settings">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-xl">
        <h3 className="text-sm font-semibold text-gray-300 mb-5">
          Journey Video
        </h3>
        <Input
          label="Video URL or path"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="/videos/firstvideotest.mp4 or https://..."
        />
        <p className="text-gray-600 text-xs mt-2 mb-5">
          Enter a relative path or a full hosted URL.
        </p>
        <Btn onClick={save} disabled={saving}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Settings"}
        </Btn>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN ADMIN
// ─────────────────────────────────────────────────────────
const TABS = ["Products", "3D Parts", "Team", "Settings"];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Products");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!session)
    return (
      <Login
        onLogin={() =>
          supabase.auth
            .getSession()
            .then(({ data }) => setSession(data.session))
        }
      />
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-gray-500 hover:text-yellow-300 transition text-sm"
          >
            ← Site
          </a>
          <span className="text-neutral-700">/</span>
          <p className="text-sm font-bold text-white tracking-wider">
            GENIUS Admin
          </p>
        </div>
        <button
          onClick={signOut}
          className="text-xs text-gray-500 hover:text-red-400 transition"
        >
          Sign out
        </button>
      </div>

      <div className="border-b border-neutral-800 px-6">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3.5 text-sm font-medium transition border-b-2 -mb-px ${tab === t ? "border-yellow-300 text-yellow-300" : "border-transparent text-gray-500 hover:text-gray-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {tab === "Products" && <ProductsManager />}
        {tab === "3D Parts" && <PartsManager />}
        {tab === "Team" && <TeamManager />}
        {tab === "Settings" && <SettingsManager />}
      </div>
    </div>
  );
}
