
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

async function getGitHubData(username: string) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GITPULSE"
  };

  const [userResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 300 }
    }),
    fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 300 }
      }
    )
  ]);

  if (userResponse.status === 404) {
    return { kind: "not-found" as const };
  }

  if (
    userResponse.status === 403 ||
    userResponse.status === 429 ||
    reposResponse.status === 403 ||
    reposResponse.status === 429
  ) {
    return { kind: "rate-limit" as const };
  }

  if (!userResponse.ok || !reposResponse.ok) {
    return { kind: "error" as const };
  }

  const user = (await userResponse.json()) as GitHubUser;
  const repos = (await reposResponse.json()) as GitHubRepo[];

  return {
    kind: "success" as const,
    user,
    repos
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function formatRelativeDate(value: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  );

  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  if (days < 365) return `Updated ${Math.floor(days / 30)} months ago`;

  return `Updated ${Math.floor(days / 365)} years ago`;
}

function languageColor(language: string) {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572a5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#663399",
    C: "#555555",
    "C++": "#f34b7d",
    CSharp: "#178600",
    Go: "#00add8",
    Rust: "#dea584",
    PHP: "#4f5d95",
    Ruby: "#701516",
    Swift: "#f05138",
    Kotlin: "#a97bff"
  };

  return colors[language] ?? "#a78bfa";
}

export default async function DashboardPage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    notFound();
  }

  const result = await getGitHubData(username);

  if (result.kind === "not-found") {
    notFound();
  }

  if (result.kind === "rate-limit") {
    return (
      <main className="dashboard-message">
        <div className="message-icon">◈</div>
        <p className="section-eyebrow">GITPULSE / API STATUS</p>
        <h1>Taking a quick breather.</h1>
        <p>
          GitHub has temporarily limited requests. Please try again later.
          Your profile data has not been changed.
        </p>
        <Link className="dashboard-back" href="/">
          ← Back to GITPULSE
        </Link>
      </main>
    );
  }

  if (result.kind === "error") {
    return (
      <main className="dashboard-message">
        <div className="message-icon">!</div>
        <p className="section-eyebrow">GITPULSE / CONNECTION</p>
        <h1>We couldn't load this profile.</h1>
        <p>
          GitHub may be temporarily unavailable. Please try again in a
          little while.
        </p>
        <Link className="dashboard-back" href="/">
          ← Try another profile
        </Link>
      </main>
    );
  }

  const { user, repos } = result;

  const originalRepos = repos.filter((repo) => !repo.fork);
  const totalStars = repos.reduce(
    (total, repo) => total + repo.stargazers_count,
    0
  );
  const totalForks = repos.reduce(
    (total, repo) => total + repo.forks_count,
    0
  );

  const languageCounts = new Map<string, number>();

  for (const repo of originalRepos) {
    if (repo.language) {
      languageCounts.set(
        repo.language,
        (languageCounts.get(repo.language) ?? 0) + 1
      );
    }
  }

  const languages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const languageTotal = languages.reduce(
    (total, [, count]) => total + count,
    0
  );

  return (
    <main className="analytics-shell">
      <header className="analytics-topbar">
        <Link className="brand" href="/">
          <span className="brand-icon">
            <span className="pulse-mark">
              <span />
              <span />
              <span />
            </span>
          </span>
          <span>
            GIT<span className="brand-accent">PULSE</span>
          </span>
        </Link>

        <span className="analytics-label">DEVELOPER ANALYTICS</span>

        <Link className="dashboard-back" href="/">
          ← New search
        </Link>
      </header>

      <section className="analytics-content">
        <div className="analytics-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{user.login}</span>
        </div>

        <div className="analytics-heading">
          <div>
            <p className="section-eyebrow">YOUR DEVELOPER SNAPSHOT</p>
            <h1>
              Profile <span className="gradient-text">overview.</span>
            </h1>
            <p className="analytics-subtitle">
              Public GitHub data, brought into focus.
            </p>
          </div>
          <span className="live-badge">
            <span className="status-dot" />
            LIVE PROFILE
          </span>
        </div>

        <section className="profile-panel">
          <div className="profile-identity">
            <img
              className="profile-avatar"
              src={user.avatar_url}
              alt={`${user.login}'s GitHub avatar`}
              width={100}
              height={100}
            />
            <div className="profile-details">
              <h2>{user.name || user.login}</h2>
              <a
                className="profile-username"
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
              >
                @{user.login} ↗
              </a>
              <p className="profile-bio">
                {user.bio || "This developer hasn't added a public bio."}
              </p>
              <div className="profile-meta">
                {user.location && <span>⌖ {user.location}</span>}
                {user.company && <span>▧ {user.company}</span>}
                {user.blog && (
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    ↗ Website
                  </a>
                )}
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
          <a
            className="github-profile-link"
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View GitHub profile ↗
          </a>
        </section>

        <section className="analytics-stat-grid" aria-label="Profile statistics">
          <article className="analytics-stat-card">
            <span className="stat-label">PUBLIC REPOSITORIES</span>
            <strong>{formatNumber(user.public_repos)}</strong>
            <span className="stat-caption">
              {repos.length} loaded for analysis
            </span>
          </article>
          <article className="analytics-stat-card">
            <span className="stat-label">FOLLOWERS</span>
            <strong>{formatNumber(user.followers)}</strong>
            <span className="stat-caption">Developer community</span>
          </article>
          <article className="analytics-stat-card">
            <span className="stat-label">STARS ANALYZED</span>
            <strong>{formatNumber(totalStars)}</strong>
            <span className="stat-caption">
              Across loaded repositories
            </span>
          </article>
          <article className="analytics-stat-card">
            <span className="stat-label">FOLLOWING</span>
            <strong>{formatNumber(user.following)}</strong>
            <span className="stat-caption">Accounts followed</span>
          </article>
        </section>

        <div className="analytics-main-grid">
          <section className="analytics-panel language-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">TECH STACK</p>
                <h2>Language insights</h2>
              </div>
              <span className="panel-symbol">◉</span>
            </div>

            {languages.length > 0 ? (
              <>
                <div className="language-distribution">
                  {languages.map(([language, count]) => (
                    <span
                      key={language}
                      title={language}
                      style={{
                        width: `${(count / languageTotal) * 100}%`,
                        background: languageColor(language)
                      }}
                    />
                  ))}
                </div>
                <div className="language-list">
                  {languages.map(([language, count]) => (
                    <div className="language-row" key={language}>
                      <span
                        className="language-dot"
                        style={{ background: languageColor(language) }}
                      />
                      <span className="language-name">{language}</span>
                      <span className="language-count">
                        {count} {count === 1 ? "repository" : "repositories"}
                      </span>
                      <strong>
                        {Math.round((count / languageTotal) * 100)}%
                      </strong>
                    </div>
                  ))}
                </div>
                <p className="analytics-disclaimer">
                  Based on detected languages in loaded original repositories,
                  not lines of code.
                </p>
              </>
            ) : (
              <p className="empty-state">
                No language data is available in the loaded repositories.
              </p>
            )}
          </section>

          <section className="analytics-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">PROJECT MOMENTUM</p>
                <h2>Repository snapshot</h2>
              </div>
              <span className="panel-symbol">⌘</span>
            </div>

            <div className="snapshot-row">
              <span>Original repositories loaded</span>
              <strong>{originalRepos.length}</strong>
            </div>
            <div className="snapshot-row">
              <span>Stars across loaded repositories</span>
              <strong>{formatNumber(totalStars)}</strong>
            </div>
            <div className="snapshot-row">
              <span>Forks across loaded repositories</span>
              <strong>{formatNumber(totalForks)}</strong>
            </div>
            <div className="snapshot-row">
              <span>Followers per public repository</span>
              <strong>
                {user.public_repos > 0
                  ? (user.followers / user.public_repos).toFixed(1)
                  : "—"}
              </strong>
            </div>
            <p className="analytics-disclaimer">
              Repository totals may cover only the 100 most recently updated
              repositories. Forks and archived projects are included in the
              overall loaded-repository totals.
            </p>
          </section>
        </div>

        <section className="repositories-section">
          <div className="repositories-heading">
            <div>
              <p className="section-eyebrow">THE WORK BEHIND THE PROFILE</p>
              <h2>Recently updated repositories</h2>
              <p>Public projects, sorted by GitHub's latest update.</p>
            </div>
            <a
              className="dashboard-back"
              href={`${user.html_url}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
            >
              All repositories ↗
            </a>
          </div>

          {repos.length > 0 ? (
            <div className="repository-grid">
              {repos.slice(0, 12).map((repo) => (
                <article className="repository-card" key={repo.id}>
                  <div className="repository-card-top">
                    <span className="repo-icon">⌘</span>
                    <span className="repo-visibility">PUBLIC</span>
                  </div>
                  <a
                    className="repository-name"
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {repo.name} ↗
                  </a>
                  <p className="repository-description">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="repository-meta">
                    {repo.language && (
                      <span className="repo-language">
                        <span
                          className="language-dot"
                          style={{
                            background: languageColor(repo.language)
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span>☆ {formatNumber(repo.stargazers_count)}</span>
                    <span>⑂ {formatNumber(repo.forks_count)}</span>
                  </div>
                  <div className="repository-updated">
                    {formatRelativeDate(repo.updated_at)}
                    {repo.fork && <span> · Fork</span>}
                    {repo.archived && <span> · Archived</span>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              This profile has no public repositories to display.
            </div>
          )}
        </section>

        <footer className="analytics-footer">
          <Link className="brand" href="/">
            <span>
              GIT<span className="brand-accent">PULSE</span>
            </span>
          </Link>
          <span>Insights from public GitHub data.</span>
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
            GitHub API documentation ↗
          </a>
        </footer>
      </section>
    </main>
  );
}
