import { useState } from "react";
import RobotViewport from "./components/RobotViewport.jsx";
import Terminal from "./components/Terminal.jsx";
import {
  SHOW_PLACEHOLDERS,
  profile,
  socials,
  projects,
  skills,
  leadership,
  certifications,
  channels,
  about,
  education,
} from "./data.js";

// A hatched "unknown" region, like unexplored space on a robot's map.
function Unmapped({ children, as, inline = false, className = "" }) {
  if (!SHOW_PLACEHOLDERS) return null;
  const Tag = as || (inline ? "span" : "div");
  return (
    <Tag className={`unmapped ${inline ? "unmapped--inline" : ""} ${className}`}>
      <strong>Unmapped:</strong> {children}
    </Tag>
  );
}

const STATUS = { done: "Done", "in-progress": "In progress", planned: "Planned" };

function Status({ value }) {
  return <span className={`status status--${value}`}>{STATUS[value]}</span>;
}

const LINK_LABELS = { code: "Code", demo: "Live demo", video: "Video" };

function ProjectLinks({ links }) {
  const entries = Object.entries(links || {});
  if (!entries.length) return null;
  return (
    <ul className="project__links">
      {entries.map(([key, url]) =>
        url ? (
          <li key={key}>
            <a href={url} target="_blank" rel="noreferrer">
              {LINK_LABELS[key]}
            </a>
          </li>
        ) : SHOW_PLACEHOLDERS ? (
          <li key={key}>
            <Unmapped inline>{LINK_LABELS[key].toLowerCase()} link</Unmapped>
          </li>
        ) : null
      )}
    </ul>
  );
}

function Project({ p }) {
  const planned = p.status === "planned";
  const classes = ["project", p.featured && "project--featured", planned && "project--planned"].filter(Boolean).join(" ");
  const media = p.image ? (
    <img className="project__image" src={p.image} alt={p.imageAlt || ""} loading="lazy" />
  ) : (
    !planned && <Unmapped className="project__image-empty">add a screenshot, GIF or short demo video</Unmapped>
  );

  return (
    <article className={classes}>
      {media && <div className="project__media">{media}</div>}
      <div className="project__body">
        <header className="project__head">
          <h3>{p.name}</h3>
          <Status value={p.status} />
        </header>
        {p.fullName && <p className="project__fullname">{p.fullName}</p>}
        <p className="project__summary">{p.summary}</p>

        {p.highlights && (
          <ul className="project__highlights">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        {p.milestones && (
          <ol className="milestones">
            {p.milestones.map((m) => (
              <li key={m.title}>
                <span>{m.title}</span>
                <Status value={m.status} />
              </li>
            ))}
          </ol>
        )}

        <dl className="project__meta">
          {p.role && (
            <div>
              <dt>Role</dt>
              <dd>{p.role}</dd>
            </div>
          )}
          {p.duration && (
            <div>
              <dt>Timeline</dt>
              <dd>{p.duration}</dd>
            </div>
          )}
          {p.now && (
            <div>
              <dt>Working on now</dt>
              <dd>{p.now}</dd>
            </div>
          )}
        </dl>

        <ul className="stack" aria-label="Built with">
          {p.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <ProjectLinks links={p.links} />
      </div>
    </article>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button type="button" className="btn" onClick={copy} aria-live="polite">
      {copied ? "Email copied" : "Copy email"}
    </button>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#work">
        Skip to projects
      </a>

      <header className="site-header">
        <div className="site-header__inner wrap">
        <a href="#top" className="brand">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="site-nav">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#terminal">Terminal</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn--small btn--solid" href={profile.resume} download>
          Resume
        </a>
        </div>
      </header>

      <main>
        <section className="hero wrap" id="top">
          <div className="hero__text">
            <h1 className="hero__name">
              Vishwas
              <br />B M
            </h1>
            <p className="hero__role">{profile.role}</p>
            <p className="hero__intro">{profile.intro}</p>
            <div className="hero__actions">
              <a className="btn btn--solid" href="#work">
                See my work
              </a>
              <a className="btn" href={profile.resume} download>
                Download resume
              </a>
            </div>
          </div>
          <RobotViewport />
        </section>

        <section className="section wrap" id="work">
          <div className="section__head">
            <h2>Work</h2>
            <p>Robotics projects I've built or am building now.</p>
          </div>
          <div className="projects">
            {projects.map((p) => (
              <Project key={p.id} p={p} />
            ))}
          </div>
        </section>

        <section className="section wrap" id="skills">
          <div className="section__head">
            <h2>Skills</h2>
            <p>What I've actually used in the projects above.</p>
          </div>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group} className="skills__group">
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--terminal" id="terminal">
          <div className="wrap terminal-layout">
            <div className="section__head">
              <h2>Try the terminal</h2>
              <p>
                Prefer the command line? Everything on this page is here too. Start with <code>help</code>, or try{" "}
                <code>sudo hire vishwas</code>.
              </p>
            </div>
            <Terminal />
          </div>
        </section>

        <section className="section wrap" id="leadership">
          <div className="section__head">
            <h2>Leadership</h2>
          </div>
          <ul className="entries">
            {leadership.map((l) => (
              <li key={l.title} className="entry">
                <div className="entry__when">{l.year || <Unmapped inline>year</Unmapped>}</div>
                <div>
                  <h3>{l.title}</h3>
                  <p>{l.detail}</p>
                  {l.more ? <p>{l.more}</p> : l.moreHint && <Unmapped>{l.moreHint}</Unmapped>}
                </div>
              </li>
            ))}
          </ul>

          <h2 className="subhead">Certifications</h2>
          <ul className="certs">
            {certifications.map((c) => (
              <li key={c.title} className="cert">
                <h3>{c.title}</h3>
                <p>
                  {c.issuer}, {c.year}
                </p>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer">
                    View certificate
                  </a>
                ) : (
                  <Unmapped inline>certificate link</Unmapped>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="section wrap" id="channels">
          <div className="section__head">
            <h2>Learning in public</h2>
            <p>I share what I learn while I learn it.</p>
          </div>
          <div className="channels">
            {channels.map((c) => (
              <article key={c.handle} className="channel">
                <h3>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    {c.handle}
                  </a>
                </h3>
                <p className="channel__platform">{c.platform}</p>
                <p>{c.about}</p>
                {c.series && <p className="channel__series">{c.series}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="about">
          <div className="section__head">
            <h2>About</h2>
          </div>
          <div className="about">
            <div className="about__text">
              {about.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <div className="about__facts">
                <div>
                  <h3>Languages</h3>
                  <p>{about.languages.join(", ")}</p>
                </div>
                <div>
                  <h3>Off the clock</h3>
                  <p>{about.offTheClock.join(", ")}</p>
                </div>
              </div>
            </div>
            <div className="about__edu">
              <h3>Education</h3>
              <ol className="timeline">
                {education.map((e) => (
                  <li key={e.degree}>
                    <p className="timeline__years">{e.years}</p>
                    <p className="timeline__degree">{e.degree}</p>
                    <p>{e.school}</p>
                    {e.score ? <p>{e.score}</p> : <Unmapped inline>CGPA</Unmapped>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section section--contact wrap" id="contact">
          <h2>Contact</h2>
          <p className="contact__lead">The fastest way to reach me is email.</p>
          <a className="contact__email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="contact__actions">
            <CopyEmail />
            <a className="btn" href={profile.resume} download>
              Download resume
            </a>
          </div>
          {profile.availability ? (
            <p className="contact__availability">{profile.availability}</p>
          ) : (
            <Unmapped>when you're available for internships, and remote or on-site</Unmapped>
          )}
          <ul className="socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  <span className="socials__label">{s.label}</span>
                  <span className="socials__handle">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="wrap">
        <div className="site-footer">
          <p>© {new Date().getFullYear()} {profile.name}. Built with React.</p>
          <p>The robot up top runs a simple go-to-goal controller.</p>
        </div>
      </footer>
    </>
  );
}
