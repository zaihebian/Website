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

    vec3 graphite = vec3(0.024, 0.028, 0.036);
    vec3 charcoal = vec3(0.055, 0.064, 0.080);
    vec3 silver = vec3(0.60, 0.66, 0.72);
    vec3 aqua = vec3(0.30, 0.56, 0.70);

    vec3 col = mix(graphite, charcoal, smoothstep(0.20, 0.85, far));

    // Volumetric aqua shading in the denser regions of the field.
    col += aqua * 0.085 * smoothstep(0.45, 0.85, v) * (0.65 + 0.35 * sin(depth * 0.8));

    // Soft halo around the currents.
    col += aqua * glow * 0.085;

    // Silver filaments with restrained iridescence.
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (v * 0.8 + depth * 0.12) + vec3(0.0, 0.6, 1.2));
    col += mix(silver, irid, 0.32) * filament * 0.34;

    // The environment evolves subtly between sections.
    col *= 0.94 + 0.08 * sin(uScroll * 4.7 + 1.2);

    float vig = clamp(1.0 - dot(p, p) * 0.5, 0.0, 1.0);
    col *= vig;

    // Fine grain to defeat banding in the deep gradients.
    float g = hash(vec3(gl_FragCoord.xy, mod(uTime, 64.0)));
    col += (g - 0.5) * 0.022;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function FluidScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
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
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [scrollYProgress]);

  return <div ref={mountRef} className="fixed inset-0 -z-10" aria-hidden="true" />;
}
