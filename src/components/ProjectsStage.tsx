import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { GLYPHS, STORY_CATS, storyMesh, storyProjects } from '../data/storyProjects'

export type ProjectsHandle = {
  open: (index?: number | null) => void
  close: () => void
}

type ProjectsStageProps = {
  onPause: () => void
  onCovered: (covered: boolean) => void
  onResume: () => void
}

const pad = (i: number) => String(i + 1).padStart(2, '0')

export const ProjectsStage = forwardRef<ProjectsHandle, ProjectsStageProps>(function ProjectsStage(
  { onPause, onCovered, onResume },
  ref,
) {
  const projRef = useRef<HTMLElement>(null)
  const caseRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)
  const caseShown = useRef(false)
  const pageOverflow = useRef({ html: '', body: '' })
  const actions = useRef({ close: () => {}, closeCase: () => {} })
  const [caseIndex, setCaseIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState<(typeof STORY_CATS)[number]>('All')
  const [visible, setVisible] = useState(false)

  const intro = () => {
    const root = caseRef.current
    if (!root) return
    gsap.fromTo(
      root.querySelectorAll('.cin, .cbar, .chero .eyebrow, .cstack, .cnext'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.1 },
    )
    const hero = root.querySelector('.chero')
    if (hero) {
      gsap.fromTo(hero, { scale: 0.96, borderRadius: 60 }, { scale: 1, borderRadius: 30, duration: 1.1, ease: 'expo.out' })
    }
  }

  useLayoutEffect(() => {
    if (caseIndex == null || !caseRef.current) return
    caseRef.current.scrollTop = 0
    if (!caseShown.current) {
      caseShown.current = true
      gsap.set(caseRef.current, { visibility: 'visible' })
      gsap.fromTo(caseRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.95, ease: 'expo.inOut' })
    }
    intro()
  }, [caseIndex])

  useEffect(() => {
    const root = projRef.current
    const cursor = cursorRef.current
    if (!root || !cursor) return
    const canHover = matchMedia('(hover:hover)').matches
    const curX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
    const curY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
    const onMove = (e: PointerEvent) => {
      curX(e.clientX)
      curY(e.clientY)
    }
    const tiles = [...root.querySelectorAll<HTMLElement>('.tile')]
    const enters: Array<() => void> = []
    const leaves: Array<() => void> = []
    const moves: Array<(e: PointerEvent) => void> = []
    tiles.forEach((tile, i) => {
      const move = (e: PointerEvent) => {
        const r = tile.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        tile.style.setProperty('--mx', `${x * 100}%`)
        tile.style.setProperty('--my', `${y * 100}%`)
        if (canHover) {
          gsap.to(tile, { rotateY: (x - 0.5) * 7, rotateX: (0.5 - y) * 6, transformPerspective: 1000, duration: 0.5, ease: 'power3' })
        }
        void i
      }
      const enter = () => gsap.to(cursor, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
      const leave = () => {
        gsap.to(tile, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' })
        gsap.to(cursor, { scale: 0, duration: 0.25 })
      }
      moves.push(move)
      enters.push(enter)
      leaves.push(leave)
      tile.addEventListener('pointermove', move)
      tile.addEventListener('pointerenter', enter)
      tile.addEventListener('pointerleave', leave)
    })
    root.addEventListener('pointermove', onMove)
    return () => {
      root.removeEventListener('pointermove', onMove)
      tiles.forEach((tile, i) => {
        tile.removeEventListener('pointermove', moves[i])
        tile.removeEventListener('pointerenter', enters[i])
        tile.removeEventListener('pointerleave', leaves[i])
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = pageOverflow.current.html
      document.body.style.overflow = pageOverflow.current.body
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !openRef.current) return
      if (caseShown.current) actions.current.closeCase()
      else actions.current.close()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  function lockPage() {
    pageOverflow.current = {
      html: document.documentElement.style.overflow,
      body: document.body.style.overflow,
    }
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }

  function unlockPage() {
    document.documentElement.style.overflow = pageOverflow.current.html
    document.body.style.overflow = pageOverflow.current.body
  }

  function openCase(index: number) {
    projRef.current?.classList.add('is-case')
    gsap.to(cursorRef.current, { scale: 0, duration: 0.2 })
    setCaseIndex(index)
  }

  function closeCase() {
    const el = caseRef.current
    if (!caseShown.current || !el) return
    caseShown.current = false
    gsap.to(el, {
      yPercent: 100,
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(el, { visibility: 'hidden' })
        projRef.current?.classList.remove('is-case')
        setCaseIndex(null)
      },
    })
  }

  function open(index: number | null = null) {
    if (openRef.current) {
      if (index != null) openCase(index)
      return
    }
    const el = projRef.current
    if (!el) return
    openRef.current = true
    setVisible(true)
    lockPage()
    onPause()
    el.scrollTop = 0
    gsap.set(el, { visibility: 'visible' })
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.95,
        ease: 'expo.inOut',
        onComplete: () => onCovered(true),
      },
    )
    gsap.fromTo('#projects .pin', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.5 })
    gsap.fromTo('#projects .tile', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.6 })
    if (index != null) window.setTimeout(() => openCase(index), 650)
  }

  function close() {
    const el = projRef.current
    if (!openRef.current || !el) return
    onCovered(false)
    closeCase()
    gsap.to(el, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(el, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' })
        openRef.current = false
        setVisible(false)
        unlockPage()
        onResume()
      },
    })
  }

  function goNext(next: number) {
    const el = caseRef.current
    if (!el) return
    gsap.to(el.children, {
      opacity: 0,
      y: -30,
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.in',
      onComplete: () => {
        el.scrollTop = 0
        setCaseIndex(next)
      },
    })
  }

  actions.current = { close, closeCase }
  useImperativeHandle(ref, () => ({ open, close }))

  const current = caseIndex == null ? null : storyProjects[caseIndex]
  const nextIndex = caseIndex == null ? 0 : (caseIndex + 1) % storyProjects.length

  return (
    <>
      <section
        id="projects"
        ref={projRef}
        data-lenis-prevent
        aria-label="Projects"
        aria-hidden={!visible}
      >
        <div className="ph">
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>KJ©</span>
          <span className="mono" style={{ opacity: 0.6 }}>
            Projects · Kamal Jeyaram T
          </span>
          <button className="pill" type="button" onClick={close}>
            Close ✕
          </button>
        </div>
        <div className="pintro">
          <h2 className="pin">
            Selected
            <br />
            <span className="o">projects</span>
            <sup>(06)</sup>
          </h2>
          <div className="pin">
            <p>AI, computer vision and IoT work: an industry internship, SaaS products, hackathon wins and two patent applications.</p>
            <div className="pstats">
              <div>
                <b>06</b>
                <span>Projects</span>
              </div>
              <div>
                <b>02</b>
                <span>Patent applications</span>
              </div>
              <div>
                <b>04</b>
                <span>Awards and finals</span>
              </div>
              <div>
                <b>01</b>
                <span>Industry internship</span>
              </div>
            </div>
          </div>
        </div>
        <div className="filters">
          {STORY_CATS.map((cat) => {
            const count = cat === 'All' ? storyProjects.length : storyProjects.filter((p) => p.cats.includes(cat)).length
            return (
              <button
                key={cat}
                type="button"
                className={`chip${filter === cat ? ' on' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
                <sup>{count}</sup>
              </button>
            )
          })}
        </div>
        <div className="bento">
          {storyProjects.map((project, i) => (
            <article
              key={project.title}
              className={`tile t${i}${i === 0 ? ' lg' : ''}${filter !== 'All' && !project.cats.includes(filter) ? ' dim' : ''}`}
              style={{ ['--mesh' as string]: storyMesh(i) }}
              tabIndex={0}
              role="button"
              aria-label={`Open ${project.title}`}
              onClick={() => openCase(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openCase(i)
              }}
            >
              <svg className="glyph" viewBox="0 0 120 120" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GLYPHS[project.icon] }} />
              <div className="top">
                <span className="l">
                  <span className="mono">{pad(i)}</span>
                  <span className="cat">{project.cats[0]}</span>
                </span>
                <span className="go">↗</span>
              </div>
              <div className="bot">
                <div className="stat">{project.big}</div>
                <h3>{project.title}</h3>
                <div className="tg">{project.tags.slice(0, 3).join(' · ')}</div>
              </div>
            </article>
          ))}
        </div>
        <div className="pfoot">
          <div>
            <span className="mono" style={{ opacity: 0.7 }}>
              Like what you see?
            </span>
            <h3 style={{ marginTop: 10 }}>
              Let&apos;s build
              <br />
              something real.
            </h3>
          </div>
          <div className="pfoot-aside">
            <a href="mailto:kamaljeyaram07@gmail.com">kamaljeyaram07@gmail.com</a>
            <br />
            <span className="mono" style={{ opacity: 0.7, display: 'inline-block', marginTop: 10 }}>
              +91 90259 00546
            </span>
            <br />
            <button className="pill" type="button" style={{ marginTop: 16, background: '#14110F', color: '#F6F1E9' }} onClick={close}>
              Back to the story ↑
            </button>
          </div>
        </div>
      </section>

      <section id="case" ref={caseRef} data-lenis-prevent aria-label="Project case study">
        {current && caseIndex != null && (
          <>
            <div className="cbar">
              <button className="pill ghost" type="button" onClick={closeCase}>
                ← All projects
              </button>
              <span className="mono">
                {pad(caseIndex)} / 06 · {current.title}
              </span>
              <button
                className="pill"
                type="button"
                onClick={() => {
                  closeCase()
                  close()
                }}
              >
                Close ✕
              </button>
            </div>
            <div className="chero" style={{ ['--mesh' as string]: storyMesh(caseIndex) }}>
              <svg className="glyph" viewBox="0 0 120 120" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GLYPHS[current.icon] }} />
              <div className="eyebrow mono">
                <span>{pad(caseIndex)} / 06</span>
                <span>·</span>
                <span>{current.cats.join(' · ')}</span>
              </div>
              <div>
                <h2 className="cin">{current.title}</h2>
                <div className="metas cin">
                  <span>{current.meta}</span>
                  <span>{current.role}</span>
                </div>
              </div>
            </div>
            <div className="cfacts">
              {current.facts.map((fact) => (
                <div key={fact[1]} className="cin">
                  <b>{fact[0]}</b>
                  <span>{fact[1]}</span>
                </div>
              ))}
            </div>
            <div className="cbody">
              <div className="cin">
                <h4>
                  <b>01</b> — The problem
                </h4>
                <p>{current.problem}</p>
              </div>
              <div className="cin">
                <h4>
                  <b>02</b> — What I built
                </h4>
                <ul>
                  {current.pts.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="cin">
                <h4>
                  <b>03</b> — The result
                </h4>
                <p>{current.result}</p>
              </div>
            </div>
            <div className="cstack">
              <span className="mono" style={{ border: 0, paddingLeft: 0 }}>
                Built with
              </span>
              {current.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <button className="cnext" type="button" style={{ ['--mesh' as string]: storyMesh(nextIndex) }} onClick={() => goNext(nextIndex)}>
              <span className="mono">
                Next project · {pad(nextIndex)} / 06
              </span>
              <h3>{storyProjects[nextIndex].title} →</h3>
            </button>
          </>
        )}
      </section>
      <div id="pCursor" ref={cursorRef}>
        View
      </div>
    </>
  )
})
