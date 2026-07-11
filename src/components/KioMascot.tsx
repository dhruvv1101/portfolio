import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function KioMascot() {
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
    camera.position.set(0, 0.35, 9.6);

    const ambientLight = new THREE.AmbientLight(0xffefd9, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ea, 1.8);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb74a32, 0.55);
    rimLight.position.set(-5, 1, 3);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffd9ab, 0.9, 24, 2);
    pointLight.position.set(0, 1.2, 5);
    scene.add(pointLight);

    const root = new THREE.Group();
    scene.add(root);

    const mascot = new THREE.Group();
    root.add(mascot);

    const ink = new THREE.MeshPhysicalMaterial({
      color: "#2f2a2d",
      roughness: 0.58,
      metalness: 0.06,
      clearcoat: 0.52,
      clearcoatRoughness: 0.24,
    });
    const cream = new THREE.MeshPhysicalMaterial({
      color: "#f8f1de",
      roughness: 0.5,
      metalness: 0.02,
      clearcoat: 0.24,
      clearcoatRoughness: 0.2,
    });
    const cloth = new THREE.MeshPhysicalMaterial({
      color: "#b61f35",
      roughness: 0.6,
      metalness: 0.04,
      clearcoat: 0.18,
      clearcoatRoughness: 0.18,
    });
    const pink = new THREE.MeshStandardMaterial({ color: "#d6818e", roughness: 0.8, metalness: 0.02 });
    const nose = new THREE.MeshStandardMaterial({ color: "#8c2f2a", roughness: 0.45, metalness: 0.05 });
    const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.72, metalness: 0.01 });
    const pupil = new THREE.MeshStandardMaterial({ color: "#1f1518", roughness: 0.62, metalness: 0.02 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.55, 40, 34), ink);
    head.scale.set(1.04, 1, 1);
    mascot.add(head);

    const leftEar = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.92, 4), ink);
    leftEar.position.set(-0.92, 1.24, -0.05);
    leftEar.rotation.z = 0.24;
    leftEar.rotation.x = -0.12;
    mascot.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.x = 0.92;
    rightEar.rotation.z = -0.24;
    mascot.add(rightEar);

    const leftEarInner = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 4), pink);
    leftEarInner.position.set(-0.92, 1.18, 0.12);
    leftEarInner.rotation.z = 0.24;
    leftEarInner.rotation.x = -0.12;
    mascot.add(leftEarInner);

    const rightEarInner = leftEarInner.clone();
    rightEarInner.position.x = 0.92;
    rightEarInner.rotation.z = -0.24;
    mascot.add(rightEarInner);

    const muzzle = new THREE.Group();
    muzzle.position.set(0, -0.12, 1.12);
    mascot.add(muzzle);

    const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 28), cream);
    leftCheek.position.set(-0.45, -0.1, 0);
    leftCheek.scale.set(1.1, 0.86, 0.84);
    muzzle.add(leftCheek);

    const rightCheek = leftCheek.clone();
    rightCheek.position.x = 0.45;
    muzzle.add(rightCheek);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.74, 32, 28), cream);
    chin.position.set(0, -0.34, -0.1);
    chin.scale.set(1.36, 0.62, 0.82);
    muzzle.add(chin);

    const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 18), nose);
    noseMesh.position.set(0, 0.11, 0.56);
    noseMesh.scale.set(1, 0.84, 1);
    muzzle.add(noseMesh);

    const mouthLine = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 12), nose);
    mouthLine.position.set(0, -0.12, 0.5);
    mouthLine.rotation.z = Math.PI / 2;
    muzzle.add(mouthLine);

    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.05, 10, 24, Math.PI), nose);
    lip.position.set(0, -0.2, 0.46);
    lip.rotation.z = Math.PI;
    muzzle.add(lip);

    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), pink);
    tongue.position.set(0, -0.28, 0.42);
    tongue.scale.set(1.3, 0.62, 0.4);
    muzzle.add(tongue);

    const whiskerMaterial = new THREE.MeshStandardMaterial({ color: "#f4efe2", roughness: 0.9, metalness: 0 });
    const whiskers = new THREE.Group();
    whiskers.position.set(0, -0.05, 1.16);
    mascot.add(whiskers);

    const whiskerBars: THREE.Mesh[] = [];
    [-1, 1].forEach((side) => {
      [-0.18, 0.02, 0.22].forEach((y, index) => {
        const whisker = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.08, 10), whiskerMaterial);
        whisker.rotation.z = Math.PI / 2;
        whisker.rotation.y = side === 1 ? -0.32 : 0.32;
        whisker.position.set(side * 1.08, y, 0.02 + index * 0.01);
        whiskers.add(whisker);
        whiskerBars.push(whisker);
      });
    });

    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0.34, 1.15);
    mascot.add(eyeGroup);

    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 16), white);
    leftEyeWhite.position.set(-0.42, 0.03, 0);
    leftEyeWhite.scale.set(1.18, 0.95, 0.56);
    eyeGroup.add(leftEyeWhite);

    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.x = 0.42;
    eyeGroup.add(rightEyeWhite);

    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 14), pupil);
    leftPupil.position.set(-0.42, 0.02, 0.14);
    leftPupil.scale.set(1, 1.25, 0.8);
    eyeGroup.add(leftPupil);

    const rightPupil = leftPupil.clone();
    rightPupil.position.x = 0.42;
    eyeGroup.add(rightPupil);

    const browMarkMaterial = new THREE.MeshStandardMaterial({ color: "#efe6cf", roughness: 0.72, metalness: 0.02 });
    const browMark = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.04, 8, 20, Math.PI), browMarkMaterial);
    browMark.position.set(0, 1.04, 1.02);
    browMark.rotation.z = Math.PI;
    mascot.add(browMark);

    const browStem = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.05), browMarkMaterial);
    browStem.position.set(0, 0.89, 1.05);
    browStem.rotation.z = 0.1;
    mascot.add(browStem);

    const tuftLeft = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.84, 4), ink);
    tuftLeft.position.set(-1.22, -0.24, 0.55);
    tuftLeft.rotation.z = 0.92;
    tuftLeft.rotation.x = -0.34;
    mascot.add(tuftLeft);

    const tuftRight = tuftLeft.clone();
    tuftRight.position.x = 1.22;
    tuftRight.rotation.z = -0.92;
    mascot.add(tuftRight);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.98, 1.55, 24), cloth);
    body.position.set(0, -2.08, 0.08);
    body.scale.set(0.86, 1, 0.62);
    mascot.add(body);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.46, 20, 18), cream);
    chest.position.set(0, -1.95, 0.65);
    chest.scale.set(1.1, 1.2, 0.62);
    mascot.add(chest);

    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.08, 12, 28), cloth);
    scarf.position.set(0, -1.38, 0.2);
    scarf.rotation.x = Math.PI / 2.25;
    mascot.add(scarf);

    const note = new THREE.Mesh(
      new THREE.PlaneGeometry(1.35, 0.52),
      new THREE.MeshBasicMaterial({ color: "#f2e5c4", transparent: true, opacity: 0.15 })
    );
    note.position.set(0, -2.78, -0.1);
    root.add(note);

    const pointer = new THREE.Vector2(0, 0);
    let hover = false;
    let jumpUntil = 0;
    let blinkUntil = 0;
    let nextBlinkAt = performance.now() + 1700;
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
      jumpUntil = performance.now() + 900;
      blinkUntil = performance.now() + 180;
    };

    const animate = (time: number) => {
      const bob = Math.sin(time * 0.0018) * 0.14;
      const followX = hover ? clamp(pointer.y * 0.4, -0.28, 0.28) : 0.04;
      const followY = hover ? clamp(pointer.x * 0.8, -0.55, 0.55) : 0.28;

      mascot.position.y = Math.sin(time * 0.0013) * 0.07 + bob;
      mascot.rotation.x += (followX - mascot.rotation.x) * 0.08;
      mascot.rotation.y += (followY - mascot.rotation.y) * 0.08;
      mascot.rotation.z = Math.sin(time * 0.001) * 0.03;

      const jumping = time < jumpUntil;
      if (jumping) {
        const progress = 1 - (jumpUntil - time) / 900;
        mascot.position.y += Math.sin(progress * Math.PI) * 0.95;
        mascot.rotation.y += 0.12;
      }

      if (time >= nextBlinkAt) {
        blinkUntil = time + 140;
        nextBlinkAt = time + 2200 + Math.random() * 2400;
      }

      const blink = time < blinkUntil ? 0.12 : 1;
      leftEyeWhite.scale.y = 0.95 * blink;
      rightEyeWhite.scale.y = 0.95 * blink;
      leftPupil.scale.y = 1.25 * blink;
      rightPupil.scale.y = 1.25 * blink;

      const pupilOffsetX = hover ? clamp(pointer.x * 0.06, -0.06, 0.06) : 0;
      const pupilOffsetY = hover ? clamp(pointer.y * 0.04, -0.04, 0.04) : 0;
      leftPupil.position.x = -0.42 + pupilOffsetX;
      rightPupil.position.x = 0.42 + pupilOffsetX;
      leftPupil.position.y = 0.02 + pupilOffsetY;
      rightPupil.position.y = 0.02 + pupilOffsetY;

      whiskerBars.forEach((whisker, index) => {
        whisker.rotation.x = Math.sin(time * 0.002 + index * 0.4) * 0.02;
      });

      pointLight.intensity = hover ? 1.15 : 0.9;
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

      renderer.dispose();
      [ink, cream, cloth, pink, nose, white, pupil, browMarkMaterial, whiskerMaterial].forEach((material) => material.dispose());
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <p className="folio-tag">Interactive Mascot</p>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-primary/80">Kio</span>
      </div>
      <div className="relative overflow-hidden border border-border/80 bg-[radial-gradient(circle_at_top,_rgba(255,244,219,0.85),_rgba(221,194,160,0.48)_44%,_rgba(117,67,39,0.18)_100%)]">
        <div ref={mountRef} className="aspect-[4/3] w-full cursor-pointer" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-border/60 bg-card/80 px-4 py-3 backdrop-blur-[2px]">
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
            Hover to tilt / click to make Kio hop
          </p>
        </div>
      </div>
    </div>
  );
}
