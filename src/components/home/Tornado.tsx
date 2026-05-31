"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { PROJECTS, type Project } from "@/data/projects";
import { useScrollRotation } from "@/hooks/useScrollRotation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TarjetaProyecto } from "./TarjetaProyecto";

const CARD_W = 2.8;
const CARD_H = 1.75; // 16:10
const RADIUS = 4.4;

/** Deterministic pseudo-random in [0,1) seeded by an integer. No per-frame RNG. */
function seeded(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Lightweight texture URL via the Next image optimizer (≈80KB, not the 2-3MB
 *  original). 640 / q75 are Next's default-allowed width and quality. */
function texUrl(src: string): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;
}

/**
 * 4:5… no — a landscape plane bowed CONVEX (centre toward the camera) so each
 * card wraps the outside of the tornado column it sits on.
 */
function makeCardGeometry(): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 28, 2);
  const pos = geo.attributes.position;
  const halfW = CARD_W / 2;
  const bend = 0.5;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, bend * (1 - (x / halfW) ** 2));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

type PlacedCard = {
  mesh: THREE.Mesh;
  baseY: number;
  phase: number;
  appearAt: number;
};

/**
 * Arrange the projects on a vertical funnel (a cone, narrower at the bottom).
 * Each card orbits the central axis and faces OUTWARD, so when the group spins
 * the cloud reads as a turning tornado. Layout is seeded → stable / SSR-safe.
 */
function placeCards(
  projects: Project[],
  group: THREE.Group,
  loader: THREE.TextureLoader,
  textures: THREE.Texture[],
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[],
): PlacedCard[] {
  const placed: PlacedCard[] = [];
  const count = projects.length;

  projects.forEach((project, i) => {
    const theta = (i / count) * Math.PI * 2 + (seeded(i) - 0.5) * 0.5;
    const y = (seeded(i + 23) - 0.5) * 7.2;
    // Funnel: radius shrinks toward the bottom.
    const coneR =
      (RADIUS + (seeded(i + 11) - 0.5) * 0.7) * (0.62 + 0.38 * ((y + 3.6) / 7.2));
    const x = Math.sin(theta) * coneR;
    const z = Math.cos(theta) * coneR;

    const texture = loader.load(texUrl(project.hero), (tex) => {
      const img = tex.image as { width: number; height: number } | undefined;
      if (!img) return;
      const imgAspect = img.width / img.height;
      const planeAspect = CARD_W / CARD_H;
      tex.center.set(0.5, 0.5);
      if (imgAspect > planeAspect) tex.repeat.set(planeAspect / imgAspect, 1);
      else tex.repeat.set(1, imgAspect / planeAspect);
      tex.needsUpdate = true;
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textures.push(texture);

    const geometry = makeCardGeometry();
    geometries.push(geometry);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    materials.push(material);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = theta; // face outward from the column
    mesh.rotation.x = (seeded(i + 41) - 0.5) * 0.12;
    mesh.rotation.z = (seeded(i + 53) - 0.5) * 0.08;
    mesh.scale.setScalar(0.001);
    mesh.userData.slug = project.slug;
    group.add(mesh);

    placed.push({
      mesh,
      baseY: y,
      phase: seeded(i + 71) * Math.PI * 2,
      appearAt: i * 0.06,
    });
  });

  return placed;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The 12 projects turning as a tornado of curved, uniform landscape cards with
 * depth-of-field (front crisp, back soft). Scroll drives the spin over a slow
 * idle rotation; hover surfaces a name pill; click opens the project. Desktop
 * only; mobile / reduced-motion fall back to a stacked DOM grid.
 */
export function Tornado() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const angle = useScrollRotation();
  const angleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredProject = PROJECTS.find((p) => p.slug === hoveredSlug) ?? null;

  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const textures: THREE.Texture[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let renderer: THREE.WebGLRenderer | null = null;
    let composer: EffectComposer | null = null;
    let frame = 0;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

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

    // Depth-of-field: keep the front of the column crisp, blur only the back.
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 9.2,
      aperture: 0.00006,
      maxblur: 0.006,
    });
    composer.addPass(bokeh);
    composer.setSize(width, height);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    let hovered: THREE.Mesh | null = null;
    const white = new THREE.Color(0xffffff);
    const dimC = new THREE.Color(0x9a9a9a);

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer!.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onClick = () => {
      const slug = hovered?.userData.slug as string | undefined;
      if (slug) router.push(`/proyectos/${slug}`);
    };
    const onResize = () => {
      if (!renderer || !composer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    // Smooth the spin so it never snaps (organic, not robotic).
    let spin = angleRef.current;

    const render = () => {
      const t = clock.getElapsedTime();

      spin += (angleRef.current - spin) * 0.06;
      group.rotation.y = spin;
      group.rotation.x = reduced ? 0 : Math.sin(t * 0.1) * 0.03;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(group.children, false);
      const next = (hits[0]?.object as THREE.Mesh | undefined) ?? null;
      if (next !== hovered) {
        hovered = next;
        container.style.cursor = hovered ? "pointer" : "default";
        setHoveredSlug((next?.userData.slug as string | undefined) ?? null);
      }

      cards.forEach((card) => {
        const appear = reduced
          ? 1
          : easeOutCubic(THREE.MathUtils.clamp((t - card.appearAt) / 0.8, 0, 1));
        // Gentle vertical bob — soft, not mechanical.
        card.mesh.position.y =
          card.baseY + (reduced ? 0 : Math.sin(t * 0.5 + card.phase) * 0.12);

        const mat = card.mesh.material as THREE.MeshBasicMaterial;
        const isHovered = card.mesh === hovered;
        const target = appear * (isHovered ? 1.16 : 1);
        card.mesh.scale.setScalar(
          THREE.MathUtils.lerp(card.mesh.scale.x, target, 0.1),
        );
        mat.color.lerp(!hovered || isHovered ? white : dimC, 0.1);
      });

      composer!.render();
    };

    if (reduced) {
      cards.forEach((c) => c.mesh.scale.setScalar(1));
      spin = angleRef.current;
      group.rotation.y = spin;
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
      composer?.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [reduced, router]);

  return (
    <>
      {/* WebGL tornado — desktop only. */}
      <div className="relative hidden h-screen w-full overflow-hidden bg-milo-black md:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(var(--milo-petroleum) 1px, transparent 1px), linear-gradient(90deg, var(--milo-petroleum) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div ref={containerRef} className="absolute inset-0" />

        {hoveredProject && (
          <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-paper py-2 pl-2 pr-5 shadow-xl">
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full">
              <Image
                src={hoveredProject.hero}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <span className="text-sm font-medium tracking-tight text-petroleum">
              {hoveredProject.title}
            </span>
          </div>
        )}
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
