import { useEffect, useRef } from "react";
import * as THREE from "three";

const CYCLE_DURATION_MS = 14_000;
const BURST_DURATION_MS = 400;
const SAFE_MARGIN_PX = 28;
const CLICK_BOOST_MS = 1_250;
const CLICK_BOOST_MULTIPLIER = 3.5;
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
    const camera = new THREE.OrthographicCamera(0, viewport.width, viewport.height, 0, 0.1, 100);
    camera.position.z = 10;

    const root = new THREE.Group();
    scene.add(root);

    const starGroup = new THREE.Group();
    root.add(starGroup);

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x050505),
      transparent: true,
      opacity: 0.95,
    });
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x1a1a1a),
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fragmentMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const createStarGeometry = (outerRadius: number, innerRadius: number) => {
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
      return new THREE.ShapeGeometry(shape);
    };

    const createCircleGeometry = (radius: number) => new THREE.CircleGeometry(radius, 32);

    let baseSize = 12;
    let hitTargetSize = 34;
    let coreMesh = new THREE.Mesh(createStarGeometry(7, 3.1), coreMaterial);
    let glowMesh = new THREE.Mesh(createCircleGeometry(12), glowMaterial);
    let flashMesh = new THREE.Mesh(createCircleGeometry(7), flashMaterial);
    let fragmentMeshes = Array.from({ length: 6 }, () => new THREE.Mesh(createCircleGeometry(1.5), fragmentMaterial));

    glowMesh.renderOrder = 1;
    coreMesh.renderOrder = 2;
    flashMesh.renderOrder = 3;
    fragmentMeshes.forEach((mesh) => {
      mesh.renderOrder = 4;
      mesh.visible = false;
    });

    starGroup.add(glowMesh);
    starGroup.add(coreMesh);
    starGroup.add(flashMesh);
    fragmentMeshes.forEach((mesh) => starGroup.add(mesh));

    const motion: MotionState = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      wobbleOffset: randomBetween(0, Math.PI * 2),
      driftRetargetInMs: randomBetween(DRIFT_MIN_INTERVAL_MS, DRIFT_MAX_INTERVAL_MS),
    };

    let phase: Phase = "heating";
    let heat = 0;
    let burstElapsed = 0;
    let animationFrame = 0;
    let lastFrameTime = performance.now();

    const disposeMeshGeometry = (mesh: THREE.Mesh) => {
      mesh.geometry.dispose();
    };

    const updateCanvasGeometry = () => {
      baseSize = clamp(Math.min(viewport.width, viewport.height) * 0.014, 8, 14);
      hitTargetSize = clamp(baseSize * 2.8, 28, 42);

      disposeMeshGeometry(coreMesh);
      coreMesh.geometry = createStarGeometry(baseSize, baseSize * 0.44);

      disposeMeshGeometry(glowMesh);
      glowMesh.geometry = createCircleGeometry(baseSize * 1.8);

      disposeMeshGeometry(flashMesh);
      flashMesh.geometry = createCircleGeometry(baseSize);

      fragmentMeshes.forEach((mesh) => {
        disposeMeshGeometry(mesh);
        mesh.geometry = createCircleGeometry(Math.max(1.25, baseSize * 0.18));
      });

      if (hitTargetRef.current) {
        hitTargetRef.current.style.width = `${hitTargetSize}px`;
        hitTargetRef.current.style.height = `${hitTargetSize}px`;
      }
    };

    const applyMotionToHitTarget = () => {
      if (!hitTargetRef.current) return;

      hitTargetRef.current.style.transform = `translate(${motion.x - hitTargetSize / 2}px, ${motion.y - hitTargetSize / 2}px)`;
    };

    const randomVelocity = () => {
      const speed = reduceMotion ? randomBetween(4, 8) : randomBetween(18, 30);
      const angle = randomBetween(0, Math.PI * 2);

      motion.vx = Math.cos(angle) * speed;
      motion.vy = Math.sin(angle) * speed;
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

      fragmentMeshes.forEach((mesh) => {
        mesh.visible = false;
        mesh.material.opacity = 0;
        mesh.position.set(0, 0, 0);
        mesh.scale.setScalar(1);
      });

      flashMaterial.opacity = 0;
      starGroup.visible = true;
      starGroup.scale.setScalar(1);
      applyMotionToHitTarget();
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
      updateCanvasGeometry();

      motion.x = clamp(motion.x || viewport.width / 2, SAFE_MARGIN_PX, viewport.width - SAFE_MARGIN_PX);
      motion.y = clamp(motion.y || viewport.height / 2, SAFE_MARGIN_PX, viewport.height - SAFE_MARGIN_PX);
      applyMotionToHitTarget();
    };

    const updateHeatingVisuals = (elapsedMs: number) => {
      const wobble = reduceMotion ? 0 : Math.sin(elapsedMs * 0.0016 + motion.wobbleOffset) * baseSize * 0.22;
      starGroup.position.set(motion.x + wobble, motion.y - wobble * 0.45, 0);

      const lightness = 0.03 + heat * 0.97;
      const glowLightness = 0.08 + heat * 0.92;

      coreMaterial.color.setRGB(lightness, lightness, lightness);
      glowMaterial.color.setRGB(glowLightness, glowLightness, glowLightness);
      coreMaterial.opacity = 0.92 + heat * 0.08;
      glowMaterial.opacity = 0.12 + heat * 0.36;

      const pulse = heat > 0.72 ? 1 + Math.sin(elapsedMs * 0.011) * 0.08 * ((heat - 0.72) / 0.28) : 1;
      coreMesh.scale.setScalar(pulse);
      glowMesh.scale.setScalar(1 + heat * 0.55);
      flashMesh.scale.setScalar(1);
      flashMaterial.opacity = 0;
    };

    const updateBurstVisuals = () => {
      const progress = clamp(burstElapsed / BURST_DURATION_MS, 0, 1);
      const eased = 1 - (1 - progress) * (1 - progress);

      coreMaterial.opacity = Math.max(0, 1 - progress * 2.2);
      glowMaterial.opacity = Math.max(0, 0.55 - progress * 0.65);
      coreMaterial.color.setRGB(1, 1, 1);
      glowMaterial.color.setRGB(1, 1, 1);

      flashMaterial.opacity = Math.max(0, 0.95 - progress * 1.1);
      flashMesh.scale.setScalar(1 + eased * 4.2);
      glowMesh.scale.setScalar(1.4 + eased * 1.8);
      coreMesh.scale.setScalar(1 + eased * 0.75);

      fragmentMeshes.forEach((mesh, index) => {
        const angle = (Math.PI * 2 * index) / fragmentMeshes.length + motion.wobbleOffset * 0.35;
        const distance = eased * baseSize * 3.8;

        mesh.visible = true;
        mesh.material.opacity = Math.max(0, 0.72 - progress * 0.9);
        mesh.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
        mesh.scale.setScalar(1 + eased * 1.6);
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
          motion.vx *= randomSign() * randomBetween(0.72, 1.12);
          motion.vy *= randomSign() * randomBetween(0.72, 1.12);
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

      applyMotionToHitTarget();
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

    hitTargetRef.current?.addEventListener("click", handleClick);
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
      hitTargetRef.current?.removeEventListener("click", handleClick);

      renderer.dispose();
      coreMaterial.dispose();
      glowMaterial.dispose();
      flashMaterial.dispose();
      fragmentMaterial.dispose();
      disposeMeshGeometry(coreMesh);
      disposeMeshGeometry(glowMesh);
      disposeMeshGeometry(flashMesh);
      fragmentMeshes.forEach(disposeMeshGeometry);
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
