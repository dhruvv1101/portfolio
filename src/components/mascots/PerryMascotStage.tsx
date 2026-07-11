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
  shape.moveTo(-1.12, -0.2);
  shape.quadraticCurveTo(-0.76, -0.48, 0.1, -0.44);
  shape.quadraticCurveTo(0.76, -0.4, 1.18, -0.08);
  shape.quadraticCurveTo(1.32, 0.08, 1.1, 0.24);
  shape.quadraticCurveTo(0.45, 0.42, -0.32, 0.34);
  shape.quadraticCurveTo(-0.92, 0.2, -1.12, -0.2);
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
  const mouthInterior = register(new THREE.MeshStandardMaterial({ color: "#612126", roughness: 0.76, metalness: 0.01 }));

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.88, 3.25, 24), teal);
  body.position.set(0, -0.36, 0.02);
  body.scale.set(0.9, 1, 0.74);
  mascot.add(body);

  const bodyTop = new THREE.Mesh(new THREE.SphereGeometry(0.84, 26, 22), teal);
  bodyTop.position.set(0, 1.22, 0.02);
  bodyTop.scale.set(0.9, 0.74, 0.78);
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
  bill.position.set(0.12, 0.7, 0.88);
  bill.rotation.x = -0.02;
  bill.scale.set(0.88, 0.6, 0.7);
  mascot.add(bill);

  const tail = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createTailShape(), {
      depth: 0.12,
      bevelEnabled: false,
    }),
    tailColor
  );
  tail.geometry.center();
  tail.position.set(0.9, -0.3, -0.82);
  tail.rotation.y = -0.6;
  tail.rotation.z = -0.24;
  tail.scale.set(0.72, 0.92, 0.72);
  mascot.add(tail);

  for (let index = -1; index <= 1; index += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.03, 0.03), tailLine);
    line.position.set(0.9, -0.26 + index * 0.36, -0.73 + Math.abs(index) * 0.01);
    line.rotation.set(0.08, -0.56, index === 0 ? 0 : index * 0.18);
    mascot.add(line);
  }

  for (let index = -1; index <= 1; index += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.18, 0.03), tailLine);
    line.position.set(0.88 + index * 0.18, -0.28, -0.72);
    line.rotation.set(0.08, -0.58, 0.14);
    mascot.add(line);
  }

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.58, 0.12, 30), hatBrown);
  brim.position.set(-0.06, 1.85, 0.18);
  brim.rotation.set(-0.08, 0.06, -0.18);
  brim.scale.set(1.02, 1, 0.82);
  mascot.add(brim);

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.92, 0.82, 22), hatBrown);
  crown.position.set(-0.14, 2.2, 0.14);
  crown.rotation.copy(brim.rotation);
  crown.scale.set(1, 1, 0.88);
  mascot.add(crown);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.98, 0.16, 22), hatBand);
  band.position.set(-0.11, 1.98, 0.16);
  band.rotation.copy(brim.rotation);
  band.scale.set(1, 1, 0.9);
  mascot.add(band);

  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(0.02, 1.15, 0.72);
  mascot.add(eyeGroup);

  const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.33, 24, 20), white);
  leftEyeWhite.position.set(-0.36, 0.03, 0.08);
  leftEyeWhite.scale.set(1.28, 0.74, 0.34);
  leftEyeWhite.rotation.z = -0.26;
  eyeGroup.add(leftEyeWhite);

  const rightEyeWhite = leftEyeWhite.clone();
  rightEyeWhite.position.x = 0.36;
  rightEyeWhite.rotation.z = 0.26;
  eyeGroup.add(rightEyeWhite);

  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 16), pupil);
  leftPupil.position.set(-0.34, 0.02, 0.18);
  leftPupil.scale.set(1.1, 1.4, 0.7);
  eyeGroup.add(leftPupil);

  const rightPupil = leftPupil.clone();
  rightPupil.position.x = 0.34;
  eyeGroup.add(rightPupil);

  const eyeBrowLeft = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.06), teal);
  eyeBrowLeft.position.set(-0.36, 0.3, 0.06);
  eyeBrowLeft.rotation.z = -0.26;
  eyeGroup.add(eyeBrowLeft);

  const eyeBrowRight = eyeBrowLeft.clone();
  eyeBrowRight.position.x = 0.36;
  eyeBrowRight.rotation.z = 0.26;
  eyeGroup.add(eyeBrowRight);

  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0.08, 0.28, 0.94);
  mascot.add(mouthGroup);

  const smirk = new THREE.Mesh(new THREE.TubeGeometry(createSmileCurve(), 24, 0.028, 8, false), mouthMaterial);
  smirk.scale.set(0.88, 0.5, 1);
  smirk.rotation.z = -0.07;
  mouthGroup.add(smirk);

  const openMouth = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mouthInterior);
  openMouth.position.set(-0.02, -0.06, -0.02);
  openMouth.scale.set(1.54, 0.62, 0.4);
  openMouth.visible = false;
  mouthGroup.add(openMouth);

  const angryMouth = new THREE.Mesh(new THREE.TubeGeometry(createFrownCurve(), 24, 0.03, 8, false), mouthMaterial);
  angryMouth.scale.set(0.9, 0.54, 1);
  angryMouth.visible = false;
  mouthGroup.add(angryMouth);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.32, 12), teal);
  leftArm.position.set(-0.74, -0.18, 0.08);
  leftArm.rotation.z = 0.18;
  mascot.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.74;
  rightArm.rotation.z = -0.18;
  mascot.add(rightArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 14), teal);
  leftHand.position.set(-0.84, -0.82, 0.08);
  leftHand.scale.set(0.88, 1.16, 0.72);
  mascot.add(leftHand);

  const rightHand = leftHand.clone();
  rightHand.position.x = 0.84;
  mascot.add(rightHand);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.76, 12), teal);
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
    updateVisuals: (time, pointer, hover, expressionMode, blink) => {
      const eyeScaleY =
        expressionMode === "angry" ? 0.58 : expressionMode === "laugh" ? 0.66 : expressionMode === "mischief" ? 0.74 : 0.84;
      const pupilScaleY =
        expressionMode === "angry" ? 1.02 : expressionMode === "laugh" ? 0.94 : expressionMode === "mischief" ? 1.16 : 1.32;
      const lidTilt = expressionMode === "angry" ? 0.42 : expressionMode === "mischief" ? 0.3 : 0.24;

      leftEyeWhite.scale.y = eyeScaleY * blink;
      rightEyeWhite.scale.y = eyeScaleY * blink;
      leftPupil.scale.y = pupilScaleY * blink;
      rightPupil.scale.y = pupilScaleY * blink;

      leftEyeWhite.rotation.z = -lidTilt;
      rightEyeWhite.rotation.z = lidTilt;
      eyeBrowLeft.rotation.z = -lidTilt - 0.04;
      eyeBrowRight.rotation.z = lidTilt + 0.04;

      const pupilOffsetX = hover ? clamp(pointer.x * 0.07, -0.08, 0.08) : 0;
      const pupilOffsetY = hover ? clamp(pointer.y * 0.05, -0.05, 0.05) : 0.01;
      leftPupil.position.x = -0.34 + pupilOffsetX;
      rightPupil.position.x = 0.34 + pupilOffsetX;
      leftPupil.position.y = 0.02 + pupilOffsetY;
      rightPupil.position.y = 0.02 + pupilOffsetY;

      smirk.visible = expressionMode !== "laugh" && expressionMode !== "angry";
      openMouth.visible = expressionMode === "laugh";
      angryMouth.visible = expressionMode === "angry";

      mouthGroup.position.y = expressionMode === "angry" ? 0.34 : expressionMode === "laugh" ? 0.25 : 0.28;
      mouthGroup.rotation.z = expressionMode === "mischief" ? -0.16 : expressionMode === "angry" ? -0.08 : -0.05;
      bill.rotation.z = expressionMode === "laugh" ? -0.06 : expressionMode === "angry" ? 0.03 : -0.01;
      bill.rotation.x = expressionMode === "laugh" ? -0.06 : 0;

      tail.rotation.z = -0.24 + Math.sin(time * 0.0018) * 0.05;
      leftArm.rotation.z = expressionMode === "laugh" ? 0.42 : 0.18;
      rightArm.rotation.z = expressionMode === "laugh" ? -0.42 : -0.18;
      brim.rotation.z = -0.18 + Math.sin(time * 0.0012) * 0.02;
      crown.rotation.z = brim.rotation.z;
      band.rotation.z = brim.rotation.z;
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
  createRig: createPerryRig,
};

export function PerryMascotStage() {
  return <MascotStage config={perryStageConfig} />;
}
