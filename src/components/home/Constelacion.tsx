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
const CARD_H = 1.75; // 16:10 landscape — uniform frames for a clean swirl

/** Deterministic pseudo-random in [0,1) seeded by an integer. No per-frame RNG. */
function seeded(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A 4:5 plane gently bowed toward the camera (convex), so cards read like
 * curved pages instead of flat rectangles — the subtle curvature in the
 * reference that sells the tornado depth.
 */
function makeCardGeometry(): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 28, 2);
  const pos = geo.attributes.position;
  const halfW = CARD_W / 2;
  const bend = 0.26;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    // Concave around the vertical axis: the side edges come toward the camera
    // and the centre recedes, so every card wraps the same way — like panels on
    // a cylinder. That consistent curl is what forms the swirl.
    pos.setZ(i, -bend * (1 - (x / halfW) ** 2));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

type PlacedCard = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  baseScale: number;
  drift: number;
  phase: number;
};

/**
 * Scatter the projects into a deep 3D cloud. Each card gets a fixed position,
 * a fixed individual 3D tilt (NOT camera-facing), and a depth-based scale —
 * all derived only from its index, so the layout is stable / SSR-safe.
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

  // Jittered grid → even coverage across the frame (like the reference cloud),
  // then deep Z + organic jitter so it never reads as a flat grid.
  const cols = 4;
  const rows = Math.ceil(count / cols);

  projects.forEach((project, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x =
      ((col - (cols - 1) / 2) / ((cols - 1) / 2)) * 7.6 +
      (seeded(i + 3) - 0.5) * 2.2;
    const y =
      (((rows - 1) / 2 - row) / ((rows - 1) / 2)) * 4.6 +
      (seeded(i + 23) - 0.5) * 1.8;
    const z = (seeded(i + 31) - 0.5) * 9.5; // deep → strong perspective + DOF

    // Cover-crop each photo into the landscape frame (no stretching), so
    // portrait and landscape sources all read as uniform horizontal cards.
    const texture = textureLoader.load(project.hero, (tex) => {
      const img = tex.image as { width: number; height: number } | undefined;
      if (!img) return;
      const imgAspect = img.width / img.height;
      const planeAspect = CARD_W / CARD_H;
      tex.center.set(0.5, 0.5);
      if (imgAspect > planeAspect) {
        tex.repeat.set(planeAspect / imgAspect, 1);
      } else {
        tex.repeat.set(1, imgAspect / planeAspect);
      }
      tex.needsUpdate = true;
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textures.push(texture);

    const geometry = makeCardGeometry();
    geometries.push(geometry);

    // Opaque, full-bleed image. Dimming is done via .color, not opacity, so the
    // depth buffer stays intact for the depth-of-field pass.
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    materials.push(material);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    // Gentle individual tilt — the reference cards are mostly front-facing with
    // a soft skew, not aggressively rotated.
    mesh.rotation.x = (seeded(i + 41) - 0.5) * 0.32;
    mesh.rotation.y = (seeded(i + 47) - 0.5) * 0.5;
    mesh.rotation.z = (seeded(i + 53) - 0.5) * 0.22;

    const baseScale = 1; // uniform card size — depth alone varies on-screen size
    mesh.scale.setScalar(baseScale);
    mesh.userData.slug = project.slug;
    group.add(mesh);

    placed.push({
      mesh,
      base: new THREE.Vector3(x, y, z),
      baseScale,
      drift: 0.1 + seeded(i + 67) * 0.16,
      phase: seeded(i + 71) * Math.PI * 2,
    });
  });

  return placed;
}

/**
 * The 12 projects floating as 4:5 cards in a WebGL galaxy with depth-of-field.
 * Each card holds a fixed 3D tilt; the whole cloud spins as a slow downward
 * tornado driven by {@link useScrollRotation}. Hover lifts + sharpens a card
 * and dims the rest; click opens the project. Desktop (`md+`) only; mobile and
 * reduced-motion fall back to a stacked DOM grid.
 */
export function Constelacion() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const angle = useScrollRotation();
  const angleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredProject =
    PROJECTS.find((p) => p.slug === hoveredSlug) ?? null;

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
      return; // No WebGL — DOM fallback still renders.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // transparent → the CSS grid shows through
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
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

    // Depth-of-field: focus on the FRONT of the cloud so cards rotating toward
    // the camera become crisp while those in the back stay soft (like the
    // reference). Camera is at z=13; the nearest cards sit ~8 units away.
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 8.4,
      aperture: 0.00011,
      maxblur: 0.009,
    });
    composer.addPass(bokeh);
    composer.setSize(width, height);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2); // off-screen until first move
    let hovered: THREE.Mesh | null = null;
    const white = new THREE.Color(0xffffff);
    const dim = new THREE.Color(0x8f8f8f); // gentle dim, not blackout

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer!.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

    const render = () => {
      const t = clock.getElapsedTime();

      // Tornado spin: rotate the cloud about a slightly tilted vertical axis.
      group.rotation.y = angleRef.current;
      group.rotation.x = reduced ? 0.0 : Math.sin(t * 0.12) * 0.05;
      group.rotation.z = reduced ? 0.0 : Math.sin(t * 0.08) * 0.03;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(group.children, false);
      const next = (hits[0]?.object as THREE.Mesh | undefined) ?? null;
      if (next !== hovered) {
        hovered = next;
        container.style.cursor = hovered ? "pointer" : "default";
        setHoveredSlug((next?.userData.slug as string | undefined) ?? null);
      }

      cards.forEach((card) => {
        const d = reduced ? 0 : card.drift;
        card.mesh.position.set(
          card.base.x + Math.cos(t * 0.25 + card.phase) * d,
          card.base.y + Math.sin(t * 0.32 + card.phase) * d,
          card.base.z + Math.sin(t * 0.2 + card.phase) * d * 0.5,
        );

        const mat = card.mesh.material as THREE.MeshBasicMaterial;
        const isHovered = card.mesh === hovered;
        const targetScale = card.baseScale * (isHovered ? 1.22 : 1);
        card.mesh.scale.setScalar(
          THREE.MathUtils.lerp(card.mesh.scale.x, targetScale, 0.12),
        );
        // Dim non-hovered cards while something is hovered (color, not opacity).
        const target = !hovered || isHovered ? white : dim;
        mat.color.lerp(target, 0.12);
      });

      composer!.render();
    };

    if (reduced) {
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
      {/* WebGL galaxy — desktop only. */}
      <div className="relative hidden h-screen w-full overflow-hidden bg-milo-black md:block">
        {/* Faint petroleum grid behind the (transparent) canvas, like the reference. */}
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

        {/* Hover pill — project thumbnail + name, bottom-center (like the reference). */}
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
