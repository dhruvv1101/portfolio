import * as THREE from "three";
import { MascotStage, MascotStageConfig, MascotRig, clamp, createFourPointStar, createSmileCurve } from "./shared";

const createKioRig = (root: THREE.Group): MascotRig => {
  const materials: THREE.Material[] = [];
  const register = <T extends THREE.Material>(material: T) => {
    materials.push(material);
    return material;
  };

  const mascot = new THREE.Group();
  root.add(mascot);

  const ink = register(
    new THREE.MeshPhysicalMaterial({
      color: "#2f2a2d",
      roughness: 0.58,
      metalness: 0.06,
      clearcoat: 0.52,
      clearcoatRoughness: 0.24,
    })
  );
  const cream = register(
    new THREE.MeshPhysicalMaterial({
      color: "#f8f1de",
      roughness: 0.5,
      metalness: 0.02,
      clearcoat: 0.24,
      clearcoatRoughness: 0.2,
    })
  );
  const cloth = register(
    new THREE.MeshPhysicalMaterial({
      color: "#b61f35",
      roughness: 0.6,
      metalness: 0.04,
      clearcoat: 0.18,
      clearcoatRoughness: 0.18,
    })
  );
  const pink = register(new THREE.MeshStandardMaterial({ color: "#d6818e", roughness: 0.8, metalness: 0.02 }));
  const nose = register(new THREE.MeshStandardMaterial({ color: "#8c2f2a", roughness: 0.45, metalness: 0.05 }));
  const white = register(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.72, metalness: 0.01 }));
  const pupil = register(new THREE.MeshStandardMaterial({ color: "#1f1518", roughness: 0.62, metalness: 0.02 }));
  const whiskerMaterial = register(new THREE.MeshStandardMaterial({ color: "#f4efe2", roughness: 0.9, metalness: 0 }));
  const furMaterial = register(new THREE.MeshStandardMaterial({ color: "#2f2a2d", roughness: 0.72, metalness: 0.02 }));
  const foreheadMarkMaterial = register(new THREE.MeshStandardMaterial({ color: "#efe6cf", roughness: 0.72, metalness: 0.02 }));
  const mouthInterior = register(new THREE.MeshStandardMaterial({ color: "#7c1d1d", roughness: 0.72, metalness: 0.02 }));

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

  const openMouth = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 16, 0, Math.PI * 2, 0, Math.PI), mouthInterior);
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

  const noteMaterial = register(new THREE.MeshBasicMaterial({ color: "#f2e5c4", transparent: true, opacity: 0.14 }));
  const note = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.52), noteMaterial);
  note.position.set(0, -2.78, -0.1);
  root.add(note);

  return {
    mascot,
    updateVisuals: (time, pointer, hover, expressionMode, blink) => {
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

      foreheadMark.rotation.z = Math.sin(time * 0.0016) * 0.03;
      cape.rotation.z = Math.sin(time * 0.0014) * 0.025;
    },
    dispose: () => {
      materials.forEach((material) => material.dispose());
    },
  };
};

const kioStageConfig: MascotStageConfig = {
  label: "Kio",
  cameraY: 0.35,
  cameraZ: 9.6,
  ambientIntensity: 1.6,
  rimColor: 0xb74a32,
  idleFollowX: 0.04,
  idleFollowY: 0.18,
  idleBob: 0.14,
  rotationZ: 0.03,
  meowYOffset: -0.18,
  createRig: createKioRig,
};

export function KioMascotStage() {
  return <MascotStage config={kioStageConfig} />;
}
