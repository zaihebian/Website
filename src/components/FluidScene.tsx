"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScroll } from "framer-motion";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec3(7.3, 3.1, 1.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= uRes.x / uRes.y;

    // Scroll advances the camera through fluid depth; time keeps the field alive.
    float depth = uScroll * 4.2;
    float t = uTime * 0.045;

    vec2 drift = uMouse * 0.05;
    vec2 q = p * 1.35 + drift;

    // Domain-warped flow field: the "liquid" structure.
    vec3 P = vec3(q, depth + t);
    float w1 = fbm(P * 1.2);
    float w2 = fbm(P * 1.2 + vec3(5.2, 1.3, 2.8) + w1);
    float v = fbm(P * 1.6 + vec3(w2 * 1.8, w1 * 1.4, 0.0));

    // Slower, larger far layer for parallax depth.
    vec3 Pf = vec3(p * 0.55 + drift * 0.3, depth * 0.5 + t * 0.7);
    float far = fbm(Pf * 1.05);

    // Engineered current filaments: thin iso-contours of the field.
    float bands = abs(fract(v * 6.0 - t * 0.9) - 0.5) * 2.0;
    float filament = pow(1.0 - bands, 20.0);
    float glow = pow(1.0 - bands, 4.0);

    // Light water: paper field, cool mist variation, steel currents.
    vec3 paper = vec3(0.976, 0.984, 0.988);
    vec3 mist = vec3(0.904, 0.930, 0.944);
    vec3 steel = vec3(0.30, 0.41, 0.49);
    vec3 aqua = vec3(0.12, 0.48, 0.62);

    vec3 col = mix(paper, mist, smoothstep(0.20, 0.85, far));

    // Volumetric aqua shading in the denser regions of the field.
    col = mix(col, aqua, 0.075 * smoothstep(0.45, 0.85, v) * (0.65 + 0.35 * sin(depth * 0.8)));

    // Soft halo around the currents.
    col = mix(col, aqua, glow * 0.07);

    // Steel filaments with restrained iridescence: the currents read as
    // shadowed lines on paper rather than glowing lines on graphite.
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (v * 0.8 + depth * 0.12) + vec3(0.0, 0.6, 1.2));
    col = mix(col, mix(steel, irid * 0.5 + 0.3, 0.28), filament * 0.3);

    // The environment evolves subtly between sections.
    col *= 0.997 + 0.008 * sin(uScroll * 4.7 + 1.2);

    float vig = clamp(1.0 - dot(p, p) * 0.34, 0.0, 1.0);
    col = mix(vec3(0.918, 0.933, 0.941), col, vig);

    // Fine grain to defeat banding in the light gradients.
    float g = hash(vec3(gl_FragCoord.xy, mod(uTime, 64.0)));
    col += (g - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const FALLBACK_BACKGROUND =
  "radial-gradient(120% 90% at 20% 0%, #ffffff 0%, #f2f6f8 55%, #e9eef1 100%)";

let warnedAboutMissingWebGL = false;

export default function FluidScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // WebGL is optional: enterprise policies, old GPUs, remote desktops and VMs can
    // refuse a context. Throwing here used to unmount the whole page (white screen),
    // so degrade to a static gradient instead.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (error) {
      mount.style.background = FALLBACK_BACKGROUND;
      if (!warnedAboutMissingWebGL) {
        warnedAboutMissingWebGL = true;
        console.warn("[FluidScene] WebGL unavailable, using the static background", error);
      }
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const mouseTarget = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      if (reduceMotion) renderer.render(scene, camera);
    };

    window.addEventListener("resize", onResize);

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    // A lost context (driver reset, GPU switch, tab suspended too long) must not
    // leave a black or frozen layer behind.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      mount.style.background = FALLBACK_BACKGROUND;
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);

    const frame = () => {
      if (!running) return;
      uniforms.uTime.value += clock.getDelta();
      // Heavy damping makes the depth travel feel viscous rather than reactive.
      uniforms.uScroll.value += (scrollYProgress.get() - uniforms.uScroll.value) * 0.05;
      uniforms.uMouse.value.lerp(mouseTarget, 0.04);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    };

    let unsubScroll: (() => void) | undefined;

    if (reduceMotion) {
      // Static frame; depth still updates on scroll so the page is never a dead poster.
      uniforms.uScroll.value = scrollYProgress.get();
      renderer.render(scene, camera);
      unsubScroll = scrollYProgress.on("change", (latest) => {
        uniforms.uScroll.value = latest;
        renderer.render(scene, camera);
      });
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      unsubScroll?.();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [scrollYProgress]);

  return <div ref={mountRef} className="fixed inset-0 -z-10" aria-hidden="true" />;
}
