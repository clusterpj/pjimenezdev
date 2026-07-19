"use client";

import React from "react";
import * as THREE from "three";

/**
 * AI-reactive WebGL particle field behind the hero concierge.
 * Idle: slow amber drift. Input focus → listening blue. Concierge
 * processing/responding → violet family, field breathes inward.
 * Loaded post-TTI via next/dynamic — never in the critical path.
 *
 * Signals in:
 *  - "pj:ai-state" CustomEvent (detail: "idle" | "processing" | "responding") from useConciergeChat
 *  - focusin/focusout on .cc-input → listening
 *  - "pj:burst" CustomEvent or the Konami code → shockwave
 */

const STATE_TARGET: Record<string, number> = { idle: 0, listening: 1, processing: 2, responding: 3 };

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uState;
  uniform float uBurst;
  uniform vec2 uPointer;
  varying float vSeed;

  void main() {
    vec3 p = position;
    float t = uTime * (0.10 + 0.08 * fract(aSeed * 7.0));

    // idle drift — slow, breathing (2–4s cycles per the design brief)
    p.x += sin(t + aSeed * 6.283) * 2.2;
    p.y += cos(t * 0.8 + aSeed * 12.0) * 1.8;

    // pointer repulsion — field parts around the cursor
    vec2 d = p.xy - uPointer;
    p.xy += normalize(d + 1e-4) * smoothstep(6.0, 0.0, length(d)) * 2.2;

    // AI activity — the field leans toward the concierge as state rises
    float activity = clamp(uState, 0.0, 3.0) / 3.0;
    p.xy -= p.xy * activity * (0.14 + 0.06 * sin(uTime * 2.2 + aSeed * 20.0));

    // burst shockwave (Konami)
    p.xy += normalize(p.xy + 1e-4) * uBurst * 22.0 * (0.4 + fract(aSeed * 3.7));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + 2.6 * fract(aSeed * 5.3)) * (150.0 / -mv.z);
    vSeed = aSeed;
  }
`;

const FRAG = /* glsl */ `
  uniform float uState;
  uniform float uBurst;
  varying float vSeed;

  void main() {
    float a = smoothstep(0.5, 0.08, length(gl_PointCoord - 0.5));
    // brand amber → AI violet family; the two systems never mix statically,
    // the field *transitions* between them with real AI events
    vec3 amber   = vec3(1.000, 0.698, 0.243);  // --accent
    vec3 listen  = vec3(0.431, 0.545, 1.000);  // --ai-listening
    vec3 process = vec3(0.608, 0.420, 1.000);  // --ai-processing
    vec3 respond = vec3(0.784, 0.659, 1.000);  // --ai-responding
    vec3 c = mix(amber, listen, clamp(uState, 0.0, 1.0));
    c = mix(c, process, clamp(uState - 1.0, 0.0, 1.0));
    c = mix(c, respond, clamp(uState - 2.0, 0.0, 1.0));
    c += uBurst * 0.6; // white-hot flash on burst
    gl_FragColor = vec4(c, a * (0.28 + 0.30 * fract(vSeed * 9.1)));
  }
`;

export default function HeroField() {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return; // no WebGL — the hero works fine without the field
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 200);
    camera.position.z = 60;
    const visH = 2 * 60 * Math.tan((25 * Math.PI) / 180);

    const count = window.innerWidth < 768 ? 700 : 1600;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const spreadX = (visH * (window.innerWidth / Math.max(window.innerHeight, 1)) * 1.15) / 2;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * spreadX;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * (visH * 0.62);
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    const uniforms = {
      uTime: { value: 0 },
      uState: { value: 0 },
      uBurst: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geo, mat));

    let chatState = 0;   // from concierge events
    let focusState = 0;  // listening while the input is focused
    let burst = 0;
    let raf = 0;
    let running = false;
    const clock = new THREE.Clock();

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      // updateStyle must stay true: with DPR > 1 the buffer is larger than the
      // host, and without CSS sizing the canvas overflows → pointer misalignment
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();

    const tick = () => {
      const target = Math.max(chatState, focusState);
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uState.value += (target - uniforms.uState.value) * 0.04;
      burst *= 0.94;
      uniforms.uBurst.value = burst;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // only animate while the hero is on screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(host);

    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      uniforms.uPointer.value.set(nx * (visH * camera.aspect) / 2, ny * visH / 2);
    };
    const onAiState = (e: Event) => {
      chatState = STATE_TARGET[(e as CustomEvent).detail] ?? 0;
    };
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.classList?.contains("cc-input")) focusState = 1;
    };
    const onFocusOut = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.classList?.contains("cc-input")) focusState = 0;
    };
    const onBurst = () => { burst = 1; };

    let konamiAt = 0;
    const onKey = (e: KeyboardEvent) => {
      konamiAt = e.key === KONAMI[konamiAt] ? konamiAt + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (konamiAt === KONAMI.length) { konamiAt = 0; burst = 1; }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pj:ai-state", onAiState);
    window.addEventListener("pj:burst", onBurst);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", resize);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pj:ai-state", onAiState);
      window.removeEventListener("pj:burst", onBurst);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", resize);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, animation: "hf-fade 1.8s var(--ease-out-expo) forwards" }}
    />
  );
}
