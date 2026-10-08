// Builds src/projects.json from public GitHub repos tagged "portfolio".
// Order and wording come from data/portfolio.json; repos not listed there
// go at the top, newest first. Missing preview images are screenshotted.
import fs from 'node:fs';
import path from 'node:path';

const OWNER = 'aussiedatagal';
const TOPIC = 'portfolio';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio.json'), 'utf8'));
const previewDir = path.join(root, 'public/assets/previews');

async function fetchRepos() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/users/${OWNER}/repos?per_page=100&type=owner`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

function titleFromName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function toProject(repo) {
  const extra = config.overrides[repo.name] || {};
  const title = extra.title || titleFromName(repo.name);
  return {
    id: repo.name,
    title,
    description: extra.description || repo.description || '',
    liveUrl: repo.homepage || `https://${OWNER}.github.io/${repo.name}/`,
    repoUrl: repo.html_url,
    previewImage: `/assets/previews/${repo.name}-preview.png`,
    previewTitle: extra.previewTitle || title,
  };
}

function sortProjects(repos) {
  const rank = id => config.order.indexOf(id);
  const unlisted = repos.filter(r => rank(r.name) === -1)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const listed = repos.filter(r => rank(r.name) !== -1)
    .sort((a, b) => rank(a.name) - rank(b.name));
  return [...unlisted, ...listed];
}

async function screenshotMissing(projects) {
  const missing = projects.filter(p => !fs.existsSync(path.join(root, 'public', p.previewImage)));
  if (!missing.length) return;
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  for (const p of missing) {
    const page = await browser.newPage({ viewport: { width: 900, height: 560 }, deviceScaleFactor: 4 / 3 });
    try {
      await page.goto(p.liveUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(4000);
      await page.keyboard.press('Escape');
      await page.screenshot({ path: path.join(previewDir, `${p.id}-preview.png`) });
      console.log(`Preview saved for ${p.id}`);
    } catch (err) {
      console.warn(`No preview for ${p.id}: ${err.message}`);
    }
    await page.close();
  }
  await browser.close();
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function writeNoscriptList(projects) {
  const file = path.join(root, 'public/index.html');
  const articles = projects.map(p => `        <article>
          <h2><a href="${p.liveUrl}">${escapeHtml(p.title)}</a></h2>
          <p>${escapeHtml(p.description)}</p>
          <a href="${p.repoUrl}">Source code</a>
        </article>
`).join('');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/(      <main>\n)[\s\S]*?(      <\/main>)/, `$1${articles}$2`);
  fs.writeFileSync(file, html);
}

const repos = (await fetchRepos())
  .filter(r => !r.private && !r.archived && r.has_pages && r.topics?.includes(TOPIC));
const projects = sortProjects(repos).map(toProject);
await screenshotMissing(projects);
fs.writeFileSync(path.join(root, 'src/projects.json'), JSON.stringify(projects, null, 2) + '\n');
writeNoscriptList(projects);
console.log(`${projects.length} projects: ${projects.map(p => p.id).join(', ')}`);
