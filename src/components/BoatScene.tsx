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

    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 32),
      new THREE.MeshBasicMaterial({ color: "#d6b07e", transparent: true, opacity: 0.7 })
    );
    sun.position.set(3.9, 1.55, 0);
    root.add(sun);

    const waterMaterial = new THREE.MeshBasicMaterial({ color: "#d8c2a2", transparent: true, opacity: 0.8 });
    const waterLines = Array.from({ length: 4 }, (_, index) => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(9.8 - index * 1.1, 0.14), waterMaterial.clone());
      line.position.set(0, -1.24 - index * 0.34, 0);
      root.add(line);
      return line;
    });

    const wakeLines = Array.from({ length: 3 }, (_, index) => {
      const wake = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1 - index * 0.18, 0.06),
        new THREE.MeshBasicMaterial({ color: "#eadcc4", transparent: true, opacity: 0.75 - index * 0.15 })
      );
      wake.position.set(-1.7 - index * 0.35, -1.18 - index * 0.08, 0);
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

    const mast = new THREE.Mesh(
      new THREE.PlaneGeometry(0.07, 1.48),
      new THREE.MeshBasicMaterial({ color: "#7c6349" })
    );
    mast.position.set(0.05, 0.78, 0);
    boat.add(mast);

    const sailShape = new THREE.Shape();
    sailShape.moveTo(0, 1.34);
    sailShape.lineTo(0.92, 0.82);
    sailShape.lineTo(0, 0.18);
    sailShape.closePath();

    const sail = new THREE.Mesh(
      new THREE.ShapeGeometry(sailShape),
      new THREE.MeshBasicMaterial({ color: "#f6efe0" })
    );
    sail.position.set(0.08, 0.04, 0);
    boat.add(sail);

    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.12),
      new THREE.MeshBasicMaterial({ color: "#9d5e4c" })
    );
    flag.position.set(0.3, 1.42, 0);
    boat.add(flag);

    boat.position.set(-1.15, -0.9, 0);
    boat.rotation.z = -0.04;

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
      const drift = Math.sin(time * 0.00028) * 1.45;
      boat.position.x = -1.15 + drift;
      boat.position.y = -0.9 + Math.sin(time * 0.0018) * 0.08;
      boat.rotation.z = -0.04 + Math.sin(time * 0.0015) * 0.045;
      sail.rotation.z = Math.sin(time * 0.0011) * 0.03;
      flag.scale.y = 1 + Math.sin(time * 0.0042) * 0.12;

      waterLines.forEach((line, index) => {
        line.position.x = Math.sin(time * 0.0006 + index) * (0.18 + index * 0.04);
      });

      wakeLines.forEach((wake, index) => {
        wake.position.x = boat.position.x - 1.55 - index * 0.34 + Math.sin(time * 0.0014 + index) * 0.04;
        wake.position.y = boat.position.y - 0.18 - index * 0.08;
      });

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

  return <div ref={mountRef} className="h-44 w-full overflow-hidden border-t border-border/60 md:h-52" aria-hidden="true" />;
}
