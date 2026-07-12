import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BoatScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 3, -3, 0.1, 20);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const root = new THREE.Group();
    scene.add(root);
    root.scale.setScalar(1.12);
    root.position.y = -0.1;

    const cloudMaterial = new THREE.MeshBasicMaterial({ color: "#bfae97", transparent: true, opacity: 0.48 });
    const cloudPuffs = [
      { x: -3.8, y: 1.76, sx: 1.6, sy: 0.54 },
      { x: -2.6, y: 1.54, sx: 1.2, sy: 0.46 },
      { x: -0.8, y: 1.82, sx: 1.8, sy: 0.58 },
      { x: 0.6, y: 1.52, sx: 1.24, sy: 0.44 },
      { x: 2.8, y: 1.74, sx: 1.74, sy: 0.56 },
      { x: 4.2, y: 1.48, sx: 1.16, sy: 0.42 },
    ].map(({ x, y, sx, sy }) => {
      const puff = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), cloudMaterial.clone());
      puff.position.set(x, y, 0);
      puff.scale.set(sx, sy, 1);
      root.add(puff);
      return puff;
    });

    const lightning = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 1.36),
      new THREE.MeshBasicMaterial({ color: "#f6efe0", transparent: true, opacity: 0 })
    );
    lightning.position.set(0.24, 0.98, 0);
    lightning.rotation.z = 0.18;
    root.add(lightning);

    const waterMaterial = new THREE.MeshBasicMaterial({ color: "#ccb291", transparent: true, opacity: 0.88 });
    const waterLines = Array.from({ length: 5 }, (_, index) => {
      const waveShape = new THREE.Shape();
      const width = 5.4 - index * 0.38;
      const amplitude = 0.18 + index * 0.012;
      const thickness = 0.14 + index * 0.015;
      const steps = 10;

      waveShape.moveTo(-width, 0);
      for (let step = 1; step <= steps; step += 1) {
        const x = -width + (step / steps) * width * 2;
        const y = Math.sin((step / steps) * Math.PI * 2) * amplitude;
        waveShape.lineTo(x, y);
      }
      for (let step = steps; step >= 0; step -= 1) {
        const x = -width + (step / steps) * width * 2;
        const y = Math.sin((step / steps) * Math.PI * 2) * amplitude - thickness;
        waveShape.lineTo(x, y);
      }
      waveShape.closePath();

      const line = new THREE.Mesh(new THREE.ShapeGeometry(waveShape), waterMaterial.clone());
      line.position.set(0, -0.96 - index * 0.34, 0);
      root.add(line);
      return { line, amplitude };
    });

    const wakeLines = Array.from({ length: 4 }, (_, index) => {
      const wake = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5 - index * 0.2, 0.08),
        new THREE.MeshBasicMaterial({ color: "#eadcc4", transparent: true, opacity: 0.7 - index * 0.12 })
      );
      wake.position.set(-2.1 - index * 0.42, -1.02 - index * 0.1, 0);
      root.add(wake);
      return wake;
    });

    const boat = new THREE.Group();
    root.add(boat);

    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1.05, 0.02);
    hullShape.lineTo(1.06, 0.02);
    hullShape.quadraticCurveTo(0.76, -0.56, 0.06, -0.58);
    hullShape.quadraticCurveTo(-0.68, -0.54, -1.05, 0.02);

    const hull = new THREE.Mesh(
      new THREE.ShapeGeometry(hullShape),
      new THREE.MeshBasicMaterial({ color: "#7e302f" })
    );
    boat.add(hull);

    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.22, 0.02), new THREE.MeshBasicMaterial({ color: "#8b6a4f" }));
    mast.position.set(0.05, 0.64, 0);
    boat.add(mast);

    const sailShape = new THREE.Shape();
    sailShape.moveTo(0, 1.34);
    sailShape.lineTo(0.92, 0.82);
    sailShape.lineTo(0, 0.18);
    sailShape.closePath();

    const sail = new THREE.Mesh(
      new THREE.ShapeGeometry(sailShape),
      new THREE.MeshBasicMaterial({ color: "#c7a07b" })
    );
    sail.position.set(0.08, 0.04, 0);
    boat.add(sail);

    boat.scale.setScalar(1.62);
    boat.position.set(-1.34, -0.58, 0);
    boat.rotation.z = -0.08;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height);
      const aspect = width / height;
      camera.left = -6 * aspect;
      camera.right = 6 * aspect;
      camera.top = 3;
      camera.bottom = -3;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    const animate = (time: number) => {
      const drift = Math.sin(time * 0.00042) * 2.05;
      const swell = Math.sin(time * 0.0026) * 0.22;
      boat.position.x = -1.34 + drift;
      boat.position.y = -0.58 + swell;
      boat.rotation.z = -0.08 + Math.sin(time * 0.0022) * 0.16;
      boat.rotation.x = Math.sin(time * 0.0018) * 0.04;
      sail.rotation.z = Math.sin(time * 0.003) * 0.1;

      waterLines.forEach(({ line, amplitude }, index) => {
        line.position.x = Math.sin(time * 0.0011 + index * 0.9) * (0.42 + index * 0.06);
        line.position.y = -0.96 - index * 0.34 + Math.sin(time * 0.0018 + index) * 0.08;
        line.rotation.z = Math.sin(time * 0.001 + index) * 0.02;
        line.scale.y = 1 + Math.sin(time * 0.0024 + index) * (amplitude * 0.9);
      });

      wakeLines.forEach((wake, index) => {
        wake.position.x = boat.position.x - 2.05 - index * 0.44 + Math.sin(time * 0.0034 + index) * 0.1;
        wake.position.y = boat.position.y - 0.08 - index * 0.1 + Math.sin(time * 0.0022 + index) * 0.05;
        wake.rotation.z = Math.sin(time * 0.0028 + index) * 0.08;
      });

      cloudPuffs.forEach((puff, index) => {
        puff.position.x += Math.sin(time * 0.00018 + index) * 0.0022;
        puff.position.y += Math.sin(time * 0.00035 + index) * 0.0008;
      });

      const flashGate = Math.sin(time * 0.0017);
      lightning.material.opacity = flashGate > 0.992 ? 0.82 : flashGate > 0.975 ? 0.38 : 0;
      lightning.scale.y = 1 + Math.sin(time * 0.008) * 0.08;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    mount.appendChild(renderer.domElement);
    resize();
    frame = window.requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="h-80 w-full overflow-hidden border-t border-border/60 md:h-[34rem]" aria-hidden="true" />;
}
