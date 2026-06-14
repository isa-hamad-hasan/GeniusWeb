import { useEffect, useRef, useState } from "react";

const ModelViewer = ({ productName, modelUrl, onClose }) => {
  const mountRef = useRef(null);
  const animRef = useRef(null);
  const [hint, setHint] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const hide = () => setHint(false);
    window.addEventListener("mousedown", hide, { once: true });
    window.addEventListener("touchstart", hide, { once: true });
  }, []);

  useEffect(() => {
    let THREE, GLTFLoader, renderer, scene, camera, group;

    const init = async () => {
      try {
        THREE = await import("three");
        const el = mountRef.current;
        if (!el) return;

        const w = el.clientWidth;
        const h = el.clientHeight;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d0d0d);

        camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.set(0, 2.0, 7.5);
        camera.lookAt(0, 1.5, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        el.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const key = new THREE.DirectionalLight(0xfff8e8, 3.5);
        key.position.set(4, 8, 5);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 0.1;
        key.shadow.camera.far = 30;
        key.shadow.camera.left = -5;
        key.shadow.camera.right = 5;
        key.shadow.camera.top = 8;
        key.shadow.camera.bottom = -2;
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xb0d4ff, 1.2);
        fill.position.set(-5, 3, 2);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xd4f700, 1.8);
        rim.position.set(0, 3, -6);
        scene.add(rim);
        const spot = new THREE.SpotLight(0xffffff, 5, 25, Math.PI / 5, 0.5, 1);
        spot.position.set(0, 10, 4);
        spot.target.position.set(0, 1.5, 0);
        scene.add(spot);
        scene.add(spot.target);

        // ── Load real GLB or fall back to placeholder ──────
        if (modelUrl) {
          const { GLTFLoader: Loader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );
          GLTFLoader = Loader;
          const loader = new GLTFLoader();
          group = await new Promise((resolve, reject) => {
            loader.load(
              modelUrl,
              (gltf) => {
                const model = gltf.scene;
                // Auto-center and scale
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                model.scale.setScalar(scale);
                model.position.sub(center.multiplyScalar(scale));
                model.position.y += size.y * scale * 0.5;
                model.traverse((n) => {
                  if (n.isMesh) {
                    n.castShadow = true;
                    n.receiveShadow = true;
                  }
                });
                resolve(model);
              },
              undefined,
              reject,
            );
          });
        } else {
          // ── Placeholder model ────────────────────────────
          group = buildPlaceholder(THREE);
        }

        scene.add(group);

        // Ground
        const groundMat = new THREE.MeshStandardMaterial({
          color: 0x141414,
          metalness: 0.2,
          roughness: 0.9,
        });
        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(6, 80),
          groundMat,
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        const outer = new THREE.Mesh(
          new THREE.RingGeometry(6, 14, 80),
          new THREE.MeshBasicMaterial({ color: 0x0d0d0d }),
        );
        outer.rotation.x = -Math.PI / 2;
        outer.position.y = -0.001;
        scene.add(outer);
        const glow = new THREE.Mesh(
          new THREE.CircleGeometry(1.2, 64),
          new THREE.MeshBasicMaterial({
            color: 0xd4f700,
            transparent: true,
            opacity: 0.06,
          }),
        );
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = 0.002;
        scene.add(glow);

        setLoading(false);

        // ── Orbit controls ───────────────────────────────
        let radius = 7.5,
          polar = Math.PI / 2.8,
          azimuth = -0.3,
          autoSpin = true;
        const minRadius = 3.5,
          maxRadius = 14;

        const updateCamera = () => {
          camera.position.set(
            radius * Math.sin(polar) * Math.sin(azimuth),
            radius * Math.cos(polar) + 1.5,
            radius * Math.sin(polar) * Math.cos(azimuth),
          );
          camera.lookAt(0, 1.5, 0);
        };
        updateCamera();

        let isDragging = false,
          lastX = 0,
          lastY = 0;
        const onDown = (x, y) => {
          isDragging = true;
          lastX = x;
          lastY = y;
          autoSpin = false;
        };
        const onMove = (x, y) => {
          if (!isDragging) return;
          azimuth -= (x - lastX) * 0.007;
          polar = Math.max(
            0.2,
            Math.min(Math.PI / 2 + 0.3, polar + (y - lastY) * 0.005),
          );
          lastX = x;
          lastY = y;
          updateCamera();
        };
        const onUp = () => {
          isDragging = false;
        };
        const onWheel = (e) => {
          e.preventDefault();
          radius = Math.max(
            minRadius,
            Math.min(maxRadius, radius + e.deltaY * 0.01),
          );
          updateCamera();
        };

        let lastPinch = null;
        const onTouchMove = (e) => {
          if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (lastPinch !== null) {
              radius = Math.max(
                minRadius,
                Math.min(maxRadius, radius - (dist - lastPinch) * 0.02),
              );
              updateCamera();
            }
            lastPinch = dist;
          } else {
            lastPinch = null;
            onMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        };

        el.addEventListener("mousedown", (e) => onDown(e.clientX, e.clientY));
        window.addEventListener("mousemove", (e) =>
          onMove(e.clientX, e.clientY),
        );
        window.addEventListener("mouseup", onUp);
        el.addEventListener("touchstart", (e) => {
          onDown(e.touches[0].clientX, e.touches[0].clientY);
          lastPinch = null;
        });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onUp);
        el.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", () => {
          if (!el || !renderer) return;
          camera.aspect = el.clientWidth / el.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(el.clientWidth, el.clientHeight);
        });

        const clock = new THREE.Clock();
        const animate = () => {
          animRef.current = requestAnimationFrame(animate);
          const t = clock.getElapsedTime();
          if (autoSpin) {
            azimuth += 0.003;
            updateCamera();
          }
          group.position.y = Math.sin(t * 0.6) * 0.025;
          renderer.render(scene, camera);
        };
        animate();
      } catch (err) {
        console.error("ModelViewer error:", err);
        setError("Failed to load 3D model.");
        setLoading(false);
      }
    };

    init();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (renderer) {
        renderer.dispose();
        const el = mountRef.current;
        if (el && renderer.domElement.parentNode === el)
          el.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: "#0d0d0d" }}
    >
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 pointer-events-none">
        <button
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-yellow-300 transition group bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2"
        >
          <span className="transition-transform group-hover:-translate-x-1 inline-block">
            ←
          </span>
          Back
        </button>

        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-300 leading-none mb-0.5">
            3D View
          </p>
          <p className="text-sm font-bold text-white leading-none">
            {productName}
          </p>
        </div>

        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 hidden sm:flex items-center gap-4 text-[11px] text-gray-500">
          <span>🖱 Drag — rotate</span>
          <span className="w-px h-3 bg-white/10" />
          <span>⚲ Scroll — zoom</span>
        </div>
      </div>

      {/* CANVAS */}
      <div
        ref={mountRef}
        className="flex-1 w-full cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d] z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading model...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              ← Go back
            </button>
          </div>
        </div>
      )}

      {/* Drag hint */}
      {hint && !loading && (
        <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none">
          <div className="flex flex-col items-center gap-2 animate-bounce opacity-40">
            <svg
              className="w-6 h-6 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
            <p className="text-xs text-gray-500 tracking-widest uppercase">
              Drag · Scroll to zoom
            </p>
          </div>
        </div>
      )}

      {/* Bottom status */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
          <p className="text-[11px] text-neutral-500">
            {modelUrl ? (
              "Real model"
            ) : (
              <span>
                Placeholder — upload a{" "}
                <span className="text-neutral-400">.glb</span> in Admin
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Placeholder Avalanche model ────────────────────────────
function buildPlaceholder(THREE) {
  const group = new THREE.Group();
  const box = (w, h, d, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const cyl = (rT, rB, h, seg, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    return m;
  };
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd5d5d5,
    metalness: 0.1,
    roughness: 0.5,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.3,
  });
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x2d6a2d,
    metalness: 0.0,
    roughness: 0.95,
  });
  const gDarkMat = new THREE.MeshStandardMaterial({
    color: 0x1b451b,
    metalness: 0.0,
    roughness: 1.0,
  });
  const grilleMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.3,
    roughness: 0.8,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xb5873a,
    metalness: 0.9,
    roughness: 0.2,
  });
  const pipeMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c0c,
    metalness: 0.85,
    roughness: 0.15,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.6,
    roughness: 0.4,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xd4f700,
    emissive: 0xd4f700,
    emissiveIntensity: 0.5,
    metalness: 0.1,
    roughness: 0.4,
  });

  group.add(box(1.05, 1.1, 0.95, bodyMat, 0, 0.55, 0));
  group.add(box(1.05, 0.85, 0.95, bodyMat, 0, 1.525, 0));
  group.add(box(1.07, 0.03, 0.97, darkMat, 0, 1.08, 0));
  group.add(box(0.13, 1.9, 0.97, grassMat, -0.59, 0.95, 0));
  group.add(box(0.13, 1.9, 0.97, grassMat, 0.59, 0.95, 0));
  group.add(box(0.03, 1.9, 0.97, gDarkMat, -0.52, 0.95, 0));
  group.add(box(0.03, 1.9, 0.97, gDarkMat, 0.52, 0.95, 0));
  group.add(box(0.28, 0.28, 0.03, darkMat, -0.18, 1.55, 0.49));
  group.add(box(0.72, 0.32, 0.03, grilleMat, 0, 0.38, 0.49));
  group.add(box(0.72, 0.18, 0.03, grilleMat, 0, 0.78, 0.49));
  for (let i = 0; i < 6; i++)
    group.add(box(0.72, 0.018, 0.04, darkMat, 0, 0.22 + i * 0.055, 0.5));
  [
    [-0.44, 1.92, 0.44],
    [0.44, 1.92, 0.44],
    [-0.44, 1.92, -0.44],
    [0.44, 1.92, -0.44],
    [-0.44, 0.06, 0.44],
    [0.44, 0.06, 0.44],
    [-0.44, 0.06, -0.44],
    [0.44, 0.06, -0.44],
    [-0.44, 1.06, 0.44],
    [0.44, 1.06, 0.44],
    [-0.44, 1.06, -0.44],
    [0.44, 1.06, -0.44],
  ].forEach(([x, y, z]) => group.add(box(0.07, 0.07, 0.07, brassMat, x, y, z)));
  group.add(cyl(0.18, 0.2, 0.18, 20, bodyMat, 0, 2.04, 0));
  group.add(cyl(0.16, 0.18, 0.9, 20, pipeMat, 0, 2.53, 0));
  group.add(cyl(0.19, 0.16, 0.06, 20, pipeMat, 0, 2.99, 0));
  [
    [-0.38, -0.38],
    [0.38, -0.38],
    [-0.38, 0.38],
    [0.38, 0.38],
  ].forEach(([x, z]) => {
    const wm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.07, 14),
      wheelMat,
    );
    wm.rotation.x = Math.PI / 2;
    wm.position.set(x, 0.04, z);
    wm.castShadow = true;
    group.add(wm);
    group.add(box(0.03, 0.03, 0.09, brassMat, x, 0.04, z));
  });
  group.add(cyl(0.025, 0.03, 0.12, 10, darkMat, -0.1, 0.1, 0.49));
  group.add(box(1.06, 0.04, 0.97, accentMat, 0, 1.95, 0));
  return group;
}

export default ModelViewer;
