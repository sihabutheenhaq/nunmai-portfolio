"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotionPref } from "@/lib/hooks";

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Original shader: a light beam that flares out where it lands on the product window,
// with flowing filaments along the flare, drifting smoke, pooled light and rising dust.
const FRAG = `
precision highp float;
uniform vec2 uRes;      // canvas size in CSS px
uniform float uScale;   // render pixels per CSS px
uniform float uTime;
uniform vec2 uBeam;     // beam x, window top y (CSS px from the canvas's top-left)
uniform float uTopFade; // y above which the beam fades out (small screens), else far negative
uniform vec4 uWin;      // product window: left, top, right, bottom (CSS px)
uniform float uRadius;  // window corner radius (CSS px)

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

// Signed distance to a rounded box (negative inside)
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// Distance travelled along the window's outline from where the beam lands:
// along the top edge, round the rounded corner, then down the side.
float perimeter(vec2 p) {
  float R = uRadius;
  float bx = uBeam.x;
  float cy = uWin.y + R;
  if (p.x >= bx) {
    float cx = uWin.z - R;
    float s0 = max(cx - bx, 0.0);
    if (p.x <= cx) return p.x - bx;
    if (p.y <= cy) return s0 + R * clamp(atan(p.x - cx, cy - p.y), 0.0, 1.5708);
    return s0 + R * 1.5708 + (p.y - cy);
  }
  float cx = uWin.x + R;
  float s0 = max(bx - cx, 0.0);
  if (p.x >= cx) return bx - p.x;
  if (p.y <= cy) return s0 + R * clamp(atan(cx - p.x, cy - p.y), 0.0, 1.5708);
  return s0 + R * 1.5708 + (p.y - cy);
}

void main() {
  vec2 px = gl_FragCoord.xy / uScale;
  float x = px.x;
  float y = uRes.y - px.y;
  float t = uTime;
  float dx = x - uBeam.x;
  float d = uBeam.y - y;          // height above the window's top edge
  float dd = max(d, 0.0);
  float above = step(0.0, d);

  // Drifting smoke, brightest around the beam and where it lands
  vec2 q = vec2(x, y) / 420.0;
  vec2 warp = vec2(fbm(q + vec2(0.0, t * 0.035)), fbm(q + vec2(5.2, 1.3) - vec2(t * 0.025, 0.0)));
  float smoke = fbm(q * 1.4 + warp * 1.7 + vec2(t * 0.02, t * 0.05));
  float nearBeam = exp(-abs(dx) / 480.0);
  float nearFloor = exp(-dd / 420.0);
  vec3 col = vec3(0.008, 0.024, 0.015);
  col += vec3(0.06, 0.17, 0.10) * smoke * smoke * (0.22 + 2.2 * nearBeam * nearFloor + 0.5 * nearBeam);

  // Beam half-width grows hyperbolically toward the window: the flare
  float w = 1.4 + 380.0 * pow(22.0 / (dd + 22.0), 1.45);
  float u = dx / w;
  float along = log(dd + 22.0);   // stream coordinate; filaments speed up near the window
  float streams = fbm(vec2(u * 2.4, along * 5.0 - t * 1.1));
  float fil = pow(noise(vec2(u * 9.0, along * 9.0 - t * 1.8)), 3.0);
  float flow = 0.55 + 0.8 * streams + 0.9 * fil;

  float core = exp(-u * u * 1.6);
  float glow = exp(-abs(u) * 0.9) * flow;
  float halo = exp(-abs(dx) / (w * 4.0 + 90.0));
  float fade = mix(0.55, 1.0, smoothstep(0.0, 420.0, y)) * smoothstep(uTopFade - 90.0, uTopFade + 140.0, y);

  vec3 white = vec3(1.0, 1.0, 0.95);
  vec3 lime = vec3(0.78, 0.93, 0.58);
  vec3 green = vec3(0.42, 0.70, 0.26);
  vec3 teal = vec3(0.16, 0.55, 0.42);
  vec3 tint = mix(lime, teal, smoothstep(-260.0, 420.0, dx) * 0.55);
  // Over the window the flare stops at its edge (the window covers the rest); beside the
  // window there is nothing to land on, so fade it out softly instead of a hard horizon line.
  float overWinSoft = smoothstep(uWin.x - 40.0, uWin.x + 40.0, x) * (1.0 - smoothstep(uWin.z - 40.0, uWin.z + 40.0, x));
  float floorMask = above * mix(smoothstep(0.0, 150.0, d), 1.0, overWinSoft);
  col += (white * core * 1.5 + tint * glow * 0.85 + green * halo * 0.35) * fade * floorMask;

  // Light pooling on the window, only over its width
  float overWin = smoothstep(uWin.x - 10.0, uWin.x + 60.0, x) * (1.0 - smoothstep(uWin.z - 60.0, uWin.z + 10.0, x));
  float pool = exp(-dd / 60.0) * exp(-abs(dx) / 380.0) * (0.6 + 0.6 * streams) * overWin;
  col += lime * pool * 0.6 * above;

  // Light running along the window's outline: out from the impact, round the corners, down the sides
  vec2 wc = vec2(uWin.x + uWin.z, uWin.y + uWin.w) * 0.5;
  vec2 wb = vec2(uWin.z - uWin.x, uWin.w - uWin.y) * 0.5;
  float sd = sdRoundBox(vec2(x, y) - wc, wb, uRadius);
  float so = max(sd, 0.0);
  float outside = smoothstep(-2.0, 0.5, sd); // no glow under the window (its faded bottom lets the canvas show)
  float s = perimeter(vec2(x, y));
  float reach = exp(-s / 700.0);
  float sideFade = 1.0 - smoothstep(180.0, 480.0, max(y - uWin.y, 0.0));
  float eflow = fbm(vec2(s / 70.0 - t * 1.6, so / 14.0));   // streams moving outward along the edge
  float hairline = exp(-so / 2.5);
  float sheen = exp(-so / 16.0) * (0.45 + 0.9 * eflow);
  float bloom = exp(-so / 60.0) * (0.55 + 0.6 * eflow);
  vec3 sheenCol = mix(lime, teal, smoothstep(0.0, 34.0, so));
  col += (white * hairline * 1.8 + sheenCol * sheen * 1.6 + green * bloom * 0.6) * reach * sideFade * outside;

  // Fine dust rising through the light: one soft round speck in a few of the 16px cells
  vec2 dp = vec2(x, y + t * 26.0) / 16.0;
  vec2 cell = floor(dp);
  float r = hash(cell);
  vec2 spot = vec2(hash(cell + 7.1), hash(cell + 3.7)) * 0.7 + 0.15;
  float speck = smoothstep(0.11, 0.0, length(fract(dp) - spot)) * step(0.93, r);
  float twinkle = 0.5 + 0.5 * sin(t * 2.5 + r * 60.0);
  col += lime * speck * twinkle * exp(-abs(dx) / 240.0) * exp(-dd / 650.0) * 1.6 * above;

  col = 1.0 - exp(-col * 1.35);
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("HeroBeam shader:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

/**
 * Full-hero WebGL canvas. The beam lands on the top edge of `stageRef` (the product window's
 * wrapper) at the fraction given by its CSS `--beam` variable, so layout and RTL stay in CSS.
 * Pauses off-screen and when `paused`; draws one still frame for reduced motion.
 */
export function HeroBeam({ stageRef, paused }: { stageRef: RefObject<HTMLDivElement | null>; paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const reduce = useReducedMotionPref();

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle that covers the whole viewport
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uScale = gl.getUniformLocation(program, "uScale");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uBeam = gl.getUniformLocation(program, "uBeam");
    const uTopFade = gl.getUniformLocation(program, "uTopFade");
    const uWin = gl.getUniformLocation(program, "uWin");
    const uRadius = gl.getUniformLocation(program, "uRadius");

    let time = 14; // start mid-flow so the first frame already looks alive
    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const measure = () => {
      const box = canvas.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      if (!box.width || !box.height) return;
      // Soft, glowing image: render below device resolution and let CSS scale it up.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      canvas.width = Math.round(box.width * scale);
      canvas.height = Math.round(box.height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const frac = parseFloat(getComputedStyle(stage).getPropertyValue("--beam")) / 100 || 0.62;
      const beamX = s.left - box.left + s.width * frac;
      const floorY = s.top - box.top;
      gl.uniform2f(uRes, box.width, box.height);
      gl.uniform1f(uScale, canvas.width / box.width);
      gl.uniform2f(uBeam, beamX, floorY);
      gl.uniform4f(uWin, s.left - box.left, floorY, s.right - box.left, s.bottom - box.top);
      gl.uniform1f(uRadius, parseFloat(getComputedStyle(stage.firstElementChild?.firstElementChild ?? stage).borderTopLeftRadius) || 28);
      // Small screens: the text spans the full width, so keep the beam below it.
      gl.uniform1f(uTopFade, box.width < 1024 ? floorY - 250 : -1e5);
      draw();
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    ro.observe(stage);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    if (!reduce) {
      let prev = performance.now();
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(now - prev, 100) / 1000;
        prev = now;
        if (!visible || pausedRef.current) return;
        time += dt;
        draw();
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduce, stageRef]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full bg-[#030f09]" />;
}
