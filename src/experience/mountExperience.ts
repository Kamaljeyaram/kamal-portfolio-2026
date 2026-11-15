/**
 * Kamal Jeyaram portfolio experience — adapted from DOMO scroll-story architecture.
 * 3D character: "RobotExpressive" by Tomás Laulhé (Quaternius), CC0 — recolored for brand.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { storyProjects } from '../data/storyProjects'

gsap.registerPlugin(ScrollTrigger)

/** Cursor head-look. Off during Creative Studio and the project cards. */
const HEAD_FOLLOW = true

export type ExperienceHandlers = {
  /** Real asset progress from 0–1 */
  onProgress?: (ratio: number) => void
  onReady?: () => void
  onError?: (message: string) => void
  onProjectOpen?: (index: number) => void
  /** Open the scroll story on the project cards instead of the intro. */
  initialSection?: 'builds'
}

export type ExperienceController = {
  dispose: () => void
  /** Stop the story scroll while the projects overlay is open. */
  pauseScroll: () => void
  /** Skip the WebGL frame once the overlay fully covers the story. */
  setCovered: (covered: boolean) => void
  /** Resume the story after the overlay has closed. */
  resumeScroll: () => void
  /** Allow scrolling once the percentage loader has finished. */
  unlockScroll: () => void
}

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T | null
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const wrapPi = (a: number) => {
  const t = (a + Math.PI) % (Math.PI * 2)
  return (t < 0 ? t + Math.PI * 2 : t) - Math.PI
}
const CALM_HEAD_CLIPS = new Set(['Idle', 'Wave', 'Yes', 'ThumbsUp', 'Jump'])

const BG_FRAG = `
  varying vec2 vUv; uniform float uTime,uWipe,uAurora,uSkyEnd,uStudio; uniform vec2 uRes;
  float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=.5; } return v; }
  vec3 sky(vec2 uv, vec3 top, vec3 mid, vec3 bot, vec3 cloud, vec3 shade){
    vec3 c = mix(bot, mid, smoothstep(0.,.55,uv.y)); c = mix(c, top, smoothstep(.5,1.,uv.y));
    vec2 p = vec2(uv.x*uRes.x/uRes.y, uv.y)*vec2(2.2,3.4) + vec2(uTime*.012, 0.);
    float cl = fbm(p + fbm(p*1.7)*.6);
    float m = smoothstep(.45,.78,cl) * smoothstep(.15,.55,uv.y);
    c = mix(c, shade, m*.55); c = mix(c, cloud, smoothstep(.55,.85,cl)*smoothstep(.2,.6,uv.y)*.85);
    return c;
  }
  vec3 aurora(vec2 uv){
    // deep navy #040612 → #14204F + green/teal lights + faint warm orange horizon
    vec3 c = mix(vec3(0.0156,0.0235,0.0706), vec3(0.0784,0.1255,0.3098), uv.y);
    float warm = 0.55 * (1.0 - smoothstep(0.0, 0.45, uv.y));
    c += vec3(90./255., 30./255., 8./255.) * warm;
    float t = uTime*.05;
    for(int k=0;k<3;k++){
      float fk=float(k);
      float a = fbm(vec2(uv.x*1.6 + t + fk*3.1, t*.6 + fk));
      float center = .66 + fk*.07 + (a-.5)*.35;
      float band = exp(-pow((uv.y-center)*(5.+fk*2.),2.));
      float streak = .75 + .25*sin(uv.x*55. + a*20. + fk*2.);
      float rays = fbm(vec2(uv.x*10. + fk, uv.y*1.5 - t*2.));
      c += mix(vec3(.08,.95,.55), vec3(.15,.55,.75), fk*.4) * band * streak * smoothstep(.25,.75,rays) * (.95 - fk*.25);
    }
    return c;
  }
  void main(){
    vec2 uv = vUv;
    // Intro day sky: #3366DB / #CCE0F7 / #FADBC2, clouds #FFFCF7 / shade #99B5DE
    vec3 c = sky(uv,
      vec3(0.200,0.400,0.859),
      vec3(0.800,0.878,0.969),
      vec3(0.980,0.859,0.761),
      vec3(1.000,0.988,0.969),
      vec3(0.600,0.710,0.871));
    float q = uv.x*.75 + uv.y*.55;
    float edge = 1.32 - uWipe*1.45;
    float d = q - edge;
    // Paper peel to cream #F6F1E9; curl #A89E91 → #F7F2EB
    vec3 paper = vec3(0.965,0.945,0.914);
    if(d > 0.){
      float curl = smoothstep(0., .09, d);
      vec3 roll = mix(vec3(0.659,0.620,0.569), vec3(0.969,0.949,0.922), pow(sin(clamp(d/.09,0.,1.)*1.57),.6));
      c = mix(roll, paper, curl);
    } else {
      c *= 1. - .22*exp(d*28.)*step(.001,uWipe);
    }
    // Studio focus: fade whole field to ink #14110F
    c = mix(c, vec3(0.078,0.067,0.059), uStudio);
    c = mix(c, aurora(uv), uAurora);
    // Sunrise end: top #545C9E, mid #FA9E73, bottom #FFD6A8
    vec3 s2 = sky(uv+vec2(.15,0.),
      vec3(0.329,0.361,0.620),
      vec3(0.980,0.620,0.451),
      vec3(1.000,0.839,0.659),
      vec3(1.000,0.940,0.880),
      vec3(0.780,0.560,0.480));
    c = mix(c, s2, uSkyEnd);
    gl_FragColor = vec4(c,1.);
  }`

export function mountExperience(handlers: ExperienceHandlers = {}): ExperienceController {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bgCanvas = $('#bg') as HTMLCanvasElement | null
  const glCanvas = $('#gl') as HTMLCanvasElement | null
  if (!bgCanvas || !glCanvas) {
    handlers.onError?.('Missing canvases')
    return {
      dispose: () => undefined,
      pauseScroll: () => undefined,
      setCovered: () => undefined,
      resumeScroll: () => undefined,
      unlockScroll: () => undefined,
    }
  }

  const tickClock = () => {
    const el = $('#clock')
    if (el) {
      el.textContent = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }
  tickClock()
  const clockInterval = window.setInterval(tickClock, 10000)

  const bgR = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: false })
  bgR.setPixelRatio(Math.min(devicePixelRatio, 1))
  const bgScene = new THREE.Scene()
  const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const bgU = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uWipe: { value: 0 },
    uAurora: { value: 0 },
    uSkyEnd: { value: 0 },
    uStudio: { value: 0 },
  }
  bgScene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: bgU,
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
        fragmentShader: BG_FRAG,
      }),
    ),
  )

  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0x8a7f9a, 1.55))
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(4, 8, 6)
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0xcfe0ff, 1.1)
  rim.position.set(-6, 3, -4)
  scene.add(rim)
  const accent = new THREE.PointLight(0xff5b1f, 10, 12, 2)
  accent.position.set(1.4, 2.2, 2.0)
  scene.add(accent)

  const hash3 = (x: number, y: number, z: number, k: number) => {
    const v =
      Math.sin(
        Math.round(x * 1e3) * 12.9898 +
          Math.round(y * 1e3) * 78.233 +
          Math.round(z * 1e3) * 37.719 +
          k * 4.1,
      ) * 43758.5453
    return v - Math.floor(v) - 0.5
  }
  const jitter = (geo: THREE.BufferGeometry, amt: number) => {
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      p.setXYZ(i, x + hash3(x, y, z, 1) * amt, y + hash3(x, y, z, 2) * amt, z + hash3(x, y, z, 3) * amt)
    }
    geo.computeVertexNormals()
    return geo
  }
  const std = (color: number, o: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o })

  function makeIsland(r: number, clear = 0) {
    const g = new THREE.Group()
    const top = new THREE.Mesh(
      jitter(new THREE.CylinderGeometry(r, r * 0.93, 0.35, 40, 2), 0.12),
      std(0x467a29, { flatShading: true }),
    )
    top.position.y = -0.175
    g.add(top)
    const under = new THREE.Mesh(
      jitter(new THREE.ConeGeometry(r * 0.93, r * 1.15, 22, 4), 0.28),
      std(0x5a3a26, { flatShading: true }),
    )
    under.rotation.x = Math.PI
    under.position.y = -0.35 - r * 0.575
    g.add(under)
    const blade = new THREE.ConeGeometry(0.04, 0.22, 4)
    blade.translate(0, 0.11, 0)
    const grass = new THREE.InstancedMesh(blade, std(0xffffff, { flatShading: true }), 900)
    const m = new THREE.Matrix4()
    const col = new THREE.Color()
    const pal = [0x4f8a2e, 0x3b6e22, 0x6fa53d, 0x2f5a1b]
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * Math.PI * 2
      const rr = clear + Math.sqrt(Math.random()) * (r * 0.97 - clear)
      m.compose(
        new THREE.Vector3(Math.cos(a) * rr, 0, Math.sin(a) * rr),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6),
        ),
        new THREE.Vector3(1, 0.4 + Math.random() * 0.8, 1),
      )
      grass.setMatrixAt(i, m)
      grass.setColorAt(i, col.set(pal[i % 4]))
    }
    g.add(grass)
    for (let i = 0; i < 6; i++) {
      const rock = new THREE.Mesh(
        jitter(new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.18, 0), 0.05),
        std(0x9a9590, { flatShading: true }),
      )
      const a = Math.random() * Math.PI * 2
      rock.position.set(Math.cos(a) * r * 0.86, 0.02, Math.sin(a) * r * 0.8)
      g.add(rock)
    }
    return g
  }

  function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    draw(c.getContext('2d')!, w, h)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }

  const island1 = makeIsland(2.6, 1.6)
  scene.add(island1)
  const desk = new THREE.Group()
  desk.position.set(0.95, 0, 0)
  island1.add(desk)
  const wood = std(0xdcc39a, { roughness: 0.6 })
  const black = std(0x1a1a1a, { roughness: 0.5 })
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 1.9), wood)
  deskTop.position.y = 1.02
  desk.add(deskTop)
  ;[
    [-0.48, -0.88],
    [0.48, -0.88],
    [-0.48, 0.88],
    [0.48, 0.88],
  ].forEach(([x, z]) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1, 0.06), black)
    l.position.set(x, 0.5, z)
    desk.add(l)
  })
  const codeTex = canvasTex(512, 300, (g, w, h) => {
    g.fillStyle = '#14110F'
    g.fillRect(0, 0, w, h)
    const cols = ['#FF5B1F', '#F6F1E9', '#5A524B', '#FF8A5C', '#A89E91', '#3A1A0C']
    for (let i = 0; i < 16; i++) {
      let x = 24 + (i % 4) * 18
      const y = 22 + i * 17
      for (let k = 0; k < 3 + Math.random() * 4; k++) {
        const len = 20 + Math.random() * 80
        g.fillStyle = cols[(i + k) % 6]
        g.fillRect(x, y, len, 8)
        x += len + 10
      }
    }
  })
  const mon = new THREE.Group()
  mon.position.set(0.15, 1.06, 0)
  mon.rotation.y = -Math.PI / 2
  desk.add(mon)
  const monBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.75, 0.05), black)
  monBody.position.y = 0.62
  mon.add(monBody)
  const monScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.18, 0.68),
    new THREE.MeshBasicMaterial({ map: codeTex, toneMapped: false }),
  )
  monScreen.position.set(0, 0.62, 0.027)
  mon.add(monScreen)
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), black)
  stand.position.y = 0.15
  mon.add(stand)
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.55, 0.5), black)
  tower.position.set(0.2, 1.33, -0.7)
  desk.add(tower)
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.45),
    new THREE.MeshBasicMaterial({ color: 0xff5b1f, toneMapped: false }),
  )
  glow.position.set(-0.176, 1.33, -0.7)
  glow.rotation.y = -Math.PI / 2
  desk.add(glow)
  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.7), std(0x2a2a2a))
  kb.position.set(-0.25, 1.07, 0)
  desk.add(kb)
  const stool = new THREE.Group()
  stool.position.set(-0.55, 0, 0)
  island1.add(stool)
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 24), std(0x222222))
  seat.position.y = 0.62
  stool.add(seat)
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10),
    std(0x888888, { metalness: 0.6, roughness: 0.3 }),
  )
  post.position.y = 0.3
  stool.add(post)

  const island2 = makeIsland(2.3, 1.35)
  scene.add(island2)
  const laptop = new THREE.Group()
  laptop.scale.setScalar(1.25)
  island2.add(laptop)
  const alu = std(0xd3d6db, { metalness: 0.55, roughness: 0.35 })
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.1), alu)
  base.position.y = 0.03
  laptop.add(base)
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.5), std(0x1b1b1d))
  keys.rotation.x = -Math.PI / 2
  keys.position.set(0, 0.061, -0.12)
  laptop.add(keys)
  const pad = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.3),
    std(0xc4c7cc, { metalness: 0.4, roughness: 0.3 }),
  )
  pad.rotation.x = -Math.PI / 2
  pad.position.set(0, 0.061, 0.33)
  laptop.add(pad)
  const lid = new THREE.Group()
  lid.position.set(0, 0.06, -0.55)
  laptop.add(lid)
  const lidBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.04), alu)
  lidBody.position.set(0, 0.525, -0.02)
  lid.add(lidBody)
  const screenTex = canvasTex(1024, 660, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#14110F')
    gr.addColorStop(0.5, '#3A1A0C')
    gr.addColorStop(1, '#FF5B1F')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(255,91,31,.28)'
    for (let i = 0; i < 40; i++) {
      g.fillRect(i * 26 + Math.random() * 10, 0, 3, h * 0.55 * Math.random())
    }
    g.globalAlpha = 1
    g.fillStyle = '#FFFFFF'
    g.font = '700 120px Instrument Sans, sans-serif'
    g.textAlign = 'center'
    g.fillText('KAMAL', w / 2, h / 2 + 10)
    g.font = '500 28px JetBrains Mono, monospace'
    g.globalAlpha = 0.75
    g.fillText('AI  ·  BACKEND', w / 2, h / 2 + 70)
    g.globalAlpha = 1
  })
  const lidScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.94),
    new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }),
  )
  lidScreen.position.set(0, 0.53, 0.001)
  lid.add(lidScreen)

  const cardsGroup = new THREE.Group()
  scene.add(cardsGroup)
  const projectList = storyProjects
  const cards = projectList.map((project, i) => {
    const { card: name, color } = project
    const tex = canvasTex(640, 420, (g, w, h) => {
      g.fillStyle = '#F6F1E9'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#E8E0D4'
      g.fillRect(0, 0, w, 34)
      ;['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, k) => {
        g.fillStyle = c
        g.beginPath()
        g.arc(20 + k * 18, 17, 6, 0, 7)
        g.fill()
      })
      const gr = g.createLinearGradient(0, 60, w, h)
      gr.addColorStop(0, color)
      gr.addColorStop(1, '#14110F')
      g.fillStyle = gr
      g.fillRect(24, 60, w - 48, h * 0.55)
      g.fillStyle = '#F6F1E9'
      g.font = '700 42px Instrument Sans, sans-serif'
      g.fillText(name, 48, 60 + h * 0.55 - 30)
      g.fillStyle = '#14110F'
      g.fillRect(24, h - 80, 220, 10)
      g.fillStyle = '#5A524B'
      g.fillRect(24, h - 54, 340, 8)
      g.fillRect(24, h - 36, 280, 8)
    })
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.35, 0.89),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false, transparent: true }),
    )
    const a = (i / projectList.length) * Math.PI * 2
    const r = 2.7
    const y = 0.35 + (i % 3) * 0.85
    mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
    mesh.lookAt(Math.cos(a) * r * 2, y, Math.sin(a) * r * 2)
    mesh.userData = { name, index: i, baseScale: 1 }
    cardsGroup.add(mesh)
    return mesh
  })

  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      map: canvasTex(128, 128, (g) => {
        const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
        r.addColorStop(0, 'rgba(0,0,0,.45)')
        r.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = r
        g.fillRect(0, 0, 128, 128)
      }),
    }),
  )
  blob.rotation.x = -Math.PI / 2
  scene.add(blob)

  const S = {
    camX: 0,
    camY: 1.1,
    camZ: 12,
    lookX: 0,
    lookY: 1,
    lookZ: 0,
    rxN: -1.25,
    rx: 0,
    ry: 0,
    rz: 0,
    rRot: Math.PI / 2,
    rS: 1,
    ground: 0,
    shadow: 1,
    i1Y: -12,
    i2Y: -12,
    lid: Math.PI / 2,
    cards: 0,
    spin: 0,
    wipe: 0,
    aurora: 0,
    skyEnd: 0,
    studio: 0,
    surprise: 0,
  }

  const robot = new THREE.Group()
  scene.add(robot)
  let mixer: THREE.AnimationMixer | null = null
  const actions: Record<string, THREE.AnimationAction> = {}
  let headBone: THREE.Bone | null = null
  let faceMesh: THREE.Mesh | null = null
  let headYaw = 0
  let headPitch = 0
  let headWeight = 0
  let poseYaw = 0
  let poseRoll = 0
  let poseBob = 0
  const headParentQuat = new THREE.Quaternion()
  const headTurn = new THREE.Quaternion()
  const headYawQuat = new THREE.Quaternion()
  const headPitchQuat = new THREE.Quaternion()
  const headDelta = new THREE.Quaternion()
  const worldUp = new THREE.Vector3(0, 1, 0)
  const worldRight = new THREE.Vector3(1, 0, 0)

  const clips: Array<[number, number, string, string?, number?]> = [
    [0, 1.8, 'Walking', 'scrub', 3.2],
    [1.8, 2.6, 'Wave'],
    [2.6, 3.4, 'Jump'],
    [3.4, 4.1, 'Jump'],
    [4.1, 4.9, 'Sitting'],
    [4.9, 5.5, 'Jump'],
    [5.5, 6.1, 'Jump'],
    [6.1, 6.6, 'Yes'],
    [6.6, 7.6, 'Idle'],
    [7.6, 8.4, 'ThumbsUp'],
    [8.4, 9.0, 'Idle'],
    [9.0, 9.6, 'Wave'],
    [9.6, 10.1, 'Dance'],
    [10.1, 10.6, 'Jump'],
    [10.6, 14.3, 'Idle'],
    [14.3, 15.2, 'Running', 'scrub', 4],
    [15.2, 15.85, 'Death'],
    [15.85, 99, 'Jump'],
  ]
  let curClip: THREE.AnimationAction | null = null
  let curEntry: (typeof clips)[number] | null = null

  function updateClip(t: number) {
    const e = clips.find((c) => t >= c[0] && t < c[1]) || clips[clips.length - 1]
    if (e !== curEntry) {
      const next = actions[e[2]]
      const prev = curEntry && actions[curEntry[2]]
      if (!next) {
        curEntry = e
        return
      }
      if (prev && prev !== next) prev.fadeOut(0.25)
      next.reset()
      next.timeScale = e[3] === 'scrub' ? 0 : 1
      next.setEffectiveWeight(1).fadeIn(0.25).play()
      curEntry = e
      curClip = next
    }
    if (e[3] === 'scrub' && curClip && e[4] != null) {
      const d = curClip.getClip().duration
      curClip.time = ((((t - e[0]) * e[4]) % 1) + 1) % 1 * d
    }
  }

  let tl: gsap.core.Timeline | null = null
  let lenis: Lenis | null = null
  let scrollTrigger: ScrollTrigger | null = null
  let projOpen = false
  let projCovered = false
  let scrollUnlocked = false
  const sections: [number, string][] = [
    [0, 'Intro'],
    [3, 'Experience'],
    [5.5, 'Skills'],
    [7.5, 'Projects'],
    [10.5, 'Wins'],
    [13, 'Wins'],
    [16, 'Contact'],
  ]

  function stylizeRobot(root: THREE.Object3D) {
    // RobotExpressive materials: Main / Grey / Black
    const byName: Record<string, string> = {
      Main: '#FF5B1F',
      Grey: '#2E2824',
      Black: '#14110F',
    }
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial
        if (!m?.color) return
        const key = m.name in byName ? m.name : Object.keys(byName).find((k) => m.name.includes(k))
        if (key) m.color.set(byName[key])
        m.roughness = 0.45
        m.metalness = 0.08
        if (m.emissive) m.emissive.set(0x000000)
        m.emissiveIntensity = 0
        m.needsUpdate = true
      })
    })
  }

  const pointer = new THREE.Vector2()
  const ndc = new THREE.Vector2(-9, -9)
  const ray = new THREE.Raycaster()
  const seeProj = $('#seeProj')
  let hovered: THREE.Object3D | null = null

  const onPointerMove = (e: PointerEvent) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    ndc.copy(pointer)
    if (seeProj) gsap.set(seeProj, { x: e.clientX, y: e.clientY })
  }

  const onPointerClick = (e: MouseEvent) => {
    if (projOpen || S.cards < 0.5) return
    const t = e.target as HTMLElement | null
    if (t?.closest?.('a,button,#contact,.btn,#projects,#case')) return
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(cards)[0]
    const index = hit?.object.userData?.index as number | undefined
    if (index != null) handlers.onProjectOpen?.(index)
  }

  addEventListener('pointermove', onPointerMove)
  addEventListener('click', onPointerClick)

  let halfW = 6
  let camK = 1
  function resize() {
    const w = innerWidth
    const h = innerHeight
    renderer.setSize(w, h, false)
    bgR.setSize(w, h, false)
    bgU.uRes.value.set(w, h)
    camera.aspect = w / h
    camK = camera.aspect < 1 ? 1.75 : camera.aspect < 1.3 ? 1.3 : 1
    camera.updateProjectionMatrix()
    halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 12 * camK * camera.aspect
  }
  addEventListener('resize', resize)
  resize()

  const clock = new THREE.Clock()
  const v3 = new THREE.Vector3()
  const look = new THREE.Vector3()

  function applyHeadFollow() {
    if (!HEAD_FOLLOW || !headBone?.parent) return
    const facing = Math.abs(wrapPi(robot.rotation.y)) <= 0.35
    const calm = CALM_HEAD_CLIPS.has(curEntry?.[2] ?? '')
    const presenting = S.studio > 0.2 || S.cards > 0.2
    const active = facing && calm && !presenting
    headWeight = THREE.MathUtils.lerp(headWeight, active ? 1 : 0, 0.08)
    const aimYaw = active ? clamp(pointer.x * 0.45, -0.45, 0.45) : 0
    const aimPitch = active ? clamp(-pointer.y * 0.18, -0.18, 0.18) : 0
    headYaw = THREE.MathUtils.lerp(headYaw, aimYaw, 0.08)
    headPitch = THREE.MathUtils.lerp(headPitch, aimPitch, 0.08)
    const yaw = headYaw * headWeight
    const pitch = headPitch * headWeight
    if (Math.abs(yaw) < 1e-4 && Math.abs(pitch) < 1e-4) return
    headBone.parent.getWorldQuaternion(headParentQuat)
    headYawQuat.setFromAxisAngle(worldUp, yaw)
    headPitchQuat.setFromAxisAngle(worldRight, pitch)
    headTurn.copy(headPitchQuat).multiply(headYawQuat)
    headDelta.copy(headParentQuat).invert().multiply(headTurn).multiply(headParentQuat)
    headBone.quaternion.premultiply(headDelta)
  }

  function applySectionPose(time: number) {
    const studio = clamp(S.studio, 0, 1)
    const builds = clamp(S.cards, 0, 1)
    let aimYaw = Math.sin(time * 0.55) * 0.22
    if (hovered) {
      cardsGroup.updateMatrixWorld(true)
      hovered.getWorldPosition(v3)
      const dx = v3.x - robot.position.x
      const dz = v3.z - robot.position.z
      aimYaw = clamp(wrapPi(Math.atan2(dx, dz) - S.rRot), -0.5, 0.5)
    }
    if (curEntry?.[2] === 'Dance') aimYaw *= 0.2
    const bobAmp = curEntry?.[2] === 'Jump' ? 0.02 : 0.05
    poseYaw = THREE.MathUtils.lerp(poseYaw, aimYaw * builds, 0.08)
    poseRoll = THREE.MathUtils.lerp(poseRoll, Math.sin(time * 0.85) * 0.06 * studio, 0.08)
    poseBob = THREE.MathUtils.lerp(poseBob, Math.sin(time * 1.35) * bobAmp * studio, 0.08)
    robot.rotation.y = S.rRot + poseYaw
    robot.rotation.z = poseRoll
    robot.position.y = S.ry + poseBob
  }
  const nameEl = $('#tName')
  const romeEl = $('#tRome')

  function revealBy(el: HTMLElement | null, t0: number, t1: number, t: number) {
    if (!el) return
    if (t < t0) {
      el.style.clipPath = 'inset(0 100% 0 0)'
      return
    }
    if (t > t1) {
      el.style.clipPath = 'inset(0 0 0 0)'
      return
    }
    v3.set(robot.position.x - 0.25, robot.position.y + 1, 0).project(camera)
    const x = ((v3.x + 1) / 2) * innerWidth
    const r = el.getBoundingClientRect()
    el.style.clipPath = `inset(-20% ${clamp(r.right - x, 0, r.width)}px -20% 0)`
  }

  function render() {
    if (!tl || !mixer) return
    if (projCovered) {
      clock.getDelta()
      return
    }
    const dt = Math.min(clock.getDelta(), 0.05)
    const time = clock.elapsedTime
    const t = tl.time()
    robot.position.set(S.rx + S.rxN * halfW, S.ry, S.rz)
    robot.rotation.y = S.rRot
    robot.scale.setScalar(S.rS)
    updateClip(t)
    mixer.update(dt)
    applyHeadFollow()
    if (faceMesh?.morphTargetInfluences && faceMesh.morphTargetDictionary) {
      const idx = faceMesh.morphTargetDictionary.Surprised
      if (idx != null) faceMesh.morphTargetInfluences[idx] = S.surprise
    }
    blob.position.set(robot.position.x, S.ground + 0.01, robot.position.z)
    ;(blob.material as THREE.MeshBasicMaterial).opacity =
      S.shadow * clamp(1 - (S.ry - S.ground) / 3, 0, 1) * (robot.position.y > -5 ? 1 : 0)
    island1.position.y = S.i1Y
    island1.visible = S.i1Y > -11.5
    island1.rotation.y = Math.sin(time * 0.3) * 0.05
    island2.position.y = S.i2Y
    island2.visible = S.i2Y > -11.5
    lid.rotation.x = S.lid
    cardsGroup.visible = S.cards > 0.01
    cardsGroup.rotation.y = S.spin + time * 0.05
    cards.forEach((c, i) => {
      c.position.y = 0.35 + (i % 3) * 0.85 + Math.sin(time * 1.2 + i) * 0.08
      const target = (c === hovered ? 1.18 : 1) * S.cards
      c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.15))
    })
    hovered = null
    if (S.cards > 0.5 && !projOpen) {
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObjects(cards)[0]
      if (hit) hovered = hit.object
    }
    if (seeProj) {
      seeProj.style.visibility = hovered ? 'visible' : 'hidden'
      seeProj.style.pointerEvents = hovered ? 'auto' : 'none'
    }
    document.body.style.cursor = S.cards > 0.5 && hovered ? 'pointer' : ''
    applySectionPose(time)
    camera.position.set(
      S.camX + pointer.x * 0.25,
      S.camY + pointer.y * 0.15,
      S.camZ * (S.camZ > 4 ? camK : 1),
    )
    look.set(S.lookX, S.lookY, S.lookZ)
    camera.lookAt(look)
    revealBy(nameEl, 0, 1.8, t)
    revealBy(romeEl, 14.25, 15.2, t)
    if (romeEl) romeEl.style.visibility = t > 14.2 && t < 16 ? 'visible' : 'hidden'
    bgU.uTime.value = time
    bgU.uWipe.value = S.wipe
    bgU.uAurora.value = S.aurora
    bgU.uSkyEnd.value = S.skyEnd
    bgU.uStudio.value = S.studio
    bgR.render(bgScene, bgCam)
    renderer.render(scene, camera)
    const sec = [...sections].reverse().find((s) => t >= s[0])
    const secName = $('#secName')
    if (secName) secName.textContent = sec ? sec[1] : ''
    // Cream pages → dark header; intro / studio / aurora stay cream text
    const creamPage =
      (S.wipe > 0.85 && S.studio < 0.35 && S.aurora < 0.25) || S.skyEnd > 0.55
    document.querySelector('header')?.classList.toggle('dark', creamPage)
  }

  const onToTop = () => lenis?.scrollTo(0, { duration: 3 })
  const lenisRaf = (time: number) => {
    lenis?.raf(time * 1000)
  }

  function start() {
    island2.position.y = -1.0
    lid.rotation.x = -0.28
    scene.updateMatrixWorld(true)
    const sc = lidScreen.getWorldPosition(new THREE.Vector3())
    const sn = new THREE.Vector3(0, 0, 1).applyQuaternion(
      lidScreen.getWorldQuaternion(new THREE.Quaternion()),
    )
    const into = sc.clone().addScaledVector(sn, 0.55)
    island2.position.y = -12
    lid.rotation.x = Math.PI / 2

    tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, paused: true })
    const T = (vars: gsap.TweenVars, at: number, dur: number) => tl!.to(S, { ...vars, duration: dur }, at)
    const show = (sel: string, at: number, dur = 0.3, from: gsap.TweenVars = { y: 40 }) =>
      tl!.fromTo(sel, { autoAlpha: 0, ...from }, { autoAlpha: 1, y: 0, x: 0, duration: dur, ease: 'power3.out' }, at)
    const hide = (sel: string, at: number, dur = 0.3) =>
      tl!.to(sel, { autoAlpha: 0, y: -40, duration: dur, ease: 'power2.in' }, at)

    T({ rxN: 0.8, ease: 'none' }, 0, 1.8)
    T({ rRot: 0 }, 1.75, 0.3)
    hide('#hint', 0, 0.15)
    tl.to('#tRole', { autoAlpha: 0, y: 20, duration: 0.2 }, 0.25)
    // Headline out earlier; tagline in later — no overlap
    tl.to('#tName', { autoAlpha: 0, y: -60, scale: 0.9, duration: 0.35, ease: 'power2.in' }, 2.0)
    show('#tSimple', 2.5, 0.3)
    hide('#tSimple', 2.95, 0.2)
    T({ ry: 7, ease: 'power2.in' }, 2.65, 0.45)
    T({ camY: 2.2, lookY: 1.6 }, 2.4, 0.7)

    T({ wipe: 1, ease: 'power1.inOut' }, 2.9, 0.9)
    tl.set(S, { rxN: 0, rx: -0.55, rz: 0, ry: 7, rRot: Math.PI / 2, ground: 0 }, 3.3)
    T({ i1Y: -1.1, ease: 'power3.out' }, 3.3, 0.8)
    T({ camX: -1.6, camY: 3.0, camZ: 10, lookX: 0.2, lookY: 0.2, ease: 'power3.out' }, 3.3, 0.9)
    T({ ry: -1.1 + 0.62, ease: 'power2.in' }, 3.55, 0.5)
    tl.set(S, { ground: -1.1 }, 3.4)
    show('#tShift', 3.85, 0.35)
    hide('#tShift', 4.95, 0.3)
    T({ ry: 3.5, ease: 'power2.out' }, 5.0, 0.45)
    T({ i1Y: -12, ease: 'power3.in' }, 5.0, 0.55)

    tl.set(S, { rx: 0, rz: 0, rRot: 0, ry: 6, ground: 0 }, 5.5)
    T({ camX: 0, camY: 1.1, camZ: 11, lookX: 0, lookY: 1.05 }, 5.4, 0.5)
    T({ ry: 0, ease: 'bounce.out' }, 5.5, 0.55)
    // Studio focus: fade background to ink, then back to cream
    T({ studio: 1, ease: 'power2.inOut' }, 5.35, 0.35)
    show('#tCreative', 5.65, 0.35)
    hide('#tCreative', 7.05, 0.3)
    T({ studio: 0, ease: 'power2.inOut' }, 7.2, 0.35)

    T({ camZ: 7.4, camY: 1.55, lookY: 1.25 }, 7.3, 0.7)
    T({ cards: 1, ease: 'back.out(1.4)' }, 7.6, 0.5)
    T({ spin: Math.PI * 2.4, ease: 'none' }, 7.6, 2.8)
    show('#tWork', 7.65, 0.35)
    hide('#tWork', 10.0, 0.3)
    show('#tWorkSide', 7.8, 0.35)
    hide('#tWorkSide', 9.95, 0.3)
    T({ cards: 0, ease: 'power2.in' }, 10.0, 0.4)
    T({ ry: -9, ease: 'power2.in' }, 10.15, 0.4)

    tl.set(S, { shadow: 0 }, 10.5)
    T({ camX: 0, camY: 2.6, camZ: 8.5, lookX: 0, lookY: 0.2, ease: 'power3.out' }, 10.4, 0.6)
    T({ i2Y: -1.0, ease: 'power3.out' }, 10.5, 0.7)
    T({ lid: -0.28, ease: 'power2.inOut' }, 11.0, 0.8)
    show('#tLaptop', 10.65, 0.35)
    hide('#tLaptop', 11.85, 0.25)
    T(
      {
        camX: into.x,
        camY: into.y,
        camZ: into.z,
        lookX: sc.x,
        lookY: sc.y,
        lookZ: sc.z,
        ease: 'power3.in',
      },
      12.0,
      0.85,
    )
    T({ aurora: 1, ease: 'none' }, 12.62, 0.3)
    T({ i2Y: -12, ease: 'none' }, 12.93, 0.02)
    tl.set(S, { camX: 0, camY: 1.1, camZ: 12, lookX: 0, lookY: 1, lookZ: 0 }, 12.96)

    show('#tLogos', 13.0, 0.4)
    hide('#tLogos', 14.0, 0.3)
    tl.set(S, { rx: 0, rxN: -1.3, ry: 0, rRot: Math.PI / 2, shadow: 1, ground: 0 }, 14.25)
    T({ rxN: 0.42, ease: 'none' }, 14.3, 0.9)
    T({ rxN: 0.62, rRot: Math.PI / 2 + 0.4, ease: 'power2.out' }, 15.2, 0.45)
    T({ surprise: 1 }, 15.25, 0.15)
    show('#tOops', 15.35, 0.25, { y: 30, x: -20 })
    hide('#tOops', 15.8, 0.2)
    tl.to('#tRome', { autoAlpha: 0, duration: 0.25 }, 15.8)
    T({ skyEnd: 1, ease: 'power1.inOut' }, 15.7, 0.5)
    T({ surprise: 0, ry: -8, ease: 'power2.in' }, 15.9, 0.35)

    tl.fromTo(
      '#contact',
      { autoAlpha: 0, yPercent: 40 },
      { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: 'power3.out' },
      16.1,
    )
    tl.set({}, {}, 16.5)

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085 })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(lenisRaf)
      gsap.ticker.lagSmoothing(0)
      lenis.stop()
    }

    scrollTrigger = ScrollTrigger.create({
      trigger: '#spacer',
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? false : 0.8,
      animation: tl,
      onUpdate: (self) => {
        const bar = $('#barFill')
        if (bar) bar.style.transform = `scaleX(${self.progress})`
      },
    })

    if (handlers.initialSection === 'builds') {
      const openBuilds = () => {
        if (!scrollTrigger || !tl) return
        ScrollTrigger.refresh()
        const span = scrollTrigger.end - scrollTrigger.start
        const y = scrollTrigger.start + (8.4 / tl.duration()) * span
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
        else window.scrollTo(0, y)
        ScrollTrigger.update()
      }
      openBuilds()
      requestAnimationFrame(openBuilds)
    }

    $('#toTop')?.addEventListener('click', onToTop)
    gsap.ticker.add(render)
    handlers.onReady?.()
  }

  handlers.onProgress?.(0.02)

  const loader = new GLTFLoader()
  loader.load(
    '/models/robot.glb',
    (gltf) => {
      const model = gltf.scene
      model.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const s = 2.1 / size.y
      model.scale.setScalar(s)
      model.position.y = -box.min.y * s
      model.traverse((o) => {
        if ((o as THREE.Bone).isBone && o.name === 'Head') headBone = o as THREE.Bone
        if ((o as THREE.Mesh).morphTargetDictionary) faceMesh = o as THREE.Mesh
      })
      stylizeRobot(model)
      robot.add(model)
      mixer = new THREE.AnimationMixer(model)
      gltf.animations.forEach((c) => {
        actions[c.name] = mixer!.clipAction(c)
      })
      ;['Death', 'Sitting', 'Standing', 'Jump', 'Yes', 'No', 'Wave', 'ThumbsUp', 'Punch', 'WalkJump'].forEach(
        (n) => {
          if (actions[n]) {
            actions[n].setLoop(THREE.LoopOnce, 1)
            actions[n].clampWhenFinished = true
          }
        },
      )
      handlers.onProgress?.(1)
      start()
    },
    (xhr) => {
      if (xhr.lengthComputable && xhr.total > 0) {
        handlers.onProgress?.(Math.min(0.95, xhr.loaded / xhr.total))
      } else if (xhr.loaded > 0) {
        // No Content-Length — ease upward from bytes as a soft signal
        handlers.onProgress?.(Math.min(0.85, 0.15 + xhr.loaded / 900000))
      }
    },
    (err) => {
      console.error(err)
      handlers.onError?.('Could not load 3D model')
    },
  )

  return {
    dispose: () => {
      window.clearInterval(clockInterval)
      removeEventListener('pointermove', onPointerMove)
      removeEventListener('click', onPointerClick)
      removeEventListener('resize', resize)
      $('#toTop')?.removeEventListener('click', onToTop)
      gsap.ticker.remove(render)
      gsap.ticker.remove(lenisRaf)
      scrollTrigger?.kill()
      tl?.kill()
      lenis?.destroy()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      renderer.dispose()
      bgR.dispose()
    },
    pauseScroll: () => {
      projOpen = true
      lenis?.stop()
    },
    setCovered: (covered) => {
      projCovered = covered
    },
    resumeScroll: () => {
      projOpen = false
      projCovered = false
      if (scrollUnlocked) lenis?.start()
    },
    unlockScroll: () => {
      scrollUnlocked = true
      if (!projOpen) lenis?.start()
      if (!tl) return
      if (tl.time() < 0.2) {
        gsap.fromTo('#tRole', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' })
      } else {
        gsap.set('#tRole', { autoAlpha: 0 })
      }
    },
  }
}
