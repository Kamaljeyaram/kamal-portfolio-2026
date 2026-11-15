import { profile } from '../data/profile'

type DomoOverlaysProps = {
  /** When true, loader is rendered by SmoothLoader instead */
  hideLoader?: boolean
  onOpenProjects?: () => void
}

export function DomoOverlays({ hideLoader, onOpenProjects }: DomoOverlaysProps) {
  return (
    <>
      {!hideLoader && (
        <div id="loader">
          <b id="loadPct">0%</b>
        </div>
      )}

      <header>
        <span className="logo">{profile.brand}</span>
        <span className="mono">Kamal Jeyaram T</span>
        <span className="prog mono">
          <button className="navbtn mono" type="button" onClick={onOpenProjects}>
            Projects ↗
          </button>
          <span id="secName">Intro</span>
          <span className="bar">
            <i id="barFill" />
          </span>
        </span>
      </header>

      <canvas id="bg" />

      <div className="layer" id="texts">
        <div id="tName" className="huge">
          <span>{profile.displayName}</span>
        </div>
        <div id="tSimple">I build AI that works.</div>
        <div id="tRole" className="mono">
          AI &amp; Backend Developer · Chennai, India
        </div>

        <div id="tShift">
          <h2>
            Python.
            <br />
            APIs.
            <br />
            AI that ships.
          </h2>
          <div className="quote">
            <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Experience</span>
              <span>May – Jul 2025</span>
            </div>
            <p>
              Computer Vision Engineer Intern at Aioty Labs, for client Royal Enfield. Built a workplace
              monitoring system across 5+ assembly stations, tested live with 10 employees.
            </p>
            <b>95%+</b>{' '}
            <span className="mono" style={{ opacity: 0.6 }}>
              Face-recognition accuracy · InsightFace + YOLOv8
            </span>
          </div>
          <p className="small">
            Computer Science (IoT) graduate building backend services, REST APIs and AI-powered
            applications with Python, Flask, MySQL and modern AI.
          </p>
        </div>

        <div id="tCreative">
          <p className="about">
            I care about one thing: software that solves a real problem. From computer vision on a
            factory floor to RAG chatbots and multi-tenant SaaS, I build it end to end.
          </p>
          <h2 className="huge">
            AI <em>Developer.</em>
          </h2>
          <ul>
            <li>
              <b>Languages</b>Python · Java · SQL
            </li>
            <li>
              <b>Backend</b>Flask · REST APIs · MySQL
            </li>
            <li>
              <b>AI / ML</b>YOLOv8 · RAG · LLM apps
            </li>
            <li>
              <b>Cloud and tools</b>AWS · Git · Arduino
            </li>
          </ul>
          <div className="meta mono">
            <span>B.E. CSE (IoT) · CGPA 8.21</span>
            <span>Based in Chennai</span>
            <span>Class of 2026</span>
          </div>
        </div>

        <div id="tWork">
          <h2 className="huge">Selected Work.</h2>
        </div>

        <div id="tLaptop">
          Real problems. Real results.
          <br />
          Open it up and see the wins.
        </div>

        <div id="tLogos">
          <h2>Wins &amp; Recognition.</h2>
          <p>Hackathons, patents and certifications, from college labs to national finals.</p>
          <div className="logo-rows">
            {[
              ['SIH 2024 Finalist', '✦ Solveathon 2023 Winner', 'Top 60 · Circuit Digest', 'Project Expo 1st Runner-Up'],
              ['2 Patent Applications', 'Royal Enfield Project', '95%+ Recognition', 'Selected from 500+ teams'],
              ['Cisco NetAcad · Python', 'NPTEL Cloud · 85/100', 'CGPA 8.21', 'B.E. CSE (IoT)'],
            ].map((row, i) => (
              <div key={row[0]} className={`logo-row${i === 1 ? ' r' : ''}`}>
                {[...row, ...row].map((item, j) => (
                  <span key={`${item}-${j}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div id="tRome" className="huge">
          <span>
            From <em>Chennai</em> to the world
          </span>
        </div>
        <div id="tOops">Oops!</div>
      </div>

      <canvas id="gl" />

      <div className="layer" id="ui">
        <div className="hint mono" id="hint">
          Scroll to begin ↓
        </div>
        <div id="seeProj">See project ↗</div>
        <div id="tWorkSide">
          Six projects in AI, computer vision and IoT, from hackathon prototypes to a live test on a
          Royal Enfield assembly line. Click any card.
          <br />
          <button className="pill" type="button" style={{ marginTop: 12 }} onClick={onOpenProjects}>
            All projects ↗
          </button>
        </div>
        <div id="contact">
          <span className="watermark">hello</span>
          <div className="row">
            <div>
              <span className="mono" style={{ opacity: 0.6 }}>
                Still scrolling? Good sign.
              </span>
              <h2 style={{ marginTop: 10 }}>
                Got a role
                <br />
                in mind?
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="mono" style={{ opacity: 0.6 }}>
                Email me
              </span>
              <br />
              <a className="mail" href="mailto:kamaljeyaram07@gmail.com">
                kamaljeyaram07@gmail.com
              </a>
              <br />
              <span style={{ fontSize: 13, opacity: 0.7 }}>+91 90259 00546 · I usually reply within a day.</span>
              <br />
              <button className="pill ghost" type="button" style={{ marginTop: 14 }} onClick={onOpenProjects}>
                See all projects ↗
              </button>
            </div>
          </div>
          <div className="cols">
            <div>
              <span className="mono">Pages</span>
              Home
              <br />
              Skills
              <br />
              Projects
              <br />
              Contact
            </div>
            <div>
              <span className="mono">Social</span>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <br />
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <br />
              Portfolio
            </div>
            <div>
              <span className="mono">Local time</span>
              <span id="clock">--:--</span> in India
              <br />
              GMT +5:30
            </div>
            <div>
              <span className="mono">Status</span>
              <span className="dot" />
              Open to work
            </div>
          </div>
          <div className="foot mono">
            <span>
              © {new Date().getFullYear()} Kamal Jeyaram T
            </span>
            <button id="toTop" type="button" className="mono">
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      <div id="spacer" />
    </>
  )
}
