import { useEffect, useRef } from "react";
import * as THREE from "three";

const CYCLE_DURATION_MS = 14_000;
const BURST_DURATION_MS = 420;
const SAFE_MARGIN_PX = 28;
const CLICK_BOOST_MS = 1_250;
const CLICK_BOOST_MULTIPLIER = 3.3;
const CLICK_HEAT_STEP = 0.12;
const DRIFT_MIN_INTERVAL_MS = 3_000;
const DRIFT_MAX_INTERVAL_MS = 5_000;

type Phase = "heating" | "bursting";

interface Viewport {
  width: number;
  height: number;
}

interface MotionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wobbleOffset: number;
  driftRetargetInMs: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const randomSign = () => (Math.random() > 0.5 ? 1 : -1);

const createStarShape = (outerRadius: number, innerRadius: number) => {
  const shape = new THREE.Shape();

  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
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

export function AmbientStar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hitTargetRef = useRef<HTMLButtonElement | null>(null);
  const clickBoostRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = mediaQuery.matches;
    let viewport: Viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewport.width, viewport.height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, viewport.width, viewport.height, 0, 0.1, 1000);
    camera.position.set(0, 0, 240);

    const ambientLight = new THREE.AmbientLight(0xf4ddbf, 1.05);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3df, 1.65);
    keyLight.position.set(-120, 160, 220);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb2472f, 0.55);
    rimLight.position.set(120, -80, 160);
    scene.add(rimLight);

    const starLight = new THREE.PointLight(0xfff3d0, 0.4, 220, 2);
    scene.add(starLight);

    const root = new THREE.Group();
    scene.add(root);

    const starGroup = new THREE.Group();
    root.add(starGroup);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#7f3e21"),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#fff8ef"),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fragmentMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#fff5df"),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#29130c"),
      emissive: new THREE.Color("#190a06"),
      emissiveIntensity: 0.2,
      metalness: 0.38,
      roughness: 0.24,
    });

    const glowMesh = new THREE.Mesh(new THREE.CircleGeometry(10, 40), glowMaterial);
    glowMesh.renderOrder = 1;
    starGroup.add(glowMesh);

    const starMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(createStarShape(1, 0.44), {
        depth: 0.62,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.12,
        bevelThickness: 0.11,
      }),
      starMaterial
    );
    starMesh.geometry.center();
    starMesh.renderOrder = 3;
    starGroup.add(starMesh);

    const flashMesh = new THREE.Mesh(new THREE.CircleGeometry(8, 32), flashMaterial);
    flashMesh.renderOrder = 4;
    flashMesh.position.z = -1;
    starGroup.add(flashMesh);

    const fragmentMeshes = Array.from({ length: 6 }, () => {
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), fragmentMaterial);
      mesh.renderOrder = 5;
      mesh.visible = false;
      starGroup.add(mesh);
      return mesh;
    });

    const motion: MotionState = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      wobbleOffset: randomBetween(0, Math.PI * 2),
      driftRetargetInMs: randomBetween(DRIFT_MIN_INTERVAL_MS, DRIFT_MAX_INTERVAL_MS),
    };

    let baseSize = 12;
    let hitTargetSize = 34;
    let phase: Phase = "heating";
    let heat = 0;
    let burstElapsed = 0;
    let animationFrame = 0;
    let lastFrameTime = performance.now();

    const syncHitTarget = () => {
      if (!hitTargetRef.current) return;
      hitTargetRef.current.style.transform = `translate(${motion.x - hitTargetSize / 2}px, ${motion.y - hitTargetSize / 2}px)`;
      hitTargetRef.current.style.width = `${hitTargetSize}px`;
      hitTargetRef.current.style.height = `${hitTargetSize}px`;
    };

    const randomVelocity = () => {
      const speed = reduceMotion ? randomBetween(4, 8) : randomBetween(18, 28);
      const angle = randomBetween(0, Math.PI * 2);
      motion.vx = Math.cos(angle) * speed;
      motion.vy = Math.sin(angle) * speed;
    };

    const updateSizing = () => {
      baseSize = clamp(Math.min(viewport.width, viewport.height) * 0.014, 8, 14);
      hitTargetSize = clamp(baseSize * 3, 28, 42);

      glowMesh.geometry.dispose();
      glowMesh.geometry = new THREE.CircleGeometry(baseSize * 2.15, 40);

      flashMesh.geometry.dispose();
      flashMesh.geometry = new THREE.CircleGeometry(baseSize * 0.9, 32);

      fragmentMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.CircleGeometry(Math.max(1.2, baseSize * 0.18), 24);
      });

      starMesh.scale.setScalar(baseSize);
      syncHitTarget();
    };

    const respawn = () => {
      const minX = SAFE_MARGIN_PX + baseSize * 2;
      const maxX = viewport.width - SAFE_MARGIN_PX - baseSize * 2;
      const minY = SAFE_MARGIN_PX + baseSize * 2;
      const maxY = viewport.height - SAFE_MARGIN_PX - baseSize * 2;

      motion.x = randomBetween(minX, Math.max(minX, maxX));
      motion.y = randomBetween(minY, Math.max(minY, maxY));
      motion.wobbleOffset = randomBetween(0, Math.PI * 2);
      motion.driftRetargetInMs = randomBetween(DRIFT_MIN_INTERVAL_MS, DRIFT_MAX_INTERVAL_MS);
      randomVelocity();

      heat = 0;
      burstElapsed = 0;
      phase = "heating";
      clickBoostRef.current = 0;

      starGroup.visible = true;
      starGroup.scale.setScalar(1);
      starGroup.rotation.set(randomBetween(-0.35, 0.35), randomBetween(0.1, 1.2), randomBetween(-0.6, 0.6));
      starMesh.scale.setScalar(baseSize);

      flashMaterial.opacity = 0;
      flashMesh.scale.setScalar(1);

      fragmentMeshes.forEach((mesh) => {
        mesh.visible = false;
        mesh.position.set(0, 0, 0);
        mesh.scale.setScalar(1);
      });

      syncHitTarget();
    };

    const updateBounds = () => {
      viewport = { width: window.innerWidth, height: window.innerHeight };

      camera.left = 0;
      camera.right = viewport.width;
      camera.top = viewport.height;
      camera.bottom = 0;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(viewport.width, viewport.height);
      updateSizing();

      motion.x = clamp(motion.x || viewport.width / 2, SAFE_MARGIN_PX, viewport.width - SAFE_MARGIN_PX);
      motion.y = clamp(motion.y || viewport.height / 2, SAFE_MARGIN_PX, viewport.height - SAFE_MARGIN_PX);
      syncHitTarget();
    };

    const updateHeatingVisuals = (elapsedMs: number) => {
      const wobble = reduceMotion ? 0 : Math.sin(elapsedMs * 0.0014 + motion.wobbleOffset) * baseSize * 0.22;
      starGroup.position.set(motion.x + wobble, motion.y - wobble * 0.5, 0);
      glowMesh.position.z = -8;
      flashMesh.position.z = -10;
      starLight.position.set(motion.x, motion.y, 90);

      const darkCore = new THREE.Color("#23110b");
      const warmMiddle = new THREE.Color("#b76a34");
      const hotWhite = new THREE.Color("#fffaf2");
      const emberGlow = new THREE.Color("#7a3d22");
      const hotGlow = new THREE.Color("#ffd8a3");

      const coreColor = darkCore.clone();
      if (heat < 0.68) {
        coreColor.lerp(warmMiddle, heat / 0.68);
      } else {
        coreColor.copy(warmMiddle).lerp(hotWhite, (heat - 0.68) / 0.32);
      }

      const emissiveColor = emberGlow.clone().lerp(hotGlow, heat);
      starMaterial.color.copy(coreColor);
      starMaterial.emissive.copy(emissiveColor);
      starMaterial.emissiveIntensity = 0.18 + heat * 1.35;
      starMaterial.metalness = 0.3 + heat * 0.32;
      starMaterial.roughness = 0.42 - heat * 0.26;

      glowMaterial.color.copy(emberGlow.clone().lerp(hotWhite, heat * 0.88));
      glowMaterial.opacity = 0.08 + heat * 0.28;
      flashMaterial.opacity = 0;

      const pulse = heat > 0.72 ? 1 + Math.sin(elapsedMs * 0.012) * 0.05 * ((heat - 0.72) / 0.28) : 1;
      starMesh.scale.setScalar(baseSize * pulse);
      glowMesh.scale.setScalar(1 + heat * 0.55);

      if (!reduceMotion) {
        starGroup.rotation.x += 0.008 + heat * 0.004;
        starGroup.rotation.y += 0.015 + heat * 0.007;
        starGroup.rotation.z += 0.005 + heat * 0.002;
      }

      starLight.intensity = 0.35 + heat * 1.15;
      starLight.distance = 160 + heat * 130;
    };

    const updateBurstVisuals = () => {
      const progress = clamp(burstElapsed / BURST_DURATION_MS, 0, 1);
      const eased = 1 - (1 - progress) * (1 - progress);

      glowMaterial.opacity = Math.max(0, 0.42 - progress * 0.4);
      flashMaterial.opacity = Math.max(0, 0.92 - progress * 1.05);
      flashMaterial.color.set("#fffdf8");

      starMaterial.color.set("#fffefb");
      starMaterial.emissive.set("#fff6e8");
      starMaterial.emissiveIntensity = 1.8 - progress * 1.2;
      starMesh.scale.setScalar(baseSize * (1 + eased * 0.72));
      flashMesh.scale.setScalar(1 + eased * 4.6);
      glowMesh.scale.setScalar(1.4 + eased * 2);

      starLight.intensity = 1.9 - progress * 0.8;
      starLight.distance = 260;

      fragmentMeshes.forEach((mesh, index) => {
        const angle = (Math.PI * 2 * index) / fragmentMeshes.length + motion.wobbleOffset * 0.4;
        const distance = eased * baseSize * 4.2;

        mesh.visible = true;
        mesh.material.opacity = Math.max(0, 0.74 - progress * 0.92);
        mesh.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
        mesh.scale.setScalar(1 + eased * 1.5);
      });
    };

    const tick = (currentTime: number) => {
      const deltaMs = Math.min(currentTime - lastFrameTime, 40);
      lastFrameTime = currentTime;

      if (phase === "heating") {
        const deltaSeconds = deltaMs / 1000;

        if (!reduceMotion) {
          motion.x += motion.vx * deltaSeconds;
          motion.y += motion.vy * deltaSeconds;
        }

        motion.driftRetargetInMs -= deltaMs;
        if (motion.driftRetargetInMs <= 0) {
          motion.vx *= randomSign() * randomBetween(0.72, 1.1);
          motion.vy *= randomSign() * randomBetween(0.72, 1.1);
          motion.driftRetargetInMs = randomBetween(DRIFT_MIN_INTERVAL_MS, DRIFT_MAX_INTERVAL_MS);
        }

        const minX = SAFE_MARGIN_PX + baseSize * 1.4;
        const maxX = viewport.width - SAFE_MARGIN_PX - baseSize * 1.4;
        const minY = SAFE_MARGIN_PX + baseSize * 1.4;
        const maxY = viewport.height - SAFE_MARGIN_PX - baseSize * 1.4;

        if (motion.x <= minX || motion.x >= maxX) {
          motion.vx *= -1;
          motion.x = clamp(motion.x, minX, maxX);
        }
        if (motion.y <= minY || motion.y >= maxY) {
          motion.vy *= -1;
          motion.y = clamp(motion.y, minY, maxY);
        }

        const boostMultiplier = clickBoostRef.current > 0 ? CLICK_BOOST_MULTIPLIER : 1;
        if (clickBoostRef.current > 0) {
          clickBoostRef.current = Math.max(0, clickBoostRef.current - deltaMs);
        }

        heat = clamp(heat + (deltaMs / CYCLE_DURATION_MS) * boostMultiplier, 0, 1);
        updateHeatingVisuals(currentTime);

        if (heat >= 1) {
          phase = "bursting";
          burstElapsed = 0;
        }
      } else {
        burstElapsed += deltaMs;
        updateBurstVisuals();
        if (burstElapsed >= BURST_DURATION_MS) {
          respawn();
        }
      }

      syncHitTarget();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleResize = () => updateBounds();
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      randomVelocity();
    };
    const handleClick = () => {
      if (phase !== "heating") return;
      clickBoostRef.current = CLICK_BOOST_MS;
      heat = clamp(heat + CLICK_HEAT_STEP, 0, 1);
      if (heat >= 1) {
        phase = "bursting";
        burstElapsed = 0;
      }
    };

    const hitTarget = hitTargetRef.current;
    hitTarget?.addEventListener("click", handleClick);
    mediaQuery.addEventListener("change", handleMotionPreference);
    window.addEventListener("resize", handleResize);

    updateBounds();
    respawn();
    containerRef.current?.appendChild(renderer.domElement);
    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionPreference);
      hitTarget?.removeEventListener("click", handleClick);

      glowMesh.geometry.dispose();
      starMesh.geometry.dispose();
      flashMesh.geometry.dispose();
      fragmentMeshes.forEach((mesh) => mesh.geometry.dispose());
      glowMaterial.dispose();
      flashMaterial.dispose();
      fragmentMaterial.dispose();
      starMaterial.dispose();
      renderer.dispose();
      root.clear();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="ambient-star-layer" aria-hidden="true">
      <div ref={containerRef} className="ambient-star-layer__canvas" />
      <button
        ref={hitTargetRef}
        type="button"
        className="ambient-star-layer__hit-target"
        tabIndex={-1}
        aria-label="Heat star"
      />
    </div>
  );
}
