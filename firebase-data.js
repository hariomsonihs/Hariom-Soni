import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFVZuJJibflJK7qsR_rv-paJEbQwxnGuI",
  authDomain: "hariom-kumar-76893.firebaseapp.com",
  databaseURL: "https://hariom-kumar-76893-default-rtdb.firebaseio.com",
  projectId: "hariom-kumar-76893",
  storageBucket: "hariom-kumar-76893.firebasestorage.app",
  messagingSenderId: "510509967640",
  appId: "1:510509967640:web:2b94aa6496003efe7b966d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function listen(path, cb) {
  onValue(ref(db, path), snap => cb(snap.val() || {}));
}

// ── GITHUB STATS (index.html) ──
const ghLiveCard = document.getElementById('gh-stats-row');
if (ghLiveCard) {
  listen('github_stats', d => {
    if (!d || !d.repos) return;
    ghLiveCard.innerHTML =
      `<div class="gh-stat-box"><span>${d.repos||'43'}</span><small>Public Repos</small></div>` +
      `<div class="gh-stat-box"><span>${d.contrib_current||'903'}</span><small>Contributions '${d.year_current||'26'}</small></div>` +
      `<div class="gh-stat-box"><span>${d.contrib_prev||'944'}</span><small>Contributions '${d.year_prev||'25'}</small></div>` +
      `<div class="gh-stat-box"><span>${d.followers||'2'}</span><small>Followers</small></div>`;

    // top languages
    const langsEl = document.getElementById('gh-langs-list');
    if (langsEl && d.languages) {
      langsEl.innerHTML = d.languages.split('\n').filter(Boolean).map(line => {
        const [name, pct, color] = line.split('|').map(s => s.trim());
        const p = pct || '10';
        const c = color || '#667eea';
        return `<div class="gh-lang-item">
          <div class="gh-lang-info"><span class="gh-lang-dot" style="background:${c}"></span><span>${name}</span><span class="gh-lang-pct">${p}%</span></div>
          <div class="gh-lang-bar"><div class="gh-lang-fill" style="width:${p}%;background:${c}"></div></div>
        </div>`;
      }).join('');
    }

    if (d.orcid)       { const el = document.getElementById('gh-orcid-link');       if (el) el.href = d.orcid; }
    if (d.achievement) { const el = document.getElementById('gh-achievement-link'); if (el) el.href = d.achievement; }
  });
}

// ── CERTIFICATIONS (index.html) ──
const certContainer = document.getElementById("firebase-certifications");
if (certContainer) {
  listen("certifications", data => {
    const items = Object.values(data);
    if (!items.length) {
      certContainer.innerHTML = `<li><i class="fa-solid fa-check-circle"></i><span>No certifications added yet.</span></li>`;
      return;
    }
    certContainer.innerHTML = items.map(d => {
      const meta = [d.issuer, d.date].filter(Boolean).join(" • ");
      return `
      <li>
        <i class="fa-solid fa-check-circle"></i>
        <div class="cert-info">
          <span class="cert-title">${d.title || ""}</span>
          ${meta ? `<span class="cert-meta">${meta}</span>` : ""}
          ${d.description ? `<span class="cert-desc-short">${d.description}</span>` : ""}
        </div>
        <div class="cert-actions">
          ${d.description ? `<a href="#" class="cert-link cert-view-btn"
            data-title="${(d.title||'').replace(/"/g,'&quot;')}"
            data-issuer="${(d.issuer||'').replace(/"/g,'&quot;')}"
            data-date="${(d.date||'').replace(/"/g,'&quot;')}"
            data-desc="${(d.description||'').replace(/"/g,'&quot;')}">
            <i class="fa-solid fa-eye"></i> View
          </a>` : ""}
          ${d.link ? `<a href="${d.link}" target="_blank" class="cert-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Link</a>` : ""}
        </div>
      </li>`;
    }).join("");

    certContainer.querySelectorAll(".cert-view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const meta = [btn.dataset.issuer, btn.dataset.date].filter(Boolean).join(" • ");
        openCardModal({ icon: "fa-solid fa-certificate", title: btn.dataset.title, desc: btn.dataset.desc, meta });
      });
    });
  });
}

// ── PROJECTS PREVIEW (index.html) ──
const projPreview = document.getElementById("index-projects-preview");
if (projPreview) {
  let previewData = {};
  function renderPreview() {
    const items = Object.entries(previewData).slice(0, 3);
    if (!items.length) { projPreview.innerHTML = ""; return; }
    projPreview.innerHTML = items.map(([key, d]) => {
      const proj = projIconHTML(d.icon, d.gradient);
      return `
      <div class="project-card reveal visible">
        <div class="project-img" style="background:${proj.bg}">
          ${proj.html}
        </div>
        <div class="project-body">
          <div class="project-tags">${(d.tags || "").split(",").map(t => `<span>${t.trim()}</span>`).join("")}</div>
          <h4>${d.title || ""}</h4>
          <p>${d.description || ""}</p>
          <div class="project-links">
            ${d.github ? `<a href="${d.github}" target="_blank"><i class="fa-brands fa-github"></i> Code</a>` : ''}
            ${d.live   ? `<a href="${d.live}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join("");
  }
  listen("personal_projects", data => { Object.assign(previewData, data); renderPreview(); });
  listen("client_projects",   data => { Object.assign(previewData, data); renderPreview(); });
  listen("college_projects",  data => { Object.assign(previewData, data); renderPreview(); });
}

// ── EXPERIENCE (index.html) ──
const expContainer = document.getElementById("firebase-experience");
if (expContainer) {
  listen("experience", data => {
    const items = Object.values(data).reverse();
    if (!items.length) return;
    expContainer.innerHTML = items.map(d => `
      <div class="timeline-item">
        <div class="tl-dot"></div>
        <div class="tl-card">
          <span class="tl-date">${d.date || ""}</span>
          <h4>${d.role || ""}</h4>
          <p>${d.company || ""}</p>
          <small>${d.description || ""}</small>
        </div>
      </div>`).join("");
  });
}

// ── ACTIVITIES (activities.html) ──
const actContainer = document.getElementById("firebase-activities");
if (actContainer) {
  listen("activities", data => {
    const items = Object.values(data);
    if (!items.length) return;
    actContainer.innerHTML = items.map(d => `
      <div class="activity-card reveal visible">
        <div class="act-icon"><i class="${d.icon || 'fa-solid fa-bolt'}"></i></div>
        <h4>${d.title || ""}</h4>
        <p>${d.description || ""}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <span class="act-tag">${d.category || ""}</span>
          <a href="#" class="card-view-btn act-view-btn"
            data-icon="${d.icon || 'fa-solid fa-bolt'}"
            data-title="${(d.title||'').replace(/"/g,'&quot;')}"
            data-desc="${(d.description||'').replace(/"/g,'&quot;')}"
            data-meta="${(d.category||'').replace(/"/g,'&quot;')}">
            <i class="fa-solid fa-eye"></i> View
          </a>
        </div>
      </div>`).join("");

    actContainer.querySelectorAll(".act-view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        openCardModal({ icon: btn.dataset.icon, title: btn.dataset.title, desc: btn.dataset.desc, meta: btn.dataset.meta });
      });
    });
  });
}

// ── DAILY LOG (activities.html) ──
const logContainer = document.getElementById("firebase-dailylog");
if (logContainer) {
  listen("dailylog", data => {
    const items = Object.values(data).reverse();
    if (!items.length) {
      logContainer.innerHTML = `<p style="color:var(--muted);text-align:center;padding:40px 0;font-size:0.9rem;"><i class="fa-solid fa-calendar-days" style="display:block;font-size:2rem;margin-bottom:12px;color:var(--primary);"></i>No log entries yet. Add from Admin Panel.</p>`;
      return;
    }

    const grouped = {};
    items.forEach(d => {
      const key = `${d.day}-${d.month}`;
      if (!grouped[key]) grouped[key] = { day: d.day, month: d.month, entries: [] };
      grouped[key].entries.push(d);
    });

    logContainer.innerHTML = Object.values(grouped).map(g => `
      <div class="log-day reveal visible">
        <div class="log-date-col">
          <div class="log-date-box">
            <span class="log-day-num">${g.day}</span>
            <span class="log-month">${g.month}</span>
          </div>
          <div class="log-line"></div>
        </div>
        <div class="log-entries">
          ${g.entries.map((e, i) => `
            <div class="log-entry">
              <div class="log-entry-header">
                <span class="log-badge ${e.category || 'coding'}">
                  <i class="${categoryIcon(e.category)}"></i> ${capitalize(e.category || 'coding')}
                </span>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span class="log-time"><i class="fa-regular fa-clock"></i> ${e.time || ""}</span>
                  <a href="#" class="card-view-btn log-view-btn"
                    data-icon="${categoryIcon(e.category)}"
                    data-title="${(e.title||'').replace(/"/g,'&quot;')}"
                    data-desc="${(e.description||'').replace(/"/g,'&quot;')}"
                    data-meta="${capitalize(e.category||'coding')} &bull; ${e.time||''}">
                    <i class="fa-solid fa-eye"></i> View
                  </a>
                </div>
              </div>
              <h4>${e.title || ""}</h4>
              <p>${e.description || ""}</p>
            </div>`).join("")}
        </div>
      </div>`).join("");

    // attach click handlers via event delegation
    logContainer.querySelectorAll(".log-view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        openCardModal({
          icon: btn.dataset.icon,
          title: btn.dataset.title,
          desc: btn.dataset.desc,
          meta: btn.dataset.meta
        });
      });
    });
  });
}

function projIconHTML(icon, gradient) {
  if (!icon) return { html: '<i class="fa-solid fa-code"></i>', bg: gradient || 'var(--grad)' };
  if (icon.startsWith('http') || icon.startsWith('/')) {
    return { html: `<img src="${icon}" alt="" style="max-width:70%;max-height:70%;object-fit:contain;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" />`, bg: 'var(--card2)' };
  }
  return { html: `<i class="${icon}"></i>`, bg: gradient || 'var(--grad)' };
}

function statusBadge(status) {
  const map = {
    completed: { label: 'Completed', color: '#43e97b', bg: 'rgba(67,233,123,0.12)', icon: 'fa-circle-check' },
    ongoing:   { label: 'Ongoing',   color: '#4facfe', bg: 'rgba(79,172,254,0.12)', icon: 'fa-rotate' },
    paused:    { label: 'Paused',    color: '#ffd200', bg: 'rgba(255,210,0,0.12)',   icon: 'fa-pause' },
    planned:   { label: 'Planned',   color: '#a18cd1', bg: 'rgba(161,140,209,0.12)', icon: 'fa-calendar' }
  };
  const s = map[status] || map.completed;
  return `<span style="font-size:0.72rem;padding:3px 10px;border-radius:50px;background:${s.bg};color:${s.color};font-weight:600;display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid ${s.icon}"></i>${s.label}</span>`;
}

function projMetaRow(d) {
  const items = [
    d.year     ? `<span><i class="fa-solid fa-calendar-days"></i> ${d.year}</span>` : '',
    d.platform ? `<span><i class="fa-solid fa-layer-group"></i> ${d.platform}</span>` : '',
    d.duration ? `<span><i class="fa-solid fa-clock"></i> ${d.duration}</span>` : ''
  ].filter(Boolean);
  if (!items.length) return '';
  return `<div style="font-size:0.75rem;color:var(--muted);margin-bottom:6px;display:flex;gap:10px;flex-wrap:wrap;">${items.join('')}</div>`;
}
const projTabsEl = document.getElementById("proj-tabs");
if (projTabsEl) {
  // track which categories have data
  const projState = { personal: null, client: null, college: null };

  const TAB_META = {
    all:      { label: "All",       icon: "fa-solid fa-layer-group" },
    personal: { label: "Personal",  icon: "fa-solid fa-user" },
    client:   { label: "Client",    icon: "fa-solid fa-briefcase" },
    college:  { label: "College",   icon: "fa-solid fa-graduation-cap" }
  };

  function rebuildTabs() {
    const available = Object.keys(projState).filter(k => projState[k] && projState[k].length > 0);
    const tabs = available.length > 1 ? ['all', ...available] : available;
    projTabsEl.innerHTML = tabs.map((k, i) =>
      `<button class="act-tab${i === 0 ? ' active' : ''}" data-proj-tab="${k}">
        <i class="${TAB_META[k].icon}"></i> ${TAB_META[k].label}${k !== 'all' ? ' Projects' : ''}
      </button>`
    ).join("");

    // hide all panels, show first
    ['all', 'personal', 'client', 'college'].forEach(k => {
      const p = document.getElementById('tab-' + k);
      if (p) p.classList.remove('active');
    });
    if (tabs.length > 0) {
      const first = document.getElementById('tab-' + tabs[0]);
      if (first) first.classList.add('active');
    }

    // render All tab
    const allContainer = document.getElementById('firebase-all-projects');
    if (allContainer) {
      const allItems = available.flatMap(k => projState[k] || []);
      allContainer.innerHTML = allItems.map(([key, d]) => {
        const proj = projIconHTML(d.icon, d.gradient);
        const catLabel = d.client ? 'Client' : d.course ? 'College' : 'Personal';
        const catColor = d.client ? '#f5576c' : d.course ? '#43e97b' : 'var(--primary)';
        return `<div class="project-card reveal visible">
          <div class="project-img" style="background:${proj.bg}">${proj.html}</div>
          <div class="project-body">
            <div class="project-tags">
              <span style="background:rgba(87,232,255,0.1);color:${catColor};">${catLabel}</span>
              ${(d.tags || '').split(',').map(t => `<span>${t.trim()}</span>`).join('')}
              ${d.status ? statusBadge(d.status) : ''}
            </div>
            <h4>${d.title || ''}</h4>
            ${projMetaRow(d)}
            <p>${d.description || ''}</p>
            <div class="project-links">
              ${d.github ? `<a href="${d.github}" target="_blank"><i class="fa-brands fa-github"></i> Code</a>` : ''}
              ${d.live   ? `<a href="${d.live}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ''}
              <a href="#" class="btn-view-project" data-key="${key}"><i class="fa-solid fa-eye"></i> View</a>
            </div>
          </div>
        </div>`;
      }).join('');

      allContainer.querySelectorAll('.btn-view-project').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          openProjectModal(window._projectsData[btn.dataset.key]);
        });
      });
    }

    // attach click handlers
    projTabsEl.querySelectorAll(".act-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        projTabsEl.querySelectorAll(".act-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ['all', 'personal', 'client', 'college'].forEach(k => {
          const p = document.getElementById('tab-' + k);
          if (p) p.classList.remove('active');
        });
        const target = document.getElementById('tab-' + btn.dataset.projTab);
        if (target) target.classList.add('active');
      });
    });
  }

  function handleProjData(type, data) {
    const container = document.getElementById("firebase-" + type + "-projects");
    const items = Object.entries(data);
    projState[type] = items;
    if (!window._projectsData) window._projectsData = {};
    items.forEach(([k, v]) => window._projectsData[k] = v);

    if (!items.length) {
      if (container) container.innerHTML = "";
      rebuildTabs();
      return;
    }

    if (container) {
      container.innerHTML = items.map(([key, d]) => {
        const proj = projIconHTML(d.icon, d.gradient);
        return `<div class="project-card reveal visible">
          <div class="project-img" style="background:${proj.bg}">
            ${proj.html}
          </div>
          <div class="project-body">
            <div class="project-tags">
              ${(d.tags || "").split(",").map(t => `<span>${t.trim()}</span>`).join("")}
              ${d.client ? `<span style="background:rgba(245,87,108,0.12);color:#f5576c;"><i class="fa-solid fa-user-tie" style="margin-right:3px;"></i>${d.client}</span>` : ""}
              ${type === "college" && d.course ? `<span style="background:rgba(67,233,123,0.12);color:#43e97b;"><i class="fa-solid fa-graduation-cap" style="margin-right:3px;"></i>${d.course}</span>` : ""}
              ${d.status ? statusBadge(d.status) : ''}
            </div>
            <h4>${d.title || ""}</h4>
            ${projMetaRow(d)}
            <p>${d.description || ""}</p>
            <div class="project-links">
              ${d.github ? `<a href="${d.github}" target="_blank"><i class="fa-brands fa-github"></i> Code</a>` : ""}
              ${d.live   ? `<a href="${d.live}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ""}
              <a href="#" class="btn-view-project" data-key="${key}"><i class="fa-solid fa-eye"></i> View</a>
            </div>
          </div>
        </div>`;
      }).join("");

      container.querySelectorAll(".btn-view-project").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          openProjectModal(window._projectsData[btn.dataset.key]);
        });
      });
    }
    rebuildTabs();
  }

  listen("personal_projects", data => handleProjData("personal", data));
  listen("client_projects",   data => handleProjData("client",   data));
  listen("college_projects",  data => handleProjData("college",  data));
}

// ── PROJECT MODAL ──
window.openProjectModal = (d) => {
  if (!d) return;
  const proj = projIconHTML(d.icon, d.gradient);
  document.getElementById("projModalBanner").style.background = proj.bg;
  const iconEl = document.getElementById("projModalIcon");
  if (d.icon && (d.icon.startsWith('http') || d.icon.startsWith('/'))) {
    iconEl.outerHTML = `<img id="projModalIcon" src="${d.icon}" alt="" style="max-width:70%;max-height:70%;object-fit:contain;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" />`;
  } else {
    iconEl.outerHTML = `<i id="projModalIcon" class="${d.icon || 'fa-solid fa-code'}"></i>`;
  }
  document.getElementById("projModalTitle").textContent = d.title || "";
  document.getElementById("projModalDesc").textContent = d.description || "";
  document.getElementById("projModalTags").innerHTML =
    (d.status ? statusBadge(d.status) : '') +
    (d.tags || "").split(",").map(t => `<span>${t.trim()}</span>`).join("");

  // meta info row in modal
  const existingMeta = document.getElementById('projModalMetaRow');
  if (existingMeta) existingMeta.remove();
  const metaItems = [
    d.year     ? `<span><i class="fa-solid fa-calendar-days"></i> ${d.year}</span>` : '',
    d.platform ? `<span><i class="fa-solid fa-layer-group"></i> ${d.platform}</span>` : '',
    d.duration ? `<span><i class="fa-solid fa-clock"></i> ${d.duration}</span>` : '',
    d.client   ? `<span><i class="fa-solid fa-user-tie"></i> ${d.client}</span>` : '',
    d.course   ? `<span><i class="fa-solid fa-graduation-cap"></i> ${d.course}</span>` : ''
  ].filter(Boolean);
  if (metaItems.length) {
    const metaDiv = document.createElement('div');
    metaDiv.id = 'projModalMetaRow';
    metaDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;font-size:0.78rem;color:var(--muted);';
    metaDiv.innerHTML = metaItems.join('');
    document.getElementById("projModalDesc").insertAdjacentElement('beforebegin', metaDiv);
  }

  // tech stack
  const existingTech = document.getElementById('projModalTechStack');
  if (existingTech) existingTech.remove();
  if (d.tech_stack) {
    const techDiv = document.createElement('div');
    techDiv.id = 'projModalTechStack';
    techDiv.style.cssText = 'margin-bottom:14px;';
    techDiv.innerHTML = `<div class="proj-features-title" style="margin-bottom:8px;">Tech Stack</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${d.tech_stack.split(',').map(t => `<span style="font-size:0.72rem;padding:3px 10px;border-radius:50px;background:rgba(67,233,123,0.12);color:#43e97b;font-weight:500;">${t.trim()}</span>`).join('')}</div>`;
    document.getElementById("projModalFeaturesWrap").insertAdjacentElement('beforebegin', techDiv);
  }

  const features = (d.features || "").split("\n").map(f => f.trim()).filter(Boolean);
  const wrap = document.getElementById("projModalFeaturesWrap");
  if (features.length) {
    document.getElementById("projModalFeatures").innerHTML = features
      .map(f => `<li><i class="fa-solid fa-check"></i>${f}</li>`).join("");
    wrap.style.display = "block";
  } else {
    wrap.style.display = "none";
  }

  const links = document.getElementById("projModalLinks");
  links.innerHTML = [
    d.github ? `<a href="${d.github}" target="_blank" class="link-code"><i class="fa-brands fa-github"></i> Code</a>` : "",
    d.live   ? `<a href="${d.live}" target="_blank" class="link-live"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ""
  ].join("");

  document.getElementById("projModalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeProjectModal = (e) => {
  if (e && e.target !== document.getElementById("projModalOverlay")) return;
  document.getElementById("projModalOverlay").classList.remove("active");
  document.body.style.overflow = "";
};

// ── CARD MODAL (activities, services, dailylog) ──
window.openCardModal = ({ icon, title, desc, meta, features, tags, type }) => {
  const overlay = document.getElementById("cardModalOverlay");
  if (!overlay) return;
  document.getElementById("cardModalIcon").className = icon || "fa-solid fa-bolt";
  document.getElementById("cardModalTitle").textContent = title || "";
  document.getElementById("cardModalDesc").textContent = desc || "";
  document.getElementById("cardModalMeta").innerHTML = meta
    ? `<span style="font-size:0.78rem;color:var(--primary);font-weight:600;background:rgba(102,126,234,0.1);padding:3px 12px;border-radius:50px;display:inline-block;margin-bottom:12px;">${meta}</span>`
    : "";

  // features list
  let featHTML = "";
  if (features) {
    const list = features.split(",").map(f => f.trim()).filter(Boolean);
    if (list.length) {
      featHTML = `<div class="proj-features-title" style="margin-top:16px;">What's Included</div>
        <ul class="proj-features">${list.map(f => `<li><i class="fa-solid fa-check"></i>${f}</li>`).join("")}</ul>`;
    }
  }

  // view projects button — match tags with all projects
  let viewProjBtn = "";
  if (type === "service" && tags) {
    const tagList = tags.split(",").map(t => t.trim().toLowerCase());
    // find matching category
    let matchCat = null;
    if (window._projectsData) {
      const catScore = { personal: 0, client: 0, college: 0 };
      Object.values(window._projectsData).forEach(p => {
        const ptags = (p.tags || "").toLowerCase();
        const matched = tagList.some(t => ptags.includes(t));
        if (matched) {
          if (p.client) catScore.client++;
          else if (p.course) catScore.college++;
          else catScore.personal++;
        }
      });
      const best = Object.entries(catScore).sort((a,b) => b[1]-a[1])[0];
      if (best[1] > 0) matchCat = best[0];
    }
    const url = matchCat ? `projects.html#tab-${matchCat}` : "projects.html";
    viewProjBtn = `<div style="margin-top:20px;">
      <a href="${url}" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;font-size:0.85rem;padding:10px 22px;">
        <i class="fa-solid fa-diagram-project"></i> View Related Projects
      </a></div>`;
  }

  document.getElementById("cardModalExtra").innerHTML = featHTML + viewProjBtn;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeCardModal = (e) => {
  const overlay = document.getElementById("cardModalOverlay");
  if (!overlay) return;
  if (e && e.target !== overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
};

// close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    ["projModalOverlay", "cardModalOverlay"].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.classList.contains("active")) {
        el.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});

// ── REVIEWS ──
function renderReviews(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = Object.values(data);
  if (!items.length) {
    container.innerHTML = `<p style="color:var(--muted);text-align:center;padding:40px 0;grid-column:1/-1;"><i class="fa-solid fa-star" style="display:block;font-size:2rem;margin-bottom:12px;color:var(--primary);"></i>No reviews yet.</p>`;
    return;
  }
  container.innerHTML = items.map(d => {
    const stars = Math.min(5, Math.max(1, parseInt(d.rating) || 5));
    const starsHTML = Array.from({length: 5}, (_, i) =>
      `<i class="fa-${i < stars ? 'solid' : 'regular'} fa-star" style="color:${i < stars ? '#ffd700' : 'var(--muted)'}"></i>`
    ).join("");
    return `
    <div class="review-card reveal visible">
      <div class="review-header">
        <div class="review-avatar">${(d.name || "A").charAt(0).toUpperCase()}</div>
        <div>
          <div class="review-name">${d.name || "Anonymous"}</div>
          <div class="review-role">${d.role || ""}</div>
        </div>
        <div class="review-stars">${starsHTML}</div>
      </div>
      <p class="review-text">${d.review || ""}</p>
      ${d.project ? `<div class="review-tag"><i class="fa-solid fa-diagram-project"></i> ${d.project}</div>` : ""}
    </div>`;
  }).join("");
}

const projReviews = document.getElementById("firebase-project-reviews");
if (projReviews) listen("project_reviews", data => renderReviews("firebase-project-reviews", data));

const svcReviews = document.getElementById("firebase-service-reviews");
if (svcReviews) listen("service_reviews", data => renderReviews("firebase-service-reviews", data));

// ── SERVICES (services.html) ──
const svcContainer = document.getElementById("firebase-services");
if (svcContainer) {
  listen("services", data => {
    const items = Object.values(data);
    if (!items.length) return;
    svcContainer.innerHTML = items.map(d => `
      <div class="service-card ${d.featured === 'true' ? 'featured' : ''} reveal visible">
        ${d.featured === 'true' ? '<div class="featured-badge">Most Popular</div>' : ''}
        <div class="svc-icon"><i class="${d.icon || 'fa-solid fa-briefcase'}"></i></div>
        <h4>${d.title || ""}</h4>
        <p>${d.description || ""}</p>
        <ul>${(d.features || "").split(",").map(f => `<li><i class="fa-solid fa-check"></i> ${f.trim()}</li>`).join("")}</ul>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div class="svc-price">${d.price || ""}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <a href="#" class="card-view-btn svc-view-btn"
              data-icon="${d.icon || 'fa-solid fa-briefcase'}"
              data-title="${(d.title||'').replace(/"/g,'&quot;')}"
              data-desc="${(d.description||'').replace(/"/g,'&quot;')}"
              data-meta="${(d.price||'').replace(/"/g,'&quot;')}"
              data-features="${(d.features||'').replace(/"/g,'&quot;')}"
              data-tags="${(d.tags||d.title||'').replace(/"/g,'&quot;')}">
              <i class="fa-solid fa-eye"></i> View
            </a>
            <a href="#" class="card-view-btn svc-get-btn"
              data-service="${(d.title||'').replace(/"/g,'&quot;')}">
              <i class="fa-solid fa-handshake"></i> Get This
            </a>
          </div>
        </div>
      </div>`).join("");

    svcContainer.querySelectorAll(".svc-view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        openCardModal({
          icon: btn.dataset.icon,
          title: btn.dataset.title,
          desc: btn.dataset.desc,
          meta: btn.dataset.meta,
          features: btn.dataset.features,
          tags: btn.dataset.tags,
          type: "service"
        });
      });
    });
    svcContainer.querySelectorAll(".svc-get-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        openServiceInquiry(btn.dataset.service);
      });
    });
  });
}

// ── RESUME (resume.html) ──
const resSummary = document.getElementById("firebase-res-summary");
if (resSummary) {
  listen("resume", d => {
    // PDF buttons
    const pdfView = document.getElementById("firebase-res-pdf-view");
    const pdfDl   = document.getElementById("firebase-res-pdf-download");
    if (pdfView && d.pdfView)     { pdfView.href = d.pdfView; }
    if (pdfDl   && d.pdfDownload) { pdfDl.href   = d.pdfDownload; }

    // Basic info
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    const setHTML = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerHTML  = val; };
    setText("firebase-res-name",     d.name);
    setText("firebase-res-role",     d.role);
    setText("firebase-res-phone",    d.phone);
    setText("firebase-res-email",    d.email);
    setText("firebase-res-location", d.location);
    if (d.linkedin) {
      const lnEl = document.getElementById("firebase-res-linkedin");
      if (lnEl) { lnEl.href = d.linkedin; lnEl.textContent = d.linkedin.replace("https://",""); }
    }
    if (d.github) {
      const ghEl = document.getElementById("firebase-res-github");
      if (ghEl) { ghEl.href = d.github; ghEl.textContent = d.github.replace("https://",""); }
    }

    // Summary
    if (resSummary && d.summary) resSummary.textContent = d.summary;

    // Skills
    const skillsEl = document.getElementById("firebase-res-skills");
    if (skillsEl && d.skills) {
      skillsEl.innerHTML = d.skills.split("\n").filter(Boolean).map(line => {
        const [cat, ...rest] = line.split("|");
        return `<div class="res-skill-row"><strong>${cat.trim()}</strong><span>${(rest.join("|")).trim()}</span></div>`;
      }).join("");
    }

    // Experience
    const expEl = document.getElementById("firebase-res-experience");
    if (expEl && d.experience) {
      expEl.innerHTML = d.experience.split("\n").filter(Boolean).map(line => {
        const [role, company, date, desc, tags] = line.split("|").map(s => s.trim());
        return `<div class="res-exp-item">
          <div class="res-exp-header">
            <div><strong>${role||""}</strong>${company ? " — " + company : ""}</div>
            ${date ? `<span class="res-date">${date}</span>` : ""}
          </div>
          ${desc ? `<ul class="res-bullets"><li>${desc}</li></ul>` : ""}
          ${tags ? `<div class="res-tl-tags" style="margin-top:8px;">${tags.split(",").map(t=>`<span>${t.trim()}</span>`).join("")}</div>` : ""}
        </div>`;
      }).join("");
    }

    // Education
    const eduEl = document.getElementById("firebase-res-education");
    if (eduEl && d.education) {
      eduEl.innerHTML = d.education.split("\n").filter(Boolean).map(line => {
        const [deg, inst, yr] = line.split("|").map(s => s.trim());
        return `<div class="res-edu-item">
          <div class="res-edu-degree">${deg||""}</div>
          <div class="res-edu-inst">${inst||""}</div>
          ${yr ? `<span class="res-date">${yr}</span>` : ""}
        </div>`;
      }).join("");
    }

    // Projects
    const projEl = document.getElementById("firebase-res-projects");
    if (projEl && d.projects) {
      projEl.innerHTML = d.projects.split("\n").filter(Boolean).map(line => {
        const [title, tag, bullets] = line.split("|").map(s => s.trim());
        const bulletList = (bullets||"").split(";").filter(Boolean)
          .map(b => `<li>${b.trim()}</li>`).join("");
        return `<div class="res-project">
          <div class="res-project-title">${title||""} ${tag ? `<span class="res-tag">${tag}</span>` : ""}</div>
          ${bulletList ? `<ul class="res-bullets">${bulletList}</ul>` : ""}
        </div>`;
      }).join("");
    }

    // Certifications
    const certEl = document.getElementById("firebase-res-certifications");
    if (certEl && d.certifications) {
      certEl.innerHTML = d.certifications.split("\n").filter(Boolean)
        .map(c => `<li><i class="fa-solid fa-check-circle"></i> ${c.trim()}</li>`).join("");
    }

    // Soft Skills
    const ssEl = document.getElementById("firebase-res-softskills");
    if (ssEl && d.softskills) {
      const icons = { "Problem Solving":"fa-lightbulb", "Team Collaboration":"fa-users", "Communication":"fa-comments", "Adaptability":"fa-arrows-rotate" };
      ssEl.innerHTML = d.softskills.split(",").filter(Boolean).map(s => {
        const sk = s.trim();
        const ic = icons[sk] || "fa-star";
        return `<span><i class="fa-solid ${ic}"></i> ${sk}</span>`;
      }).join("");
    }

    // Languages
    const langEl = document.getElementById("firebase-res-languages");
    if (langEl && d.languages) {
      langEl.innerHTML = d.languages.split("\n").filter(Boolean).map(line => {
        const [lang, level, pct] = line.split("|").map(s => s.trim());
        return `<li>
          <div class="lang-info"><span>${lang||""}</span><span class="lang-level">${level||""}</span></div>
          <div class="skill-bar"><div class="skill-fill" data-width="${pct||80}"></div></div>
        </li>`;
      }).join("");
      // trigger skill bar animation
      langEl.querySelectorAll(".skill-fill").forEach(el => {
        el.style.width = (el.dataset.width || 80) + "%";
      });
    }
  });
}

// ── HELPERS ──
function categoryIcon(cat) {
  const map = { coding: "fa-solid fa-code", learning: "fa-solid fa-book-open", android: "fa-brands fa-android", internship: "fa-solid fa-briefcase", design: "fa-solid fa-palette" };
  return map[cat] || "fa-solid fa-bolt";
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
