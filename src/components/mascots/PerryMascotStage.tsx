import * as THREE from "three";
import { MascotStage, MascotStageConfig, MascotRig, clamp, createFrownCurve, createSmileCurve } from "./shared";

const createTailShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, -0.95);
  shape.quadraticCurveTo(-0.92, -0.2, -0.82, 0.62);
  shape.quadraticCurveTo(-0.2, 1.05, 0.55, 0.96);
  shape.quadraticCurveTo(0.9, 0.16, 0.52, -0.92);
  shape.closePath();
  return shape;
};

const createPerryBillShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.96, -0.12);
  shape.quadraticCurveTo(-0.7, -0.34, -0.06, -0.3);
  shape.quadraticCurveTo(0.58, -0.28, 0.96, -0.08);
  shape.quadraticCurveTo(1.08, 0.04, 0.92, 0.16);
  shape.quadraticCurveTo(0.36, 0.28, -0.2, 0.24);
  shape.quadraticCurveTo(-0.76, 0.16, -0.96, -0.12);
  shape.closePath();
  return shape;
};

const createPerryRig = (root: THREE.Group): MascotRig => {
  const materials: THREE.Material[] = [];
  const register = <T extends THREE.Material>(material: T) => {
    materials.push(material);
    return material;
  };

  const mascot = new THREE.Group();
  mascot.position.y = -0.22;
  root.add(mascot);

  const teal = register(
    new THREE.MeshPhysicalMaterial({
      color: "#1ca8a4",
      roughness: 0.52,
      metalness: 0.03,
      clearcoat: 0.3,
      clearcoatRoughness: 0.24,
    })
  );
  const orange = register(
    new THREE.MeshPhysicalMaterial({
      color: "#eba31d",
      roughness: 0.58,
      metalness: 0.03,
      clearcoat: 0.18,
      clearcoatRoughness: 0.22,
    })
  );
  const hatBrown = register(new THREE.MeshStandardMaterial({ color: "#6c2e39", roughness: 0.68, metalness: 0.04 }));
  const hatBand = register(new THREE.MeshStandardMaterial({ color: "#231519", roughness: 0.8, metalness: 0.02 }));
  const tailColor = register(new THREE.MeshStandardMaterial({ color: "#efb172", roughness: 0.72, metalness: 0.02 }));
  const tailLine = register(new THREE.MeshStandardMaterial({ color: "#d38c4f", roughness: 0.84, metalness: 0.01 }));
  const white = register(new THREE.MeshStandardMaterial({ color: "#fff8ed", roughness: 0.72, metalness: 0.01 }));
  const pupil = register(new THREE.MeshStandardMaterial({ color: "#5f3340", roughness: 0.62, metalness: 0.02 }));
  const mouthMaterial = register(new THREE.MeshStandardMaterial({ color: "#734448", roughness: 0.74, metalness: 0.02 }));

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.82, 3.4, 24), teal);
  body.position.set(0, -0.32, 0.02);
  body.scale.set(0.92, 1, 0.76);
  mascot.add(body);

  const bodyTop = new THREE.Mesh(new THREE.SphereGeometry(0.84, 26, 22), teal);
  bodyTop.position.set(0, 1.14, 0.06);
  bodyTop.scale.set(0.84, 0.68, 0.76);
  mascot.add(bodyTop);

  const bodyBottomLeft = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 14), teal);
  bodyBottomLeft.position.set(-0.44, -1.98, 0.06);
  bodyBottomLeft.scale.set(1, 1.4, 0.8);
  mascot.add(bodyBottomLeft);

  const bodyBottomRight = bodyBottomLeft.clone();
  bodyBottomRight.position.x = 0.44;
  mascot.add(bodyBottomRight);

  const bill = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createPerryBillShape(), {
      depth: 0.18,
      bevelEnabled: false,
    }),
    orange
  );
  bill.geometry.center();
  bill.position.set(0.04, 0.48, 0.8);
  bill.rotation.x = 0.08;
  bill.rotation.z = -0.04;
  bill.scale.set(0.74, 0.54, 0.58);
  mascot.add(bill);

  const tail = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createTailShape(), {
      depth: 0.12,
      bevelEnabled: false,
    }),
    tailColor
  );
  tail.geometry.center();
  tail.position.set(0.94, -0.1, -0.8);
  tail.rotation.y = -0.66;
  tail.rotation.z = -0.18;
  tail.scale.set(0.72, 0.92, 0.72);
  mascot.add(tail);

  for (let index = -1; index <= 1; index += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.03, 0.03), tailLine);
    line.position.set(0.94, -0.08 + index * 0.36, -0.71 + Math.abs(index) * 0.01);
    line.rotation.set(0.08, -0.62, index === 0 ? 0 : index * 0.18);
    mascot.add(line);
  }

  for (let index = -1; index <= 1; index += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.18, 0.03), tailLine);
    line.position.set(0.92 + index * 0.18, -0.1, -0.7);
    line.rotation.set(0.08, -0.62, 0.14);
    mascot.add(line);
  }

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.58, 0.12, 30), hatBrown);
  brim.position.set(-0.02, 1.66, 0.14);
  brim.rotation.set(-0.05, 0.04, -0.14);
  brim.scale.set(0.92, 1, 0.78);
  mascot.add(brim);

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.92, 0.82, 22), hatBrown);
  crown.position.set(-0.02, 1.96, 0.14);
  crown.rotation.copy(brim.rotation);
  crown.scale.set(0.88, 0.92, 0.82);
  mascot.add(crown);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.98, 0.16, 22), hatBand);
  band.position.set(-0.01, 1.8, 0.15);
  band.rotation.copy(brim.rotation);
  band.scale.set(0.89, 0.92, 0.84);
  mascot.add(band);

  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(0.01, 1.02, 0.7);
  mascot.add(eyeGroup);

  const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.33, 24, 20), white);
  leftEyeWhite.position.set(-0.34, -0.02, 0.08);
  leftEyeWhite.scale.set(1.2, 0.6, 0.3);
  leftEyeWhite.rotation.z = -0.18;
  eyeGroup.add(leftEyeWhite);

  const rightEyeWhite = leftEyeWhite.clone();
  rightEyeWhite.position.x = 0.34;
  rightEyeWhite.rotation.z = 0.18;
  eyeGroup.add(rightEyeWhite);

  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 16), pupil);
  leftPupil.position.set(-0.34, -0.02, 0.18);
  leftPupil.scale.set(0.95, 1.16, 0.68);
  eyeGroup.add(leftPupil);

  const rightPupil = leftPupil.clone();
  rightPupil.position.x = 0.34;
  eyeGroup.add(rightPupil);

  const eyeBrowLeft = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.06), teal);
  eyeBrowLeft.position.set(-0.33, 0.17, 0.08);
  eyeBrowLeft.rotation.z = -0.28;
  eyeGroup.add(eyeBrowLeft);

  const eyeBrowRight = eyeBrowLeft.clone();
  eyeBrowRight.position.x = 0.33;
  eyeBrowRight.rotation.z = 0.28;
  eyeGroup.add(eyeBrowRight);

  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0.02, 0.18, 0.72);
  mascot.add(mouthGroup);

  const smirk = new THREE.Mesh(new THREE.TubeGeometry(createSmileCurve(), 24, 0.028, 8, false), mouthMaterial);
  smirk.scale.set(0.64, 0.32, 1);
  smirk.rotation.z = -0.04;
  mouthGroup.add(smirk);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 1.44, 12), teal);
  leftArm.position.set(-0.72, -0.28, 0.08);
  leftArm.rotation.z = 0.12;
  mascot.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.72;
  rightArm.rotation.z = -0.14;
  mascot.add(rightArm);

  const leftFist = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 14), teal);
  leftFist.position.set(-0.94, -0.96, 0.1);
  leftFist.scale.set(1.08, 0.96, 0.92);
  mascot.add(leftFist);

  const rightFist = leftFist.clone();
  rightFist.position.x = 0.94;
  mascot.add(rightFist);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 12), teal);
  leftLeg.position.set(-0.34, -2.1, 0.06);
  leftLeg.rotation.z = 0.16;
  mascot.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.34;
  rightLeg.rotation.z = -0.16;
  mascot.add(rightLeg);

  const leftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), orange);
  leftFoot.position.set(-0.54, -2.52, 0.22);
  leftFoot.scale.set(1.55, 0.42, 0.88);
  leftFoot.rotation.z = 0.08;
  mascot.add(leftFoot);

  const rightFoot = leftFoot.clone();
  rightFoot.position.x = 0.54;
  rightFoot.rotation.z = -0.08;
  mascot.add(rightFoot);

  const noteMaterial = register(new THREE.MeshBasicMaterial({ color: "#f2e5c4", transparent: true, opacity: 0.12 }));
  const note = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.58), noteMaterial);
  note.position.set(0, -3.02, -0.22);
  root.add(note);

  return {
    mascot,
    updateVisuals: (time, pointer, hover, expressionMode, blink, specialProgress) => {
      const eyeScaleY =
        expressionMode === "angry" ? 0.48 : expressionMode === "laugh" ? 0.6 : expressionMode === "mischief" ? 0.66 : 0.74;
      const pupilScaleY =
        expressionMode === "angry" ? 0.88 : expressionMode === "laugh" ? 0.9 : expressionMode === "mischief" ? 1.04 : 1.14;
      const lidTilt = expressionMode === "angry" ? 0.56 : expressionMode === "mischief" ? 0.36 : 0.2;

      leftEyeWhite.scale.y = eyeScaleY * blink;
      rightEyeWhite.scale.y = eyeScaleY * blink;
      leftPupil.scale.y = pupilScaleY * blink;
      rightPupil.scale.y = pupilScaleY * blink;

      leftEyeWhite.rotation.z = -lidTilt;
      rightEyeWhite.rotation.z = lidTilt;
      eyeBrowLeft.rotation.z = -lidTilt - 0.04;
      eyeBrowRight.rotation.z = lidTilt + 0.04;

      const pupilOffsetX = hover ? clamp(pointer.x * 0.06, -0.07, 0.07) : 0;
      const pupilOffsetY = hover ? clamp(pointer.y * 0.04, -0.04, 0.04) : 0;
      const angryCross = expressionMode === "angry" ? 0.03 : 0;
      leftPupil.position.x = -0.34 + pupilOffsetX + angryCross;
      rightPupil.position.x = 0.34 + pupilOffsetX - angryCross;
      leftPupil.position.y = -0.02 + pupilOffsetY - (expressionMode === "angry" ? 0.01 : 0);
      rightPupil.position.y = -0.02 + pupilOffsetY - (expressionMode === "angry" ? 0.01 : 0);

      smirk.visible = false;

      mouthGroup.position.y = 0.18;
      mouthGroup.rotation.z = expressionMode === "angry" ? -0.08 : -0.02;
      bill.rotation.z = expressionMode === "laugh" ? -0.08 : expressionMode === "angry" ? -0.01 : -0.04;
      bill.rotation.x = expressionMode === "laugh" ? 0.12 : expressionMode === "angry" ? 0.02 : 0.08;
      bill.position.y = expressionMode === "angry" ? 0.44 : 0.48;

      tail.rotation.z = -0.24 + Math.sin(time * 0.0018) * 0.05;
      const punch = specialProgress > 0 ? Math.sin(Math.min(specialProgress * 1.2, 1) * Math.PI) : 0;
      const leftBaseRot = expressionMode === "laugh" ? 0.28 : 0.12;
      const rightBaseRot = expressionMode === "laugh" ? -0.3 : -0.14;
      leftArm.rotation.z = specialProgress > 0 ? 1.18 - punch * 0.1 : leftBaseRot;
      rightArm.rotation.z = specialProgress > 0 ? -0.4 + punch * 0.95 : rightBaseRot;
      leftArm.position.x = specialProgress > 0 ? -0.66 - punch * 0.12 : -0.72;
      leftArm.position.y = specialProgress > 0 ? -0.12 + punch * 0.1 : -0.28;
      rightArm.position.x = specialProgress > 0 ? 0.58 + punch * 0.3 : 0.72;
      rightArm.position.y = specialProgress > 0 ? -0.3 + punch * 0.5 : -0.28;
      rightArm.position.z = specialProgress > 0 ? 0.1 + punch * 0.95 : 0.08;
      leftFist.visible = specialProgress > 0.02;
      rightFist.visible = specialProgress > 0.02;
      leftFist.position.x = -1.02 - punch * 0.14;
      leftFist.position.y = -0.72 + punch * 0.08;
      leftFist.position.z = 0.12 - punch * 0.08;
      rightFist.position.x = 0.94 + punch * 0.68;
      rightFist.position.y = -0.76 + punch * 0.78;
      rightFist.position.z = 0.14 + punch * 1.9;
      rightFist.scale.set(1.08 + punch * 0.34, 0.96 + punch * 0.2, 0.92 + punch * 0.42);
      leftFist.scale.set(1.08, 0.96, 0.92);
      brim.rotation.z = -0.16 + Math.sin(time * 0.0012) * 0.02;
      crown.rotation.z = brim.rotation.z;
      band.rotation.z = brim.rotation.z;
      bill.position.z = 0.8 + punch * 0.1;
    },
    dispose: () => {
      materials.forEach((material) => material.dispose());
    },
  };
};

const perryStageConfig: MascotStageConfig = {
  label: "Perry",
  cameraY: 0.1,
  cameraZ: 10.4,
  ambientIntensity: 1.7,
  rimColor: 0x6c2e39,
  idleFollowX: 0.02,
  idleFollowY: 0.08,
  idleBob: 0.12,
  rotationZ: 0.02,
  meowYOffset: -0.2,
  angryAction: "cartwheelPunch",
  specialDurationMs: 1180,
  createRig: createPerryRig,
};

export function PerryMascotStage() {
  return <MascotStage config={perryStageConfig} />;
}
