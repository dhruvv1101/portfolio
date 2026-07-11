import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createFourPointStar = (outerRadius: number, innerRadius: number) => {
  const shape = new THREE.Shape();
  const points = 8;

  for (let index = 0; index < points; index += 1) {
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

const createSmileCurve = () =>
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.12, 0),
    new THREE.Vector3(-0.24, -0.22, 0),
    new THREE.Vector3(0.02, -0.28, 0),
    new THREE.Vector3(0.18, -0.18, 0),
    new THREE.Vector3(0.34, 0.02, 0),
  ]);

const addStroke = (group: THREE.Group, material: THREE.Material, x: number, y: number, width: number, height: number) => {
  const stroke = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.16), material);
  stroke.position.set(x, y, 0);
  group.add(stroke);
};

const createMeowText = (material: THREE.Material) => {
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
    const meowMaterial = new THREE.MeshPhysicalMaterial({
      color: "#7b4127",
      emissive: "#4f2413",
      emissiveIntensity: 0.16,
      roughness: 0.42,
      metalness: 0.06,
      clearcoat: 0.18,
      clearcoatRoughness: 0.2,
    });

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
    muzzle.position.set(0, -0.14, 1.18);
    mascot.add(muzzle);

    const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 28), cream);
    leftCheek.position.set(-0.47, -0.14, 0.03);
    leftCheek.scale.set(1.18, 0.92, 0.86);
    muzzle.add(leftCheek);

    const rightCheek = leftCheek.clone();
    rightCheek.position.x = 0.45;
    muzzle.add(rightCheek);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 28), cream);
    chin.position.set(0, -0.4, -0.08);
    chin.scale.set(1.22, 0.7, 0.76);
    muzzle.add(chin);

    const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), nose);
    noseMesh.position.set(0, 0.08, 0.62);
    noseMesh.scale.set(1.05, 0.88, 1);
    muzzle.add(noseMesh);

    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.18, 0.52);
    muzzle.add(mouthGroup);

    const smileMouth = new THREE.Mesh(new THREE.TubeGeometry(createSmileCurve(), 28, 0.042, 10, false), nose);
    smileMouth.position.set(0.02, -0.02, 0.04);
    mouthGroup.add(smileMouth);

    const openMouth = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 18, 16, 0, Math.PI * 2, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: "#7c1d1d", roughness: 0.72, metalness: 0.02 })
    );
    openMouth.position.set(0, -0.02, -0.02);
    openMouth.rotation.x = Math.PI;
    openMouth.scale.set(1.4, 1.1, 0.62);
    openMouth.visible = false;
    mouthGroup.add(openMouth);

    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), pink);
    tongue.position.set(0, -0.16, 0.06);
    tongue.scale.set(1.3, 0.62, 0.4);
    tongue.visible = false;
    mouthGroup.add(tongue);

    const angryMouth = new THREE.Group();
    angryMouth.visible = false;
    mouthGroup.add(angryMouth);

    const angryTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.34, 0.1), white);
    angryTeeth.position.set(0.02, -0.02, 0.02);
    angryMouth.add(angryTeeth);

    for (let index = -2; index <= 2; index += 1) {
      const toothLine = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.34, 0.03), nose);
      toothLine.position.set(index * 0.16, -0.02, 0.08);
      angryMouth.add(toothLine);
    }

    const angryLip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.92, 12), nose);
    angryLip.position.set(0.02, -0.18, 0.08);
    angryLip.rotation.z = Math.PI / 2;
    angryMouth.add(angryLip);

    const whiskerMaterial = new THREE.MeshStandardMaterial({ color: "#f4efe2", roughness: 0.9, metalness: 0 });
    const furMaterial = new THREE.MeshStandardMaterial({ color: "#2f2a2d", roughness: 0.72, metalness: 0.02 });

    const leftCheekFur = new THREE.Group();
    leftCheekFur.position.set(-1.12, -0.18, 0.54);
    mascot.add(leftCheekFur);

    [
      { x: -0.08, y: 0.32, rotZ: 1.02, size: 0.4, len: 1.08 },
      { x: 0.04, y: 0.05, rotZ: 1.24, size: 0.5, len: 1.22 },
      { x: 0.16, y: -0.24, rotZ: 1.48, size: 0.4, len: 1.1 },
    ].forEach(({ x, y, rotZ, size, len }) => {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(size, len, 3), furMaterial);
      tuft.position.set(x, y, 0);
      tuft.rotation.z = rotZ;
      tuft.rotation.x = -0.28;
      leftCheekFur.add(tuft);
    });

    const rightCheekFur = leftCheekFur.clone();
    rightCheekFur.position.x = 1.12;
    rightCheekFur.children.forEach((child) => {
      child.rotation.z *= -1;
    });
    mascot.add(rightCheekFur);

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
    eyeGroup.position.set(0, 0.48, 1.37);
    mascot.add(eyeGroup);

    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.27, 22, 18), white);
    leftEyeWhite.position.set(-0.43, 0.04, 0);
    leftEyeWhite.scale.set(1.28, 0.9, 0.34);
    leftEyeWhite.rotation.z = -0.08;
    eyeGroup.add(leftEyeWhite);

    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.x = 0.43;
    rightEyeWhite.rotation.z = 0.08;
    eyeGroup.add(rightEyeWhite);

    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 16), pupil);
    leftPupil.position.set(-0.42, 0.03, 0.14);
    leftPupil.scale.set(0.94, 1.22, 0.72);
    eyeGroup.add(leftPupil);

    const rightPupil = leftPupil.clone();
    rightPupil.position.x = 0.42;
    eyeGroup.add(rightPupil);

    const foreheadMarkMaterial = new THREE.MeshStandardMaterial({ color: "#efe6cf", roughness: 0.72, metalness: 0.02 });
    const foreheadMark = new THREE.Mesh(
      new THREE.ExtrudeGeometry(createFourPointStar(0.12, 0.045), {
        depth: 0.03,
        bevelEnabled: false,
      }),
      foreheadMarkMaterial
    );
    foreheadMark.geometry.center();
    foreheadMark.position.set(0, 1.02, 1.3);
    mascot.add(foreheadMark);

    const tuftLeft = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.84, 4), ink);
    tuftLeft.position.set(-1.22, -0.24, 0.55);
    tuftLeft.rotation.z = 0.92;
    tuftLeft.rotation.x = -0.34;
    mascot.add(tuftLeft);

    const tuftRight = tuftLeft.clone();
    tuftRight.position.x = 1.22;
    tuftRight.rotation.z = -0.92;
    mascot.add(tuftRight);

    const cape = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 0.72, 1.74, 24, 1, true), cloth);
    cape.position.set(0, -2.04, -0.62);
    cape.scale.set(0.88, 1, 0.34);
    mascot.add(cape);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.82, 1.48, 24), ink);
    body.position.set(0, -2.06, 0.18);
    body.scale.set(0.86, 1, 0.58);
    mascot.add(body);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.46, 20, 18), cream);
    chest.position.set(0, -1.95, 0.65);
    chest.scale.set(1.1, 1.2, 0.62);
    mascot.add(chest);

    const collarLeft = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.64, 3), cloth);
    collarLeft.position.set(-0.26, -1.5, 0.82);
    collarLeft.rotation.z = 0.28;
    collarLeft.rotation.x = Math.PI;
    mascot.add(collarLeft);

    const collarRight = collarLeft.clone();
    collarRight.position.x = 0.26;
    collarRight.rotation.z = -0.28;
    mascot.add(collarRight);

    const capeKnot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), cloth);
    capeKnot.position.set(0, -1.44, 0.86);
    mascot.add(capeKnot);

    const noteMaterial = new THREE.MeshBasicMaterial({ color: "#f2e5c4", transparent: true, opacity: 0.15 });
    const note = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.52), noteMaterial);
    note.position.set(0, -2.78, -0.1);
    root.add(note);

    const meowGroup = createMeowText(meowMaterial);
    meowGroup.position.set(0, -0.18, 2.2);
    meowGroup.scale.setScalar(0.01);
    meowGroup.visible = false;
    root.add(meowGroup);

    const pointer = new THREE.Vector2(0, 0);
    let hover = false;
    let jumpUntil = 0;
    let blinkUntil = 0;
    let nextBlinkAt = performance.now() + 1700;
    let expressionUntil = 0;
    let expressionMode: "calm" | "mischief" | "laugh" | "angry" = "calm";
    let clickStreak = 0;
    let meowUntil = 0;
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
        meowUntil = performance.now() + 950;
        meowGroup.visible = true;
        meowGroup.scale.setScalar(0.18);
        meowGroup.position.set(0, -0.12, 1.8);
        expressionMode = "angry";
        expressionUntil = performance.now() + 850;
        blinkUntil = performance.now() + 110;
        clickStreak = 0;
        return;
      }

      jumpUntil = performance.now() + 900;
      blinkUntil = performance.now() + 180;
      expressionMode = "laugh";
      expressionUntil = performance.now() + 1000;
    };

    const animate = (time: number) => {
      const bob = Math.sin(time * 0.0018) * 0.14;
      const followX = hover ? clamp(pointer.y * 0.4, -0.28, 0.28) : 0.04;
      const followY = hover ? clamp(pointer.x * 0.55, -0.42, 0.42) : 0.18;

      mascot.position.y = Math.sin(time * 0.0013) * 0.07 + bob;
      mascot.position.z = 0;
      mascot.rotation.x += (followX - mascot.rotation.x) * 0.08;
      mascot.rotation.y += (followY - mascot.rotation.y) * 0.08;
      mascot.rotation.z = Math.sin(time * 0.001) * 0.03;

      const jumping = time < jumpUntil;
      if (jumping) {
        const progress = 1 - (jumpUntil - time) / 900;
        mascot.position.y += Math.sin(progress * Math.PI) * 0.95;
        mascot.position.z += Math.sin(progress * Math.PI) * 0.78;
        mascot.rotation.x -= Math.sin(progress * Math.PI) * 0.12;
      }

      const meowing = time < meowUntil;
      if (meowing) {
        const progress = 1 - (meowUntil - time) / 950;
        const eased = 1 - (1 - progress) * (1 - progress);
        meowGroup.visible = true;
        meowGroup.position.set(0, -0.05 + progress * 0.2, 1.8 + eased * 5.2);
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
        if (hover) {
          expressionMode = "mischief";
          expressionUntil = time + 300;
        } else {
          expressionMode = "calm";
          expressionUntil = time + 300;
        }
      }

      const blink = time < blinkUntil ? 0.08 : 1;
      const eyeHeight =
        expressionMode === "angry" ? 0.72 : expressionMode === "laugh" ? 0.62 : expressionMode === "mischief" ? 0.88 : 1.02;
      const pupilHeight =
        expressionMode === "angry" ? 1.1 : expressionMode === "laugh" ? 0.82 : expressionMode === "mischief" ? 1.26 : 1.48;

      leftEyeWhite.scale.y = eyeHeight * blink;
      rightEyeWhite.scale.y = eyeHeight * blink;
      leftEyeWhite.rotation.z = expressionMode === "angry" ? -0.26 : expressionMode === "mischief" ? -0.12 : -0.08;
      rightEyeWhite.rotation.z = expressionMode === "angry" ? 0.26 : expressionMode === "mischief" ? 0.12 : 0.08;
      leftPupil.scale.y = pupilHeight * blink;
      rightPupil.scale.y = pupilHeight * blink;

      const pupilOffsetX = hover ? clamp(pointer.x * 0.05, -0.05, 0.05) : 0;
      const pupilOffsetY = hover ? clamp(pointer.y * 0.04, -0.04, 0.04) : 0;
      leftPupil.position.x = -0.42 + pupilOffsetX;
      rightPupil.position.x = 0.42 + pupilOffsetX;
      leftPupil.position.y = 0.02 + pupilOffsetY;
      rightPupil.position.y = 0.02 + pupilOffsetY;

      smileMouth.visible = expressionMode !== "laugh" && expressionMode !== "angry";
      openMouth.visible = expressionMode === "laugh";
      tongue.visible = expressionMode === "laugh";
      angryMouth.visible = expressionMode === "angry";
      mouthGroup.scale.y = expressionMode === "laugh" ? 1.08 : expressionMode === "mischief" ? 0.84 : expressionMode === "angry" ? 0.72 : 1;
      mouthGroup.scale.x = expressionMode === "mischief" ? 0.88 : expressionMode === "angry" ? 0.82 : 0.96;
      mouthGroup.position.y = expressionMode === "mischief" ? -0.16 : expressionMode === "angry" ? -0.12 : -0.18;
      mouthGroup.rotation.z = expressionMode === "mischief" ? -0.08 : expressionMode === "angry" ? -0.02 : -0.03;
      openMouth.scale.set(1.18, 0.86, 0.52);
      tongue.position.y = expressionMode === "laugh" ? -0.12 : -0.16;

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
      [
        ink,
        cream,
        cloth,
        pink,
        nose,
        white,
        pupil,
        meowMaterial,
        foreheadMarkMaterial,
        whiskerMaterial,
        furMaterial,
        noteMaterial,
        openMouth.material as THREE.Material,
      ].forEach((material) => material.dispose());
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
