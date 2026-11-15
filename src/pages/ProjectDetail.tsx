import { useEffect, useLayoutEffect, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getProject, projects, type Project } from '../data/projects'
import { profile } from '../data/profile'

const BARS = [38, 56, 44, 72, 61, 88, 70, 96]

function scrollPageToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = getProject(slug)

  useLayoutEffect(() => {
    scrollPageToTop()
  }, [slug])

  useEffect(() => {
    scrollPageToTop()
    const frame = requestAnimationFrame(scrollPageToTop)
    return () => cancelAnimationFrame(frame)
  }, [slug])

  if (!project) return <Navigate to="/" replace />

  const index = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const tone = { '--tone': project.color } as CSSProperties

  return (
    <div className="case" style={tone}>
      <nav className="case__nav">
        <Link to={{ pathname: '/', hash: '#builds' }} className="case__brand">
          {profile.brand}
        </Link>
        <span className="mono case__count">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <Link to={{ pathname: '/', hash: '#builds' }} className="case__close">
          Close
        </Link>
      </nav>

      <section className="case__hero">
        <div className="case__hero-inner">
          <div className="case__copy">
            <p className="mono case__eyebrow">
              <i style={{ background: project.color }} />
              Case study · {project.year}
            </p>
            <h1>{project.name}</h1>
            <p className="case__lede">{project.blurb}</p>
            <dl className="case__facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.stack.join(' · ')}</dd>
              </div>
            </dl>
            <div className="case__links">
              {project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          <MockStage project={project} />
        </div>
      </section>

      <section className="case__metrics" aria-label="Snapshot">
        {project.metrics.map((m) => (
          <div key={m.label} className="case__metric">
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </div>
        ))}
      </section>

      <section className="case__essay">
        <p className="case__summary">{project.summary}</p>
        <div className="case__story">
          <article>
            <span className="mono">01 — Challenge</span>
            <p>{project.challenge}</p>
          </article>
          <article>
            <span className="mono">02 — Approach</span>
            <p>{project.approach}</p>
          </article>
          <article>
            <span className="mono">03 — Outcome</span>
            <p>{project.outcome}</p>
          </article>
        </div>
      </section>

      <section className="case__screens">
        <div className="case__screens-head">
          <h2>Product mock</h2>
          <p>A stand-in for the working surface — density, status, and the signals this build actually surfaces.</p>
        </div>
        <div className="case__screen-grid">
          <MockQueue project={project} />
          <MockSpec project={project} />
        </div>
      </section>

      <section className="case__shipped">
        <h2 className="mono case__label">What shipped</h2>
        <ul className="case__bento">
          {project.highlights.map((h, i) => (
            <li key={h} className={`case__tile case__tile--${i + 1}`}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <p>{h}</p>
            </li>
          ))}
        </ul>
      </section>

      <nav className="case__pager" aria-label="More projects">
        <Link to={`/project/${prev.slug}`} className="case__prev">
          <span className="mono">Previous</span>
          <strong>{prev.name}</strong>
        </Link>
        <Link to={`/project/${next.slug}`} className="case__next" style={{ '--tone': next.color } as CSSProperties}>
          <span className="mono">Next project</span>
          <strong>{next.name}</strong>
          <em>{next.blurb}</em>
        </Link>
      </nav>
    </div>
  )
}

function MockStage({ project }: { project: Project }) {
  const lead = project.metrics[0]
  return (
    <div className="mock" aria-hidden>
      <div className="mock__glow" />
      <div className="mock__window">
        <div className="mock__chrome">
          <span />
          <span />
          <span />
          <em>{project.slug}.app</em>
        </div>
        <div className="mock__body">
          <div className="mock__rail">
            <b />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="mock__canvas">
            <div className="mock__head">
              <div>
                <small className="mono">Workspace</small>
                <strong>{project.name}</strong>
              </div>
              <span className="mock__live">Live</span>
            </div>
            <div className="mock__pills">
              {project.metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
            <div className="mock__chart">
              {BARS.map((h, i) => (
                <span key={h + i} style={{ height: `${h}%` }} data-hot={i === BARS.length - 1 || undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {lead && (
        <aside className="mock__float">
          <span className="mono">Now</span>
          <strong>{lead.value}</strong>
          <p>{lead.label}</p>
        </aside>
      )}
    </div>
  )
}

function MockQueue({ project }: { project: Project }) {
  return (
    <article className="shot shot--wide">
      <header className="shot__bar">
        <span className="mono">Queue</span>
        <span>{project.name}</span>
      </header>
      <ul>
        {project.highlights.map((h, i) => (
          <li key={h}>
            <em>{String(i + 1).padStart(2, '0')}</em>
            <span>{h}</span>
            <b data-on={i === 0 || undefined}>{i === 0 ? 'Active' : 'Ready'}</b>
          </li>
        ))}
      </ul>
    </article>
  )
}

function MockSpec({ project }: { project: Project }) {
  return (
    <article className="shot">
      <header className="shot__bar">
        <span className="mono">Spec</span>
        <span>{project.year}</span>
      </header>
      <ul className="shot__stack">
        {project.stack.map((s) => (
          <li key={s}>
            <i />
            {s}
          </li>
        ))}
      </ul>
      <p className="shot__role">{project.role}</p>
    </article>
  )
}
