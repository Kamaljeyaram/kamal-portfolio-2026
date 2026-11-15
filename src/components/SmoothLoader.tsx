import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type SmoothLoaderProps = {
  /** Real asset progress 0–1 */
  progress: number
  /** Assets finished loading */
  ready: boolean
  error?: string | null
  onComplete: () => void
}

const STATUS = [
  'Loading 3D model',
  'Waking up the robot',
  'Painting the sky',
  'Planting the islands',
  'Almost there',
]

/**
 * Dark intro loader: a single eased percentage, status line, and the orange curtain.
 * The count never jumps 0→100, and the curtain waits until the assets are ready.
 */
export function SmoothLoader({ progress, ready, error, onComplete }: SmoothLoaderProps) {
  const [display, setDisplay] = useState(0)
  const [status, setStatus] = useState(0)
  const [clock, setClock] = useState('--:--')
  const targetRef = useRef(0)
  const readyRef = useRef(false)
  const finishedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const startRef = useRef(performance.now())
  const lineRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  onCompleteRef.current = onComplete

  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const paint = () => {
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    }
    paint()
    const id = window.setInterval(paint, 10000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    targetRef.current = ready ? 1 : Math.min(0.92, Math.max(targetRef.current, progress))
  }, [progress, ready])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      if (!readyRef.current) {
        const floor = Math.min(0.35, elapsed / 2800)
        targetRef.current = Math.max(targetRef.current, floor)
        if (targetRef.current < 0.88) {
          targetRef.current = Math.min(0.88, targetRef.current + 0.0022)
        }
      } else {
        targetRef.current = 1
      }

      setDisplay((prev) => {
        const goal = targetRef.current * 100
        const ease = readyRef.current ? 0.085 : 0.055
        const next = prev + (goal - prev) * ease
        if (readyRef.current && next >= 99.4) return 100
        return next
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setStatus((n) => (n + 1) % STATUS.length), 700)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const el = statusRef.current?.querySelector('span')
    if (!el) return
    gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' })
  }, [status])

  useEffect(() => {
    if (error || finishedRef.current) return
    if (!(ready && display >= 99.5)) return
    finishedRef.current = true

    const root = rootRef.current
    const line = lineRef.current
    const panels = curtainRef.current ? [...curtainRef.current.children] : []
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const finish = () => onCompleteRef.current()

    if (reduce || !root || !line) {
      window.setTimeout(finish, 280)
      return
    }

    gsap.set(panels, { yPercent: 101, y: 0 })
    const tl = gsap.timeline({ onComplete: finish })
    tl.to({}, { duration: 0.25 })
      .to(['#loadNum', '#loader .lt > span', '#loader .rt > span', '#ldStatus span'], {
        yPercent: 110,
        duration: 0.6,
        ease: 'expo.in',
        stagger: 0.05,
      })
      .to(line, { scaleX: 0, transformOrigin: 'right center', duration: 0.5, ease: 'expo.in' }, '<')
      .to(panels, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', stagger: 0.06 }, '-=0.25')
      .set(root, { autoAlpha: 0 })
      .to(panels, { yPercent: -101, duration: 0.8, ease: 'expo.inOut', stagger: 0.06 })

    return () => {
      tl.kill()
    }
  }, [display, ready, error])

  const pct = Math.min(100, Math.round(display))

  return (
    <>
      <div id="loader" ref={rootRef} aria-live="polite">
        <div className="lt mono">
          <span>KJ© Portfolio</span>
        </div>
        <div className="rt mono">
          <span>
            Chennai — <span>{clock}</span> IST
          </span>
        </div>
        <div className="loadWrap">
          <div id="loadNum">
            <b>{error ? '—' : pct}</b>
            {!error && <span className="pct">%</span>}
          </div>
        </div>
        <div className="status mono" id="ldStatus" ref={statusRef}>
          <span>{error ?? STATUS[status]}</span>
        </div>
        <div className="line" ref={lineRef} style={{ transform: `scaleX(${error ? 0 : pct / 100})` }} />
      </div>
      <div id="curtain" ref={curtainRef} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </>
  )
}
