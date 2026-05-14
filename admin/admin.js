import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, set, remove, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFVZuJJibflJK7qsR_rv-paJEbQwxnGuI",
  authDomain: "hariom-kumar-76893.firebaseapp.com",
  databaseURL: "https://hariom-kumar-76893-default-rtdb.firebaseio.com",
  projectId: "hariom-kumar-76893",
  storageBucket: "hariom-kumar-76893.firebasestorage.app",
  messagingSenderId: "510509967640",
  appId: "1:510509967640:web:2b94aa6496003efe7b966d",
  measurementId: "G-1QP4ZQC4CF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ── STATE ──
let currentSection = "dashboard";
let editingKey = null;
let editingSection = null;

// ── AUTH ──
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("adminApp").classList.remove("hidden");
    document.getElementById("adminEmail").textContent = user.email;
    loadAll();
  } else {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("adminApp").classList.add("hidden");
  }
});

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass  = document.getElementById("loginPassword").value;
  const errEl = document.getElementById("loginError");
  errEl.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    errEl.textContent = "Invalid email or password.";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));

// ── SIDEBAR TOGGLE (mobile) ──
function openSidebar()  { document.getElementById("sidebar").classList.add("open"); document.getElementById("sidebarOverlay").classList.add("active"); }
function closeSidebar() { document.getElementById("sidebar").classList.remove("open"); document.getElementById("sidebarOverlay").classList.remove("active"); }
window.closeSidebar = closeSidebar;

document.getElementById("sidebarToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.contains("open") ? closeSidebar() : openSidebar();
});
document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);

// ── NAVIGATION ──
document.querySelectorAll(".sn-item").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    switchSection(el.dataset.section);
    closeSidebar();
  });
});

function switchSection(name) {
  const titles = {
    dashboard: "Dashboard",
    experience: "Experience",
    personal_projects: "Personal Projects",
    client_projects: "Client Projects",
    college_projects: "College Projects",
    activities: "Activities",
    dailylog: "Daily Log",
    services: "Services",
    certifications: "Certifications",
    project_reviews: "Project Reviews",
    service_reviews: "Service Reviews",
  github_stats: "GitHub Stats",
    resume: "Resume"
  };
  document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".sn-item").forEach(s => s.classList.remove("active"));
  document.getElementById("sec-" + name).classList.add("active");
  document.querySelector('.sn-item[data-section="' + name + '"]').classList.add("active");
  document.getElementById("sectionTitle").textContent = titles[name] || name;
  currentSection = name;
}
window.switchSection = switchSection;

// ── LOAD ALL ──
function loadAll() {
  listenList("experience");
  listenList("personal_projects");
  listenList("client_projects");
  listenList("college_projects");
  listenList("activities");
  listenList("dailylog");
  listenList("services");
  listenList("certifications");
  listenList("project_reviews");
  listenList("service_reviews");
  loadGitHubStats();
  loadResume();
}

function listenList(section) {
  onValue(ref(db, section), snap => {
    const data = snap.val() || {};
    renderList(section, data);
  });
}

// ── RENDER LIST ──
function renderList(section, data) {
  const container = document.getElementById(section + "-list");
  container.innerHTML = "";
  const keys = Object.keys(data).reverse();
  if (!keys.length) {
    container.innerHTML = '<p style="color:var(--muted);font-size:0.88rem;padding:12px 0;">No items yet. Click + Add to create one.</p>';
    return;
  }
  keys.forEach(key => {
    const item = data[key];
    const card = document.createElement("div");
    card.className = "item-card";
    const heading = section === "dailylog"
      ? (item.date || (item.day + " " + item.month) || "") + " — " + (item.title || "Untitled")
      : (item.title || item.name || item.role || "Untitled");
    const meta = section === "dailylog"
      ? (item.category || "") + (item.time ? " • " + item.time : "")
      : section === "certifications"
      ? [item.issuer, item.date].filter(Boolean).join(" • ")
      : section === "client_projects"
      ? [item.client, item.tags].filter(Boolean).join(" • ")
      : (item.tags || item.company || item.category || item.time || "");
    card.innerHTML =
      '<div class="item-card-body">' +
        "<h4>" + heading + "</h4>" +
        "<p>" + (item.description || item.summary || item.details || "") + "</p>" +
        '<div class="item-meta">' + meta + "</div>" +
      "</div>" +
      '<div class="item-actions">' +
        '<button class="btn-edit" onclick="openModal(\'' + section + "','" + key + '\')"><i class="fa-solid fa-pen"></i></button>' +
        '<button class="btn-delete" onclick="deleteItem(\'' + section + "','" + key + '\')"><i class="fa-solid fa-trash"></i></button>' +
      "</div>";
    container.appendChild(card);
  });
}

// ── DELETE ──
window.deleteItem = async (section, key) => {
  if (!confirm("Delete this item?")) return;
  await remove(ref(db, section + "/" + key));
  showToast("Deleted successfully", "success");
};

// ── ICON & GRADIENT DATA ──
const ICONS = [
  "fa-solid fa-code","fa-solid fa-mobile-screen-button","fa-brands fa-android","fa-solid fa-globe",
  "fa-solid fa-database","fa-solid fa-cloud","fa-solid fa-server","fa-solid fa-shield-halved",
  "fa-solid fa-utensils","fa-solid fa-cart-shopping","fa-solid fa-store","fa-solid fa-bag-shopping",
  "fa-solid fa-graduation-cap","fa-solid fa-book-open","fa-solid fa-brain","fa-solid fa-lightbulb",
  "fa-solid fa-trophy","fa-solid fa-medal","fa-solid fa-star","fa-solid fa-fire",
  "fa-solid fa-bolt","fa-solid fa-rocket","fa-solid fa-wand-magic-sparkles","fa-solid fa-gem",
  "fa-solid fa-palette","fa-solid fa-pen-nib","fa-solid fa-image","fa-solid fa-film",
  "fa-solid fa-music","fa-solid fa-headphones","fa-solid fa-microphone","fa-solid fa-camera",
  "fa-solid fa-chart-line","fa-solid fa-chart-bar","fa-solid fa-chart-pie","fa-solid fa-coins",
  "fa-solid fa-briefcase","fa-solid fa-handshake","fa-solid fa-users","fa-solid fa-user-tie",
  "fa-solid fa-cloud-sun","fa-solid fa-map-location-dot","fa-solid fa-plane","fa-solid fa-car",
  "fa-brands fa-react","fa-brands fa-node-js","fa-brands fa-python","fa-brands fa-js",
  "fa-brands fa-github","fa-brands fa-figma","fa-brands fa-flutter","fa-brands fa-apple",
  "fa-solid fa-lock","fa-solid fa-key","fa-solid fa-wifi","fa-solid fa-robot"
];

const GRADIENTS = [
  { label:"Purple Blue",  val:"linear-gradient(135deg,#667eea,#764ba2)" },
  { label:"Pink Red",     val:"linear-gradient(135deg,#f093fb,#f5576c)" },
  { label:"Blue Cyan",    val:"linear-gradient(135deg,#4facfe,#00f2fe)" },
  { label:"Green Teal",   val:"linear-gradient(135deg,#43e97b,#38f9d7)" },
  { label:"Orange Pink",  val:"linear-gradient(135deg,#fa709a,#fee140)" },
  { label:"Lavender",     val:"linear-gradient(135deg,#a18cd1,#fbc2eb)" },
  { label:"Sunset",       val:"linear-gradient(135deg,#f7971e,#ffd200)" },
  { label:"Ocean",        val:"linear-gradient(135deg,#2193b0,#6dd5ed)" },
  { label:"Forest",       val:"linear-gradient(135deg,#11998e,#38ef7d)" },
  { label:"Fire",         val:"linear-gradient(135deg,#f12711,#f5af19)" },
  { label:"Night",        val:"linear-gradient(135deg,#0f0c29,#302b63)" },
  { label:"Rose",         val:"linear-gradient(135deg,#ff758c,#ff7eb3)" },
];

function iconPickerHTML(id) {
  id = id || "f-icon";
  return '<div class="form-group">' +
    '<label>Icon — <span style="color:var(--primary);font-size:0.78rem;">Font Awesome class ya Image URL dono chalega</span></label>' +
    '<div class="icon-picker">' + ICONS.map(ic => '<button type="button" class="ip-btn" data-icon="' + ic + '" onclick="selectIcon(\'' + ic + "','" + id + '\')" title="' + ic + '"><i class="' + ic + '"></i></button>').join("") + "</div>" +
    '<input id="' + id + '" placeholder="fa-solid fa-code  ya  https://example.com/logo.png" oninput="syncIconPreview(\'' + id + '\')" style="margin-top:8px;" />' +
    '<div class="icon-preview" id="' + id + '-preview"><i class="fa-solid fa-code"></i> <span>Preview</span></div>' +
    "</div>";
}

function gradientPickerHTML(id) {
  id = id || "f-gradient";
  return '<div class="form-group">' +
    '<label>Gradient — <span style="color:var(--primary);font-size:0.78rem;">Click to select or type manually</span></label>' +
    '<div class="grad-picker">' + GRADIENTS.map(g => '<button type="button" class="gp-btn" style="background:' + g.val + '" onclick="selectGradient(\'' + g.val + "','" + id + '\')" title="' + g.label + '"></button>').join("") + "</div>" +
    '<input id="' + id + '" placeholder="linear-gradient(135deg,#667eea,#764ba2)" oninput="syncGradPreview(\'' + id + '\')" style="margin-top:8px;" />' +
    '<div class="grad-preview" id="' + id + '-preview"></div>' +
    "</div>";
}

window.selectIcon = (ic, id) => {
  document.getElementById(id).value = ic;
  syncIconPreview(id);
  document.querySelectorAll(".ip-btn").forEach(b => b.classList.toggle("selected", b.dataset.icon === ic));
};
window.syncIconPreview = (id) => {
  const val = document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const prev = document.getElementById(id + "-preview");
  if (prev) {
    if (val && (val.startsWith('http') || val.startsWith('/'))) {
      prev.innerHTML = '<img src="' + val + '" alt="" style="width:32px;height:32px;object-fit:contain;border-radius:6px;vertical-align:middle;margin-right:8px;" /> <span>' + val + '</span>';
    } else {
      prev.innerHTML = '<i class="' + (val || 'fa-solid fa-code') + '"></i> <span>' + (val || '') + '</span>';
    }
  }
  document.querySelectorAll(".ip-btn").forEach(b => b.classList.toggle("selected", b.dataset.icon === val));
};
window.selectGradient = (g, id) => {
  document.getElementById(id).value = g;
  syncGradPreview(id);
  document.querySelectorAll(".gp-btn").forEach(b => b.classList.toggle("selected", b.getAttribute("onclick").includes(g)));
};
window.syncGradPreview = (id) => {
  const val = document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const prev = document.getElementById(id + "-preview");
  if (prev) prev.style.background = val || "";
};

// ── MODAL FORMS ──
const forms = {
  experience: () =>
    '<div class="form-group"><label>Role / Title</label><input id="f-role" placeholder="e.g. Web Development Intern" /></div>' +
    '<div class="form-group"><label>Company</label><input id="f-company" placeholder="e.g. Infotact Solutions" /></div>' +
    '<div class="form-group"><label>Date</label><input id="f-date" placeholder="e.g. May 2025 – Jul 2025" /></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="What you did..."></textarea></div>',

  personal_projects: () =>
    '<div class="form-group"><label>Project Title</label><input id="f-title" placeholder="e.g. NotesAura App" /></div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Status</label><select id="f-status"><option value="completed">✅ Completed</option><option value="ongoing">🔄 Ongoing</option><option value="paused">⏸ Paused</option><option value="planned">📋 Planned</option></select></div>' +
      '<div class="form-group"><label>Year</label><input id="f-year" placeholder="e.g. 2024" /></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Platform</label><input id="f-platform" placeholder="e.g. Android, Web, iOS, Cross-platform" /></div>' +
      '<div class="form-group"><label>Duration</label><input id="f-duration" placeholder="e.g. 3 months, 2 weeks" /></div>' +
    '</div>' +
    '<div class="form-group"><label>Tech Stack (comma separated)</label><input id="f-tech_stack" placeholder="e.g. Java, Firebase, XML, Retrofit" oninput="previewTechStack(this)" /></div>' +
    '<div class="tags-preview" id="tech-preview"></div>' +
    '<div class="form-group"><label>Tags (comma separated)</label><input id="f-tags" placeholder="Android, Java, Firebase" oninput="previewTags(this)" /></div>' +
    '<div class="tags-preview" id="tags-preview"></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="Short description..."></textarea></div>' +
    '<div class="form-group"><label>Features (one per line)</label><textarea id="f-features" rows="4" placeholder="Feature 1&#10;Feature 2"></textarea></div>' +
    '<div class="form-group"><label>GitHub Link</label><input id="f-github" placeholder="https://github.com/..." /></div>' +
    '<div class="form-group"><label>Live Link</label><input id="f-live" placeholder="https://..." /></div>' +
    iconPickerHTML("f-icon") +
    gradientPickerHTML("f-gradient"),

  client_projects: () =>
    '<div class="form-group"><label>Project Title</label><input id="f-title" placeholder="e.g. Client E-commerce Site" /></div>' +
    '<div class="form-group"><label>Client Name (optional)</label><input id="f-client" placeholder="e.g. ABC Company" /></div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Status</label><select id="f-status"><option value="completed">✅ Completed</option><option value="ongoing">🔄 Ongoing</option><option value="paused">⏸ Paused</option><option value="planned">📋 Planned</option></select></div>' +
      '<div class="form-group"><label>Year</label><input id="f-year" placeholder="e.g. 2025" /></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Platform</label><input id="f-platform" placeholder="e.g. Web, Android, Desktop" /></div>' +
      '<div class="form-group"><label>Duration</label><input id="f-duration" placeholder="e.g. 1 month" /></div>' +
    '</div>' +
    '<div class="form-group"><label>Tech Stack (comma separated)</label><input id="f-tech_stack" placeholder="e.g. React, Node.js, MongoDB" oninput="previewTechStack(this)" /></div>' +
    '<div class="tags-preview" id="tech-preview"></div>' +
    '<div class="form-group"><label>Tags (comma separated)</label><input id="f-tags" placeholder="React, Node.js, MongoDB" oninput="previewTags(this)" /></div>' +
    '<div class="tags-preview" id="tags-preview"></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="Short description..."></textarea></div>' +
    '<div class="form-group"><label>Features (one per line)</label><textarea id="f-features" rows="4" placeholder="Feature 1&#10;Feature 2"></textarea></div>' +
    '<div class="form-group"><label>GitHub Link</label><input id="f-github" placeholder="https://github.com/..." /></div>' +
    '<div class="form-group"><label>Live Link</label><input id="f-live" placeholder="https://..." /></div>' +
    iconPickerHTML("f-icon") +
    gradientPickerHTML("f-gradient"),

  college_projects: () =>
    '<div class="form-group"><label>Project Title</label><input id="f-title" placeholder="e.g. Library Management System" /></div>' +
    '<div class="form-group"><label>Course / Subject (optional)</label><input id="f-course" placeholder="e.g. DBMS, Final Year Project" /></div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Status</label><select id="f-status"><option value="completed">✅ Completed</option><option value="ongoing">🔄 Ongoing</option><option value="paused">⏸ Paused</option><option value="planned">📋 Planned</option></select></div>' +
      '<div class="form-group"><label>Year</label><input id="f-year" placeholder="e.g. 2024" /></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label>Platform</label><input id="f-platform" placeholder="e.g. Web, Android, Desktop" /></div>' +
      '<div class="form-group"><label>Duration</label><input id="f-duration" placeholder="e.g. 2 months" /></div>' +
    '</div>' +
    '<div class="form-group"><label>Tech Stack (comma separated)</label><input id="f-tech_stack" placeholder="e.g. Java, MySQL, PHP" oninput="previewTechStack(this)" /></div>' +
    '<div class="tags-preview" id="tech-preview"></div>' +
    '<div class="form-group"><label>Tags (comma separated)</label><input id="f-tags" placeholder="Java, MySQL, PHP" oninput="previewTags(this)" /></div>' +
    '<div class="tags-preview" id="tags-preview"></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="Short description..."></textarea></div>' +
    '<div class="form-group"><label>Features (one per line)</label><textarea id="f-features" rows="4" placeholder="Feature 1&#10;Feature 2"></textarea></div>' +
    '<div class="form-group"><label>GitHub Link</label><input id="f-github" placeholder="https://github.com/..." /></div>' +
    '<div class="form-group"><label>Live Link</label><input id="f-live" placeholder="https://..." /></div>' +
    iconPickerHTML("f-icon") +
    gradientPickerHTML("f-gradient"),

  activities: () =>
    '<div class="form-group"><label>Title</label><input id="f-title" placeholder="e.g. Hackathons" /></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="Activity description..."></textarea></div>' +
    '<div class="form-group"><label>Category Tag</label><input id="f-category" placeholder="e.g. Competitive" /></div>' +
    iconPickerHTML("f-icon"),

  dailylog: () =>
    '<div class="form-group"><label>Date (Day)</label><input id="f-day" placeholder="e.g. 18" /></div>' +
    '<div class="form-group"><label>Month &amp; Year</label><input id="f-month" placeholder="e.g. Jul 2025" /></div>' +
    '<div class="form-group"><label>Entry Title</label><input id="f-title" placeholder="What did you do?" /></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="Details..."></textarea></div>' +
    '<div class="form-group"><label>Category</label>' +
    '<select id="f-category"><option value="coding">Coding</option><option value="learning">Learning</option><option value="android">Android</option><option value="internship">Internship</option><option value="design">Design</option></select></div>' +
    '<div class="form-group"><label>Time</label><input id="f-time" placeholder="e.g. 10:00 AM" /></div>',

  certifications: () =>
    '<div class="form-group"><label>Certificate Title</label><input id="f-title" placeholder="e.g. Android Mobile Application Development" /></div>' +
    '<div class="form-group"><label>Issued By (Organization / Platform)</label><input id="f-issuer" placeholder="e.g. SWAYAM (MHRD), HCL GUVI, Coursera" /></div>' +
    '<div class="form-group"><label>Date / Year</label><input id="f-date" placeholder="e.g. Jun 2024" /></div>' +
    '<div class="form-group"><label>Description (optional)</label><textarea id="f-description" rows="3" placeholder="What you learned or achieved..."></textarea></div>' +
    '<div class="form-group"><label>Certificate Link (optional)</label><input id="f-link" placeholder="https://certificate-link..." /></div>',

  services: () =>
    '<div class="form-group"><label>Service Title</label><input id="f-title" placeholder="e.g. Android Development" /></div>' +
    '<div class="form-group"><label>Description</label><textarea id="f-description" rows="3" placeholder="What this service includes..."></textarea></div>' +
    '<div class="form-group"><label>Features (comma separated)</label><input id="f-features" placeholder="Java &amp; XML, Firebase, Offline Support" /></div>' +
    '<div class="form-group"><label>Price</label><input id="f-price" placeholder="e.g. Starting at ₹5,000" /></div>' +
    iconPickerHTML("f-icon") +
    '<div class="form-group"><label>Featured?</label><select id="f-featured"><option value="false">No</option><option value="true">Yes (Most Popular)</option></select></div>',

  project_reviews: () =>
    '<div class="form-group"><label>Reviewer Name</label><input id="f-name" placeholder="e.g. Rahul Sharma" /></div>' +
    '<div class="form-group"><label>Role / Designation</label><input id="f-role" placeholder="e.g. Client, Student, Colleague" /></div>' +
    '<div class="form-group"><label>Rating (1–5)</label><select id="f-rating"><option value="5">⭐⭐⭐⭐⭐ 5 Stars</option><option value="4">⭐⭐⭐⭐ 4 Stars</option><option value="3">⭐⭐⭐ 3 Stars</option><option value="2">⭐⭐ 2 Stars</option><option value="1">⭐ 1 Star</option></select></div>' +
    '<div class="form-group"><label>Review</label><textarea id="f-review" rows="3" placeholder="What they said about the project..."></textarea></div>' +
    '<div class="form-group"><label>Project Name (optional)</label><input id="f-project" placeholder="e.g. NotesAura App" /></div>',

  service_reviews: () =>
    '<div class="form-group"><label>Reviewer Name</label><input id="f-name" placeholder="e.g. Priya Singh" /></div>' +
    '<div class="form-group"><label>Role / Designation</label><input id="f-role" placeholder="e.g. Client, Business Owner" /></div>' +
    '<div class="form-group"><label>Rating (1–5)</label><select id="f-rating"><option value="5">⭐⭐⭐⭐⭐ 5 Stars</option><option value="4">⭐⭐⭐⭐ 4 Stars</option><option value="3">⭐⭐⭐ 3 Stars</option><option value="2">⭐⭐ 2 Stars</option><option value="1">⭐ 1 Star</option></select></div>' +
    '<div class="form-group"><label>Review</label><textarea id="f-review" rows="3" placeholder="What they said about the service..."></textarea></div>' +
    '<div class="form-group"><label>Service Name (optional)</label><input id="f-project" placeholder="e.g. Android Development" /></div>'
};

window.openModal = (section, key) => {
  key = key || null;
  editingKey = key;
  editingSection = section;
  document.getElementById("modal-title").textContent = key ? "Edit Item" : "Add Item";
  document.getElementById("modal-body").innerHTML = (forms[section] ? forms[section]() : "") +
    '<div class="modal-footer">' +
      '<button class="btn-cancel" onclick="closeModal()">Cancel</button>' +
      '<button class="btn-save" onclick="saveItem()"><i class="fa-solid fa-floppy-disk"></i> Save</button>' +
    "</div>";

  if (key) {
    const dbRef = ref(db, section + "/" + key);
    onValue(dbRef, snap => {
      const d = snap.val();
      if (!d) return;
      const fill = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
      fill("f-role", d.role); fill("f-company", d.company); fill("f-date", d.date);
      fill("f-title", d.title); fill("f-tags", d.tags); fill("f-description", d.description);
      fill("f-features", d.features); fill("f-github", d.github); fill("f-live", d.live);
      fill("f-icon", d.icon); fill("f-gradient", d.gradient); fill("f-category", d.category);
      fill("f-time", d.time); fill("f-day", d.day); fill("f-month", d.month);
      fill("f-price", d.price); fill("f-featured", d.featured); fill("f-link", d.link);
      fill("f-issuer", d.issuer); fill("f-client", d.client); fill("f-course", d.course);
      fill("f-name", d.name); fill("f-review", d.review); fill("f-rating", d.rating); fill("f-project", d.project);
      fill("f-status", d.status); fill("f-year", d.year); fill("f-platform", d.platform);
      fill("f-duration", d.duration); fill("f-tech_stack", d.tech_stack);
      if (d.tags) previewTags({ value: d.tags });
      if (d.tech_stack) previewTechStack({ value: d.tech_stack });
      if (d.icon)     { syncIconPreview("f-icon"); }
      if (d.gradient) { syncGradPreview("f-gradient"); }
    }, { onlyOnce: true });
  }

  document.getElementById("modal").classList.remove("hidden");
};

window.closeModal = () => {
  document.getElementById("modal").classList.add("hidden");
  editingKey = null; editingSection = null;
};

window.previewTags = (input) => {
  const preview = document.getElementById("tags-preview");
  if (!preview) return;
  preview.innerHTML = input.value.split(",").map(t => t.trim()).filter(Boolean)
    .map(t => "<span>" + t + "</span>").join("");
};

window.previewTechStack = (input) => {
  const preview = document.getElementById("tech-preview");
  if (!preview) return;
  preview.innerHTML = input.value.split(",").map(t => t.trim()).filter(Boolean)
    .map(t => "<span style='background:rgba(67,233,123,0.12);color:#43e97b;'>" + t + "</span>").join("");
};

// ── SAVE ITEM ──
window.saveItem = async () => {
  const s = editingSection;
  const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };

  let data = {};
  if (s === "experience")        data = { role: val("f-role"), company: val("f-company"), date: val("f-date"), description: val("f-description") };
  if (s === "personal_projects") data = { title: val("f-title"), tags: val("f-tags"), description: val("f-description"), features: val("f-features"), github: val("f-github"), live: val("f-live"), icon: val("f-icon"), gradient: val("f-gradient"), status: val("f-status"), year: val("f-year"), platform: val("f-platform"), duration: val("f-duration"), tech_stack: val("f-tech_stack") };
  if (s === "client_projects")   data = { title: val("f-title"), client: val("f-client"), tags: val("f-tags"), description: val("f-description"), features: val("f-features"), github: val("f-github"), live: val("f-live"), icon: val("f-icon"), gradient: val("f-gradient"), status: val("f-status"), year: val("f-year"), platform: val("f-platform"), duration: val("f-duration"), tech_stack: val("f-tech_stack") };
  if (s === "college_projects")  data = { title: val("f-title"), course: val("f-course"), tags: val("f-tags"), description: val("f-description"), features: val("f-features"), github: val("f-github"), live: val("f-live"), icon: val("f-icon"), gradient: val("f-gradient"), status: val("f-status"), year: val("f-year"), platform: val("f-platform"), duration: val("f-duration"), tech_stack: val("f-tech_stack") };
  if (s === "activities")        data = { title: val("f-title"), description: val("f-description"), category: val("f-category"), icon: val("f-icon") };
  if (s === "dailylog")          data = { day: val("f-day"), month: val("f-month"), title: val("f-title"), description: val("f-description"), category: val("f-category"), time: val("f-time"), date: val("f-day") + " " + val("f-month") };
  if (s === "certifications")    data = { title: val("f-title"), issuer: val("f-issuer"), date: val("f-date"), description: val("f-description"), link: val("f-link") };
  if (s === "services")          data = { title: val("f-title"), description: val("f-description"), features: val("f-features"), price: val("f-price"), icon: val("f-icon"), featured: val("f-featured") };
  if (s === "project_reviews")   data = { name: val("f-name"), role: val("f-role"), rating: val("f-rating"), review: val("f-review"), project: val("f-project") };
  if (s === "service_reviews")   data = { name: val("f-name"), role: val("f-role"), rating: val("f-rating"), review: val("f-review"), project: val("f-project") };

  data.updatedAt = Date.now();

  try {
    if (editingKey) {
      await update(ref(db, s + "/" + editingKey), data);
    } else {
      await push(ref(db, s), data);
    }
    closeModal();
    showToast("Saved successfully ✓", "success");
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
};

// ── GITHUB STATS ──
function loadGitHubStats() {
  onValue(ref(db, "github_stats"), snap => {
    const d = snap.val() || {};
    const s = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
    s("gh-repos",          d.repos);
    s("gh-followers",      d.followers);
    s("gh-contrib-current",d.contrib_current);
    s("gh-year-current",   d.year_current);
    s("gh-contrib-prev",   d.contrib_prev);
    s("gh-year-prev",      d.year_prev);
    s("gh-orcid",          d.orcid);
    s("gh-achievement",    d.achievement);
    s("gh-languages",      d.languages);
  });
}

window.saveGitHubStats = async () => {
  const v = id => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const data = {
    repos:           v("gh-repos"),
    followers:       v("gh-followers"),
    contrib_current: v("gh-contrib-current"),
    year_current:    v("gh-year-current"),
    contrib_prev:    v("gh-contrib-prev"),
    year_prev:       v("gh-year-prev"),
    orcid:           v("gh-orcid"),
    achievement:     v("gh-achievement"),
    languages:       v("gh-languages"),
    updatedAt: Date.now()
  };
  try {
    await set(ref(db, "github_stats"), data);
    showToast("GitHub Stats saved ✓", "success");
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
};

// ── RESUME ──
function loadResume() {
  onValue(ref(db, "resume"), snap => {
    const d = snap.val() || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
    setVal("res-summary", d.summary);
    setVal("res-pdf-view", d.pdfView);
    setVal("res-pdf-download", d.pdfDownload);
    setVal("res-name", d.name);
    setVal("res-role", d.role);
    setVal("res-phone", d.phone);
    setVal("res-email", d.email);
    setVal("res-location", d.location);
    setVal("res-linkedin", d.linkedin);
    setVal("res-github", d.github);
    setVal("res-skills", d.skills);
    setVal("res-experience", d.experience);
    setVal("res-education", d.education);
    setVal("res-projects", d.projects);
    setVal("res-certifications", d.certifications);
    setVal("res-softskills", d.softskills);
    setVal("res-languages", d.languages);
  });
}

window.saveResume = async () => {
  const val = id => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const data = {
    summary: val("res-summary"),
    pdfView: val("res-pdf-view"),
    pdfDownload: val("res-pdf-download"),
    name: val("res-name"),
    role: val("res-role"),
    phone: val("res-phone"),
    email: val("res-email"),
    location: val("res-location"),
    linkedin: val("res-linkedin"),
    github: val("res-github"),
    skills: val("res-skills"),
    experience: val("res-experience"),
    education: val("res-education"),
    projects: val("res-projects"),
    certifications: val("res-certifications"),
    softskills: val("res-softskills"),
    languages: val("res-languages"),
    updatedAt: Date.now()
  };
  try {
    await set(ref(db, "resume"), data);
    showToast("Resume saved ✓", "success");
  } catch (err) {
    showToast("Error: " + err.message, "error");
  }
};

// ── TOAST ──
function showToast(msg, type) {
  type = type || "success";
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + type;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 3000);
}