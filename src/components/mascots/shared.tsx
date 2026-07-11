import { useEffect, useRef } from "react";
import * as THREE from "three";

export type MascotVariant = "kio" | "perry";
export type MascotSelection = MascotVariant | "all";
export type ExpressionMode = "calm" | "mischief" | "laugh" | "angry";

export type MascotRig = {
  mascot: THREE.Group;
  updateVisuals: (
    time: number,
    pointer: THREE.Vector2,
    hover: boolean,
    expressionMode: ExpressionMode,
    blink: number,
    specialProgress: number
  ) => void;
  dispose: () => void;
};

export type MascotStageConfig = {
  label: string;
  cameraY: number;
  cameraZ: number;
  ambientIntensity: number;
  rimColor: number;
  idleFollowX: number;
  idleFollowY: number;
  idleBob: number;
  rotationZ: number;
  meowYOffset: number;
  angryAction?: "meow" | "cartwheelPunch";
  specialDurationMs?: number;
  createRig: (root: THREE.Group) => MascotRig;
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const createFourPointStar = (outerRadius: number, innerRadius: number) => {
  const shape = new THREE.Shape();

  for (let index = 0; index < 8; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (index === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return shape;
};

export const createSmileCurve = () =>
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.12, 0),
    new THREE.Vector3(-0.24, -0.22, 0),
    new THREE.Vector3(0.02, -0.28, 0),
    new THREE.Vector3(0.18, -0.18, 0),
    new THREE.Vector3(0.34, 0.02, 0),
  ]);

export const createFrownCurve = () =>
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.32, -0.08, 0),
    new THREE.Vector3(-0.18, 0.05, 0),
    new THREE.Vector3(0.03, 0.1, 0),
    new THREE.Vector3(0.2, 0.04, 0),
    new THREE.Vector3(0.34, -0.1, 0),
  ]);

export const addStroke = (group: THREE.Group, material: THREE.Material, x: number, y: number, width: number, height: number) => {
  const stroke = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.16), material);
  stroke.position.set(x, y, 0);
  group.add(stroke);
};

export const createMeowText = (material: THREE.Material) => {
  const textGroup = new THREE.Group();
  const letterWidth = 0.9;
  const spacing = 1.08;

  const createLetterGroup = (offsetX: number) => {
    const letter = new THREE.Group();
    letter.position.x = offsetX;
    textGroup.add(letter);
    return letter;
  };

  const m = createLetterGroup(-spacing * 1.5);
  addStroke(m, material, -0.28, 0, 0.16, 0.9);
  addStroke(m, material, 0.28, 0, 0.16, 0.9);
  addStroke(m, material, -0.1, 0.1, 0.16, 0.66);
  addStroke(m, material, 0.1, 0.1, 0.16, 0.66);
  m.children[2].rotation.z = 0.42;
  m.children[3].rotation.z = -0.42;

  const e = createLetterGroup(-spacing * 0.5);
  addStroke(e, material, -0.28, 0, 0.16, 0.9);
  addStroke(e, material, 0, 0.36, letterWidth * 0.74, 0.14);
  addStroke(e, material, -0.04, 0, letterWidth * 0.64, 0.14);
  addStroke(e, material, 0, -0.36, letterWidth * 0.74, 0.14);

  const o = createLetterGroup(spacing * 0.5);
  addStroke(o, material, -0.28, 0, 0.16, 0.9);
  addStroke(o, material, 0.28, 0, 0.16, 0.9);
  addStroke(o, material, 0, 0.36, letterWidth * 0.74, 0.14);
  addStroke(o, material, 0, -0.36, letterWidth * 0.74, 0.14);

  const w = createLetterGroup(spacing * 1.5);
  addStroke(w, material, -0.3, 0, 0.16, 0.9);
  addStroke(w, material, 0.3, 0, 0.16, 0.9);
  addStroke(w, material, -0.1, -0.1, 0.16, 0.66);
  addStroke(w, material, 0.1, -0.1, 0.16, 0.66);
  w.children[2].rotation.z = -0.42;
  w.children[3].rotation.z = 0.42;

  return textGroup;
};

export function MascotStage({ config }: { config: MascotStageConfig }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, config.cameraY, config.cameraZ);

    const ambientLight = new THREE.AmbientLight(0xffefd9, config.ambientIntensity);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ea, 1.8);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(config.rimColor, 0.55);
    rimLight.position.set(-5, 1, 3);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffd9ab, 0.92, 24, 2);
    pointLight.position.set(0, 1.2, 5);
    scene.add(pointLight);

    const root = new THREE.Group();
    scene.add(root);

    const rig = config.createRig(root);

    const meowMaterial = new THREE.MeshPhysicalMaterial({
      color: "#7b4127",
      emissive: "#4f2413",
      emissiveIntensity: 0.16,
      roughness: 0.42,
      metalness: 0.06,
      clearcoat: 0.18,
      clearcoatRoughness: 0.2,
    });

    const meowGroup = createMeowText(meowMaterial);
    meowGroup.position.set(0, config.meowYOffset, 2.2);
    meowGroup.scale.setScalar(0.01);
    meowGroup.visible = false;
    root.add(meowGroup);

    const pointer = new THREE.Vector2(0, 0);
    let hover = false;
    let jumpUntil = 0;
    let blinkUntil = 0;
    let nextBlinkAt = performance.now() + 1700;
    let expressionUntil = 0;
    let expressionMode: ExpressionMode = "calm";
    let clickStreak = 0;
    let meowUntil = 0;
    let specialUntil = 0;
    let frame = 0;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
      hover = true;
    };

    const onPointerLeave = () => {
      hover = false;
      pointer.x = 0;
      pointer.y = 0;
    };

    const onClick = () => {
      clickStreak += 1;

      if (clickStreak >= 3) {
        jumpUntil = 0;
        expressionMode = "angry";
        expressionUntil = performance.now() + 3150;
        blinkUntil = performance.now() + 110;
        clickStreak = 0;

        if (config.angryAction === "cartwheelPunch") {
          specialUntil = performance.now() + (config.specialDurationMs ?? 1150);
        } else {
          meowUntil = performance.now() + 950;
          meowGroup.visible = true;
          meowGroup.scale.setScalar(0.18);
          meowGroup.position.set(0, config.meowYOffset + 0.06, 1.8);
        }
        return;
      }

      jumpUntil = performance.now() + 900;
      blinkUntil = performance.now() + 180;
      expressionMode = "laugh";
      expressionUntil = performance.now() + 1000;
    };

    const animate = (time: number) => {
      const bob = Math.sin(time * 0.0018) * config.idleBob;
      const followX = hover ? clamp(pointer.y * 0.4, -0.28, 0.28) : config.idleFollowX;
      const followY = hover ? clamp(pointer.x * 0.55, -0.42, 0.42) : config.idleFollowY;
      const specialActive = time < specialUntil;
      const specialDurationMs = config.specialDurationMs ?? 1150;
      const specialProgress = specialActive ? 1 - (specialUntil - time) / specialDurationMs : 0;

      rig.mascot.position.y = Math.sin(time * 0.0013) * 0.07 + bob;
      rig.mascot.position.z = 0;
      rig.mascot.rotation.x += (followX - rig.mascot.rotation.x) * 0.08;
      rig.mascot.rotation.y += (followY - rig.mascot.rotation.y) * 0.08;
      rig.mascot.rotation.z = Math.sin(time * 0.001) * config.rotationZ;

      if (specialActive && config.angryAction === "cartwheelPunch") {
        const burst = Math.sin(specialProgress * Math.PI);
        const forward = Math.sin(Math.min(specialProgress * 1.15, 1) * Math.PI);
        rig.mascot.position.x += Math.sin(specialProgress * Math.PI * 2) * 0.34;
        rig.mascot.position.y += burst * 0.5;
        rig.mascot.position.z += forward * 1.5;
        rig.mascot.rotation.z += specialProgress * Math.PI * 2.1;
        rig.mascot.rotation.y += burst * 0.35;
        rig.mascot.rotation.x -= burst * 0.22;
      }

      const jumping = time < jumpUntil;
      if (jumping && !specialActive) {
        const progress = 1 - (jumpUntil - time) / 900;
        rig.mascot.position.y += Math.sin(progress * Math.PI) * 0.95;
        rig.mascot.position.z += Math.sin(progress * Math.PI) * 0.78;
        rig.mascot.rotation.x -= Math.sin(progress * Math.PI) * 0.12;
      }

      const meowing = time < meowUntil;
      if (meowing) {
        const progress = 1 - (meowUntil - time) / 950;
        const eased = 1 - (1 - progress) * (1 - progress);
        meowGroup.visible = true;
        meowGroup.position.set(0, config.meowYOffset + 0.13 + progress * 0.2, 1.8 + eased * 5.2);
        meowGroup.scale.setScalar(0.18 + eased * 1.05);
        meowGroup.rotation.x = -0.08 + progress * 0.08;
      } else if (meowGroup.visible) {
        meowGroup.visible = false;
        meowGroup.scale.setScalar(0.01);
      }

      if (time >= nextBlinkAt) {
        blinkUntil = time + 140;
        nextBlinkAt = time + 2200 + Math.random() * 2400;
      }

      if (time > expressionUntil) {
        expressionMode = hover ? "mischief" : "calm";
        expressionUntil = time + 300;
      }

      const blink = time < blinkUntil ? 0.08 : 1;
      rig.updateVisuals(time, pointer, hover, expressionMode, blink, specialProgress);

      pointLight.intensity = hover ? 1.15 : 0.92;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    mount.appendChild(renderer.domElement);
    resize();
    frame = window.requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);
    mount.addEventListener("click", onClick);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      mount.removeEventListener("click", onClick);

      rig.dispose();
      meowMaterial.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [config]);

  return (
    <div className="relative overflow-hidden border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(255,244,219,0.85),_rgba(221,194,160,0.48)_44%,_rgba(117,67,39,0.18)_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/55 px-4 py-2 backdrop-blur-[2px]">
        <span className="folio-tag">{config.label}</span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary/80">independent</span>
      </div>
      <div ref={mountRef} className="aspect-[5/4] w-full cursor-pointer sm:aspect-[4/3]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-border/60 bg-card/80 px-4 py-3 backdrop-blur-[2px]">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.26em]">
          Hover to tilt / click to make {config.label} hop
        </p>
      </div>
    </div>
  );
}
