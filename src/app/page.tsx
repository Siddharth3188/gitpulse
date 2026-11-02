
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const features = [
  {
    number: "01",
    title: "Developer intelligence",
    description:
      "Turn public GitHub profile data into a clear, useful overview of a developer's work.",
    icon: "◈"
  },
  {
    number: "02",
    title: "Repository analytics",
    description:
      "Explore stars, forks, programming languages, and recently updated projects.",
    icon: "⌘"
  },
  {
    number: "03",
    title: "Developer comparison",
    description:
      "Compare two profiles side by side and discover how their public projects differ.",
    icon: "⇄"
  }
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PulseMark() {
  return (
    <span className="pulse-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = username.trim().replace(/^@/, "");

    if (!value) {
      setError("Enter a GitHub username to get started.");
      return;
    }

    if (!/^[a-zA-Z0-9-]{1,39}$/.test(value)) {
      setError("Enter a valid GitHub username.");
      return;
    }

    setError("");
    router.push(`/dashboard/${encodeURIComponent(value)}`);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="GITPULSE home">
          <span className="brand-icon">
            <PulseMark />
          </span>
          <span>
            GIT<span className="brand-accent">PULSE</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <a
          className="nav-cta"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
        >
          Explore GitHub <ArrowIcon />
        </a>
      </header>

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />

        <div className="eyebrow">
          <span className="status-dot" />
          YOUR DEVELOPER INTELLIGENCE PLATFORM
        </div>

        <h1>
          Your GitHub.
          <br />
          <span className="gradient-text">Decoded.</span>
        </h1>

        <p className="hero-description">
          Every repository tells a story. Discover the projects,
          technologies, and activity behind any public GitHub profile.
          All in one beautifully designed workspace.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <span className="search-prefix" aria-hidden="true">
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            placeholder="Enter a GitHub username"
            aria-label="GitHub username"
            autoComplete="off"
            spellCheck={false}
            maxLength={40}
          />
          <button type="submit">
            Analyze profile <ArrowIcon />
          </button>
        </form>

        {error && (
          <p className="search-error" role="alert">
            {error}
          </p>
        )}

        <p className="search-note">
          <span className="mini-check">✓</span>
          Public profiles · No account required
        </p>

        <div className="dashboard-preview">
          <div className="preview-topbar">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="preview-label">PROFILE OVERVIEW</span>
            <span className="preview-live">
              <span className="status-dot" /> LIVE DATA, WHEN CONNECTED
            </span>
          </div>

          <div className="preview-content">
            <div className="preview-profile">
              <div className="avatar-placeholder" aria-hidden="true">
                G
              </div>
              <div className="profile-copy">
                <span className="profile-kicker">DEVELOPER PROFILE</span>
                <h2>Your next discovery</h2>
                <p>Search a username to explore a real profile.</p>
              </div>
              <span className="github-badge">GitHub</span>
            </div>

            <div className="preview-stats">
              <div className="stat-card">
                <span>Repositories</span>
                <strong>—</strong>
                <small>Public projects</small>
              </div>
              <div className="stat-card">
                <span>Total stars</span>
                <strong>—</strong>
                <small>Across repositories</small>
              </div>
              <div className="stat-card">
                <span>Followers</span>
                <strong>—</strong>
                <small>Developer community</small>
              </div>
            </div>

            <div className="preview-bottom">
              <div>
                <span className="preview-section-label">
                  TECHNOLOGY INSIGHTS
                </span>
                <p>Explore language distribution and project activity.</p>
              </div>
              <div className="language-bars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="preview-footer">
            <span>GITPULSE ANALYTICS</span>
            <span>YOUR GITHUB. DECODED.</span>
          </div>
        </div>

        <div className="hero-bottom-line">
          <span>BUILT FOR DEVELOPERS</span>
          <span className="line" />
          <span>POWERED BY PUBLIC GITHUB DATA</span>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">MORE THAN A PROFILE</span>
          <h2>
            Make sense of your
            <br />
            <span className="gradient-text">development journey.</span>
          </h2>
          <p>
            Less digging through repositories. More insight into the
            work behind them.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-card-top">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-number">{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow">
                <ArrowIcon />
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section" id="how-it-works">
        <div className="closing-orb" aria-hidden="true" />
        <span className="section-eyebrow">A CLEARER VIEW OF OPEN SOURCE</span>
        <h2>
          The code is public.
          <br />
          <span className="gradient-text">The insights are yours.</span>
        </h2>
        <p>
          Start with a username. Discover the work. Share what you find.
        </p>
        <form className="closing-form" onSubmit={handleSearch}>
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            placeholder="Try your GitHub username"
            aria-label="GitHub username"
          />
          <button type="submit">
            Get started <ArrowIcon />
          </button>
        </form>
        {error && (
          <p className="search-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-icon">
            <PulseMark />
          </span>
          <span>
            GIT<span className="brand-accent">PULSE</span>
          </span>
        </a>
        <p>Your GitHub. Decoded.</p>
        <span className="footer-note">
          An independent developer analytics project.
        </span>
      </footer>
    </main>
  );
}
