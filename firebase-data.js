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
const projTabsEl = document.getElementById("proj-tabs");
if (projTabsEl) {
  // track which categories have data
  const projState = { personal: null, client: null, college: null };

  const TAB_META = {
    personal: { label: "Personal",  icon: "fa-solid fa-user" },
    client:   { label: "Client",    icon: "fa-solid fa-briefcase" },
    college:  { label: "College",   icon: "fa-solid fa-graduation-cap" }
  };

  function rebuildTabs() {
    const available = Object.keys(projState).filter(k => projState[k] && projState[k].length > 0);
    projTabsEl.innerHTML = available.map((k, i) =>
      `<button class="act-tab${i === 0 ? ' active' : ''}" data-proj-tab="${k}">
        <i class="${TAB_META[k].icon}"></i> ${TAB_META[k].label} Projects
      </button>`
    ).join("");

    // hide all panels, show first available
    ["personal","client","college"].forEach(k => {
      const p = document.getElementById("tab-" + k);
      if (p) p.classList.remove("active");
    });
    if (available.length > 0) {
      const first = document.getElementById("tab-" + available[0]);
      if (first) first.classList.add("active");
    }

    // attach click handlers
    projTabsEl.querySelectorAll(".act-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        projTabsEl.querySelectorAll(".act-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ["personal","client","college"].forEach(k => {
          const p = document.getElementById("tab-" + k);
          if (p) p.classList.remove("active");
        });
        const target = document.getElementById("tab-" + btn.dataset.projTab);
        if (target) target.classList.add("active");
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
            </div>
            <h4>${d.title || ""}</h4>
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
  document.getElementById("projModalTags").innerHTML = (d.tags || "").split(",")
    .map(t => `<span>${t.trim()}</span>`).join("");

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
window.openCardModal = ({ icon, title, desc, meta }) => {
  const overlay = document.getElementById("cardModalOverlay");
  if (!overlay) return;
  document.getElementById("cardModalIcon").className = icon || "fa-solid fa-bolt";
  document.getElementById("cardModalTitle").textContent = title || "";
  document.getElementById("cardModalDesc").textContent = desc || "";
  document.getElementById("cardModalMeta").innerHTML = meta
    ? `<span style="font-size:0.78rem;color:var(--primary);font-weight:600;background:rgba(102,126,234,0.1);padding:3px 12px;border-radius:50px;display:inline-block;margin-bottom:12px;">${meta}</span>`
    : "";
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
              data-meta="${(d.price||'').replace(/"/g,'&quot;')}">
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
        openCardModal({ icon: btn.dataset.icon, title: btn.dataset.title, desc: btn.dataset.desc, meta: btn.dataset.meta });
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
const resPdfView = document.getElementById("firebase-res-pdf-view");
const resPdfDownload = document.getElementById("firebase-res-pdf-download");
if (resSummary || resPdfView) {
  listen("resume", data => {
    if (resSummary && data.summary) resSummary.textContent = data.summary;
    if (resPdfView && data.pdfView) { resPdfView.href = data.pdfView; resPdfView.classList.remove("hidden"); }
    if (resPdfDownload && data.pdfDownload) { resPdfDownload.href = data.pdfDownload; resPdfDownload.classList.remove("hidden"); }
  });
}

// ── HELPERS ──
function categoryIcon(cat) {
  const map = { coding: "fa-solid fa-code", learning: "fa-solid fa-book-open", android: "fa-brands fa-android", internship: "fa-solid fa-briefcase", design: "fa-solid fa-palette" };
  return map[cat] || "fa-solid fa-bolt";
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
