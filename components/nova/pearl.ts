/* Nova — the v2 volumetric Pearl, ported for the web from
   social_agent/skills/animate/elements/v2 (studio.js + actor.js). Same geometry, nacre
   material, gold freckles, star and face rig; the video stage is replaced by a transparent
   canvas and a small still-water plinth so she can live over any section of the site. */
import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const FACES = [
  "calm", "happy", "talking", "excited", "surprised", "thinking", "wink",
  "sleepy", "love", "listening", "oops", "shy", "sad",
] as const;
export type Face = (typeof FACES)[number];

type V3 = [number, number, number];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const mix = (a: number, b: number, x: number) => a + (b - a) * x;
const blink = (t: number) => 1 - 0.93 * Math.exp(-Math.pow(((t % 3.3) - 2.4) / 0.075, 2));
const wave = (t: number) => Math.sin(t * Math.PI * 2);

export type NovaScene = {
  setFace: (f: Face) => void;
  setAmp: (a: number) => void;
  look: (x: number, y: number) => void;
  hop: () => void;
  setPlinth: (visible: boolean) => void;
  frame: (t: number, still?: boolean) => void;
  resize: (w: number, h: number) => void;
  dispose: () => void;
};

export function createNova(canvas: HTMLCanvasElement): NovaScene {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
  scene.environmentIntensity = 0.7;

  const camera = new T.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 2.6, 9.2);
  camera.lookAt(0, 1.55, 0);

  const material = (color: string, props: T.MeshPhysicalMaterialParameters = {}) =>
    new T.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0, clearcoat: 0.65, clearcoatRoughness: 0.2, ...props });
  const gold = material("#C7A35A", { metalness: 0.86, roughness: 0.28 });
  const black = material("#031610", { roughness: 0.18, clearcoat: 1, metalness: 0.28 });
  const mesh = (geo: T.BufferGeometry, mat: T.Material, parent: T.Object3D) => {
    const m = new T.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };
  const sphere = (r: number, mat: T.Material, parent: T.Object3D) => mesh(new T.SphereGeometry(r, 64, 40), mat, parent);
  const tube = (pts: V3[], r: number) => new T.TubeGeometry(new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p))), 24, r, 6, false);
  const line = (pts: V3[], r: number, mat: T.Material, parent: T.Object3D) => { const m = mesh(tube(pts, r), mat, parent); m.userData.r = r; return m; };
  const setPath = (m: T.Mesh, pts: V3[]) => { m.geometry.dispose(); m.geometry = tube(pts, m.userData.r); };

  scene.add(new T.HemisphereLight("#ffffff", "#2a4a3c", 0.55));
  const key = new T.DirectionalLight("#fff5df", 2.6); key.position.set(-3, 7, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 4; key.shadow.bias = -0.0001; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
  scene.add(key);
  const rim = new T.DirectionalLight("#7dffd0", 2.2); rim.position.set(4, 4, -4); scene.add(rim);
  const fill = new T.DirectionalLight("#ffffff", 0.5); fill.position.set(2, 3, 6); scene.add(fill);

  /* Still-water plinth: pale nacre disc, gold rim, concentric ripples. */
  const stage = new T.Group(); scene.add(stage);
  const plinth = new T.Group(); stage.add(plinth);
  const cyl = (r: number, h: number, mat: T.Material) => mesh(new T.CylinderGeometry(r, r, h, 128), mat, plinth);
  cyl(2.05, 0.16, material("#e1dfce", { metalness: 0.15, roughness: 0.4 })).position.y = 0.02;
  const water = cyl(1.99, 0.02, material("#aad5c0", { metalness: 0.28, roughness: 0.12, clearcoat: 1 })); water.position.y = 0.11;
  const torus = (r: number, t: number, mat: T.Material) => { const m = mesh(new T.TorusGeometry(r, t, 12, 128), mat, plinth); m.rotation.x = -Math.PI / 2; return m; };
  torus(2.04, 0.018, gold).position.y = 0.1;
  const ripples = Array.from({ length: 5 }, (_, i) => { const r = torus(0.45 + i * 0.3, 0.011, material("#d2ecda", { metalness: 0.3, roughness: 0.15, transparent: true, opacity: 0.9 })); r.position.y = 0.13; return r; });

  /* The Pearl. */
  const character = new T.Group(); stage.add(character);
  const body = new T.Group(); body.position.y = 1.78; character.add(body);
  const nacre = material("#eee3cd", { metalness: 0.16, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.14, iridescence: 0.45, iridescenceIOR: 1.32, iridescenceThicknessRange: [120, 360] });
  sphere(1.22, nacre, body).scale.y = 1.035;
  const face = new T.Group(); body.add(face);
  const pos = (x: number, y: number, z = 0): V3 => [x, y, Math.sqrt(Math.max(0.1, 1.22 ** 2 - x * x - y * y)) + z];
  const surface = (x: number, y: number): V3 => [x, y, Math.sqrt(Math.max(0.1, 1.22 ** 2 - x * x - y * y)) + 0.037];
  const eyes: T.Group[] = [];
  for (const x of [-0.38, 0.38]) {
    const pivot = new T.Group(); pivot.position.set(...pos(x, 0.16, 0.026)); face.add(pivot);
    sphere(0.098, black, pivot).scale.set(1, 1.35, 0.46);
    const sparkle = sphere(0.023, material("#ffffff", { roughness: 0.12 }), pivot); sparkle.position.set(-0.019, 0.032, 0.037); sparkle.scale.z = 0.4;
    eyes.push(pivot);
    for (let j = 0; j < 3; j++) {
      const dot = sphere(0.023 - j * 0.002, gold, face);
      dot.position.set(...pos(x + Math.sign(x) * (0.09 + 0.063 * j), -0.12 + (j % 2) * 0.032, 0.012)); dot.scale.z = 0.35;
    }
    const cheek = sphere(0.102, material("#e6b895", { transparent: true, opacity: 0.2, roughness: 0.5 }), face);
    cheek.position.set(...pos(x + Math.sign(x) * 0.09, -0.12, 0.002)); cheek.scale.set(1.15, 0.55, 0.09);
  }
  const s = new T.Shape(); [[0, 0.14], [0.034, 0.035], [0.13, 0], [0.034, -0.035], [0, -0.14], [-0.034, -0.035], [-0.13, 0], [-0.034, 0.035]].forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  const starGeo = new T.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 4 }); starGeo.translate(0, 0, -0.02);
  const star = mesh(starGeo, gold, body); star.position.set(0.99, 0.88, 0.28); star.rotation.z = -0.18;

  const shadowCanvas = document.createElement("canvas"); shadowCanvas.width = shadowCanvas.height = 128;
  const sc = shadowCanvas.getContext("2d")!; const g = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(4,40,28,.5)"); g.addColorStop(0.45, "rgba(4,40,28,.22)"); g.addColorStop(1, "rgba(4,40,28,0)"); sc.fillStyle = g; sc.fillRect(0, 0, 128, 128);
  const shadow = mesh(new T.PlaneGeometry(2.6, 2.6), new T.MeshBasicMaterial({ map: new T.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }), stage);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.14; shadow.castShadow = false;

  /* Face rig (actor.js light branch). */
  const path = (r = 0.024) => line([[0, 0, 1], [0.05, 0, 1], [0.1, 0, 1]], r, black, face);
  const lids = [path(), path()];
  const mouthLine = path();
  const brows = [path(0.016), path(0.016)];
  const hearts = [-0.38, 0.38].map((x) => {
    const h = new T.Shape(); h.moveTo(0, -0.1); h.bezierCurveTo(-0.23, 0.06, -0.1, 0.19, 0, 0.08); h.bezierCurveTo(0.1, 0.19, 0.23, 0.06, 0, -0.1);
    const m = mesh(new T.ShapeGeometry(h), material("#008f64"), face); m.position.set(x, 0.16, 1.2); return m;
  });
  const tear = sphere(0.05, material("#77cbbb", { metalness: 0.2, roughness: 0.1 }), face); tear.position.set(0.52, -0.03, 1.12); tear.scale.set(0.6, 1.65, 0.3);
  const openMouth = sphere(0.11, black, face); openMouth.position.set(0, -0.31, 1.203); openMouth.scale.set(1, 0.6, 0.1);

  let lastKey = "";
  function pearlFace(name: Face, t: number, e: number, amp: number) {
    const happy = name === "happy" || name === "excited" || name === "shy";
    const sleep = name === "sleepy" || name === "calm";
    eyes.forEach((eye, i) => {
      const close = happy || sleep || (name === "wink" && i === 1);
      eye.scale.y = blink(t + i * 0.012) * (1 - e * (close ? 0.96 : name === "surprised" ? -0.3 : name === "sad" ? 0.25 : 0));
      eye.position.x = (i ? 1 : -1) * 0.38 + (name === "thinking" ? e * 0.075 : 0);
      eye.visible = !(name === "love" && e > 0.5);
    });
    const talkOpen = name === "talking" ? 0.3 + 0.65 * Math.abs(wave(t * 2.2)) : 0;
    const open = ["talking", "surprised", "excited", "sleepy"].includes(name) || amp > 0.045;
    openMouth.visible = open && e > 0.05;
    const mh = amp > 0.045 ? 0.15 + amp * 0.85 : mix(0.06, name === "talking" ? talkOpen : name === "surprised" ? 1.35 : 0.8, e);
    openMouth.scale.set(name === "excited" ? 1.4 : name === "sleepy" ? 0.38 : 1, name === "sleepy" ? 0.42 : mh, 0.15);
    mouthLine.visible = !open || e < 0.5;
    tear.visible = name === "sad" && e > 0.3; tear.position.y = -0.03 - 0.09 * e;
    hearts.forEach((h) => (h.visible = name === "love" && e > 0.5));

    /* Tube paths only rebuild when the expression or its blend actually changes. */
    const k = `${name}:${e.toFixed(2)}`;
    if (k === lastKey) return;
    lastKey = k;
    lids.forEach((lid, i) => {
      const close = happy || sleep || (name === "wink" && i === 1);
      const cx = (i ? 1 : -1) * 0.38, y = 0.16, kk = happy ? 0.11 : sleep ? -0.026 : 0.07;
      lid.visible = close && e > 0.08; lid.scale.y = e;
      setPath(lid, [surface(cx - 0.11, y), surface(cx, y + kk), surface(cx + 0.11, y)]);
      const b = brows[i];
      b.visible = ["sad", "surprised", "thinking", "oops"].includes(name) && e > 0.1;
      const by = name === "surprised" ? 0.42 : 0.35, tilt = name === "sad" ? (i ? -0.06 : 0.06) : name === "thinking" ? (i ? 0.03 : 0) : 0;
      setPath(b, [surface(cx - 0.12, by - tilt), surface(cx, by + 0.02), surface(cx + 0.12, by + tilt)]);
    });
    const sad = name === "sad", depth = sad ? 0.13 : name === "happy" || name === "love" ? 0.13 : 0.055;
    const w = name === "shy" ? 0.08 : name === "thinking" ? 0.1 : 0.14;
    if (name === "oops") setPath(mouthLine, [surface(-0.17, -0.31), surface(-0.08, -0.27), surface(0, -0.33), surface(0.08, -0.27), surface(0.17, -0.31)]);
    else setPath(mouthLine, [surface(-w, -0.29), surface(0, -0.29 + (sad ? 1 : -1) * mix(0.055, depth, e)), surface(w, -0.29 + (name === "thinking" ? e * 0.045 : 0))]);
  }

  /* State driven from outside. */
  let current: Face = "listening", faceAt = 0, amp = 0, hopAt = -10, plinthOn = true, plinthK = 1, now = 0, last = 0;
  const lookTarget = new T.Vector2(), lookNow = new T.Vector2();

  /* still = prefers-reduced-motion: expressions still change, idle drift and hops do not. */
  function frame(t: number, still = false) {
    /* time-based easing, so throttled or high-refresh displays behave the same */
    const dt = Math.min(0.1, Math.max(0, t - last)); last = now = t;
    const m = still ? 0 : 1;
    const e = smooth((t - faceAt) / 0.35);
    lookNow.lerp(lookTarget, 1 - Math.exp(-dt * 4));
    character.rotation.y = -0.13 + m * 0.06 * Math.sin(t * 0.7) + lookNow.x * 0.45;
    body.position.set(0, 1.78 + m * 0.035 * Math.sin(t * 2.3), 0);
    body.rotation.set(-lookNow.y * 0.18, 0, m * 0.018 * Math.sin(t * 1.3));
    body.scale.set(1, 1 + 0.006 * Math.sin(t * 2.3), 1);
    star.rotation.y = 0.2 * Math.sin(t * 1.7);

    if (current === "thinking" || current === "listening" || current === "shy") body.rotation.z = e * (current === "thinking" ? -0.13 : current === "shy" ? -0.12 : 0.09);
    if (current === "happy") body.position.y += 0.03 * Math.sin(t * 6) * e;
    if (current === "excited") body.position.y += 0.14 * Math.abs(wave(t * 0.85)) * e;
    if (current === "sad" || current === "sleepy") body.position.y -= 0.13 * e;
    if (current === "love") body.rotation.z = 0.07 * Math.sin(t * 2.5) * e;
    if (current === "oops") body.rotation.z = 0.055 * Math.sin(t * 13) * e;
    if (current === "surprised") body.position.y += 0.12 * e;

    const q = t - hopAt;
    const lift = m && q > 0.15 && q < 1.05 ? Math.sin(((q - 0.15) / 0.9) * Math.PI) : 0;
    body.position.y += 0.42 * lift; body.scale.x *= 1 - 0.08 * lift; body.scale.y *= 1 + 0.1 * lift;
    shadow.scale.setScalar(1 - 0.35 * lift);
    ripples.forEach((r, i) => { const k = ((t * 0.35 + i / 5) % 1); r.scale.setScalar(0.8 + k * 0.5); (r.material as T.MeshPhysicalMaterial).opacity = 0.9 * (1 - k); });

    plinthK += ((plinthOn ? 1 : 0) - plinthK) * (1 - Math.exp(-dt * 6));
    plinth.scale.setScalar(Math.max(0.001, plinthK)); plinth.visible = plinthK > 0.01;
    shadow.visible = plinth.visible;

    pearlFace(current, t, e, amp);
    renderer.render(scene, camera);
  }

  return {
    setFace: (f) => { if (f !== current) { current = f; faceAt = now; lastKey = ""; } },
    setAmp: (a) => { amp = a; },
    look: (x, y) => lookTarget.set(x, y),
    hop: () => { hopAt = now; },
    setPlinth: (v) => { plinthOn = v; },
    frame,
    resize: (w, h) => { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
    dispose: () => {
      scene.traverse((o) => { const m = o as T.Mesh; if (m.geometry) m.geometry.dispose(); });
      pmrem.dispose(); renderer.dispose();
    },
  };
}
