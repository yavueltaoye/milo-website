"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { PROJECTS, type Project } from "@/data/projects";
import { useScrollRotation } from "@/hooks/useScrollRotation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TarjetaProyecto } from "./TarjetaProyecto";

const CARD_W = 1.6;
const CARD_H = 2.0;

/** Deterministic pseudo-random in [0,1) seeded by an integer. No per-frame RNG. */
function seeded(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type PlacedCard = {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  orbit: number;
  drift: number;
  phase: number;
};

/**
 * Deterministically scatter the projects into a galaxy-like cloud. Each card
 * gets a fixed radius / angle / depth derived only from its index, so the
 * layout is stable across renders and SSR-safe.
 */
function placeCards(
  projects: Project[],
  group: THREE.Group,
  textureLoader: THREE.TextureLoader,
  textures: THREE.Texture[],
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[],
): PlacedCard[] {
  const placed: PlacedCard[] = [];
  const count = projects.length;

  projects.forEach((project, i) => {
    const angle = (i / count) * Math.PI * 2 + seeded(i) * 0.8;
    const radius = 2.6 + seeded(i + 11) * 3.4;
    const y = (seeded(i + 23) - 0.5) * 6.0;
    const z = (seeded(i + 31) - 0.5) * 5.0;

    const x = Math.cos(angle) * radius;
    const baseY = y;
    const baseZ = Math.sin(angle) * radius * 0.6 + z;

    const texture = textureLoader.load(project.hero);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);

    const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
    geometries.push(geometry);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    });
    materials.push(material);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, baseY, baseZ);
    mesh.rotation.z = (seeded(i + 41) - 0.5) * 0.5;
    mesh.userData.slug = project.slug;
    group.add(mesh);

    placed.push({
      mesh,
      baseX: x,
      baseY,
      baseZ,
      radius,
      orbit: angle,
      drift: 0.12 + seeded(i + 53) * 0.18,
      phase: seeded(i + 67) * Math.PI * 2,
    });
  });

  return placed;
}

/**
 * C4 centerpiece — the 12 projects floating as 4:5 cards in a WebGL galaxy.
 * The whole group rotates as a slow downward tornado driven by
 * {@link useScrollRotation}; hovering a card lifts and brightens it while the
 * rest dim, and clicking opens the project. Heavy WebGL only runs on `md+`;
 * mobile and reduced-motion fall back to a stacked DOM grid of cards. Renderer
 * creation is guarded so a missing/zero-size WebGL context never throws.
 */
export function Constelacion() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const angle = useScrollRotation();
  const angleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mirror the live rotation angle into a ref the rAF loop can read.
  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Bail on zero-size containers (hidden on mobile / jsdom).
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const textures: THREE.Texture[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let renderer: THREE.WebGLRenderer | null = null;
    let frame = 0;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL context (e.g. jsdom / unsupported browser) — fail silently;
      // the DOM fallback grid still renders.
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const group = new THREE.Group();
    scene.add(group);

    const cards = placeCards(
      PROJECTS,
      group,
      new THREE.TextureLoader(),
      textures,
      geometries,
      materials,
    );

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered: THREE.Mesh | null = null;
    const pointerNDC = new THREE.Vector2(2, 2); // off-screen until first move

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer!.domElement.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.x = pointerNDC.x;
      pointer.y = pointerNDC.y;
    };

    const onClick = () => {
      if (hovered) {
        const slug = hovered.userData.slug as string | undefined;
        if (slug) router.push(`/proyectos/${slug}`);
      }
    };

    const onResize = () => {
      if (!renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();

    const render = () => {
      const t = clock.getElapsedTime();

      // Tornado: tilt the group and rotate it by the accumulated angle so
      // lower / outer cards sweep the widest arc. Idle keeps spinning down.
      group.rotation.y = angleRef.current;
      group.rotation.x = reduced ? 0.18 : 0.18 + Math.sin(t * 0.15) * 0.04;

      // Raycast for hover.
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(group.children, false);
      const next = (hits[0]?.object as THREE.Mesh | undefined) ?? null;
      if (next !== hovered) {
        hovered = next;
        container.style.cursor = hovered ? "pointer" : "default";
      }

      cards.forEach((card) => {
        const drift = reduced ? 0 : card.drift;
        // Subtle per-card orbital + sinusoidal drift, deterministic by phase.
        card.mesh.position.x =
          card.baseX + Math.cos(t * 0.3 + card.phase) * drift;
        card.mesh.position.y =
          card.baseY + Math.sin(t * 0.4 + card.phase) * drift;
        card.mesh.position.z =
          card.baseZ + Math.sin(t * 0.25 + card.phase) * drift * 0.5;

        // Always face roughly toward the camera, with a touch of individuality.
        card.mesh.lookAt(camera.position);
        card.mesh.rotation.z += (seeded(card.orbit) - 0.5) * 0.06;

        const material = card.mesh.material as THREE.MeshBasicMaterial;
        const isHovered = card.mesh === hovered;
        const targetScale = isHovered ? 1.18 : 1;
        const targetOpacity = hovered ? (isHovered ? 1 : 0.45) : 1;
        card.mesh.scale.setScalar(
          THREE.MathUtils.lerp(card.mesh.scale.x, targetScale, 0.12),
        );
        material.opacity = THREE.MathUtils.lerp(
          material.opacity,
          targetOpacity,
          0.12,
        );
      });

      renderer!.render(scene, camera);
    };

    if (reduced) {
      // Static single frame, no animation loop.
      group.rotation.y = angleRef.current;
      render();
    } else {
      const loop = () => {
        render();
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tex) => tex.dispose());
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
    // `reduced` rebuilds the scene; the live angle is read via angleRef inside
    // the loop, never as a dependency, so the rAF loop is stable.
  }, [reduced, router]);

  return (
    <>
      {/* WebGL galaxy — desktop only. */}
      <div className="relative hidden h-screen w-full overflow-hidden md:block">
        {/* Faint petroleum grid behind the (transparent) canvas. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--milo-petroleum) 1px, transparent 1px), linear-gradient(90deg, var(--milo-petroleum) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      {/* DOM fallback — mobile. */}
      <div className="grid grid-cols-2 gap-4 px-(--gutter) py-24 md:hidden">
        {PROJECTS.map((project) => (
          <TarjetaProyecto key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
