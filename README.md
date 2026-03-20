<div align="center">

# ✨ Hariom Kumar — Personal Portfolio Website

[![Live Portfolio](https://img.shields.io/badge/🌐_Live_Portfolio-Visit_Now-667eea?style=for-the-badge&logoColor=white)](https://hariomsonihs.github.io)
[![NotesAura App](https://img.shields.io/badge/📱_NotesAura-Google_Play-34a853?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.hariomsonihs.notesaura)
[![GitHub](https://img.shields.io/badge/GitHub-hariomsonihs-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hariomsonihs)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-hariomsonihs-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/hariomsonihs)

<br/>

> **⚡ Building Ideas Into Reality** — A fully dynamic, Firebase-powered personal portfolio built with pure HTML, CSS & JavaScript. No frameworks. No build tools. Just clean, fast, and beautiful.

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Poppins-4285F4?style=flat-square&logo=google&logoColor=white)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [📄 Pages](#-pages)
- [🎨 Design & UI](#-design--ui)
- [⚙️ Features](#️-features)
- [🗂️ Project Categories](#️-project-categories)
- [🛠️ Services Offered](#️-services-offered)
- [📱 NotesAura App Section](#-notesaura-app-section)
- [🔧 Admin Panel](#-admin-panel)
- [📁 File Structure](#-file-structure)
- [🔗 Links & Contact](#-links--contact)

---

## 🎯 Overview

This is a **fully dynamic personal portfolio** for **Hariom Kumar**, a Computer Science & Engineering undergraduate from Centurion University. The entire content — projects, services, certifications, experience, activities — is managed live through a custom **Admin Panel** connected to **Firebase Realtime Database**. No page reload needed to update content.

| 👤 Name | Hariom Kumar |
|---|---|
| 🎓 Degree | B.Tech CSE — Centurion University (2023–2027) |
| 📍 Location | West Champaran, Bihar, India |
| 📞 Phone | +91 76671 10195 |
| 💼 Role | Android & Web Developer |
| 🏫 Teaching | 100+ Students Taught |

---

## 📄 Pages

| Page | File | Description |
|---|---|---|
| 🏠 **Home** | `index.html` | Hero, About, Skills, Experience, Tech Stack, Certifications, Projects Preview, NotesAura App |
| ⚡ **Activities** | `activities.html` | Daily Log tab + Activities tab — both loaded from Firebase |
| 💻 **Projects** | `projects.html` | Dynamic 3-tab system: Personal / Client / College projects |
| 🛠️ **Services** | `services.html` | Service cards with View + Get This buttons, Contact form |
| 📄 **Resume** | `resume.html` | Resume viewer / download |
| 🔧 **Admin Panel** | `web-admin/index.html` | Full content management dashboard |

---

## 🎨 Design & UI

### 🌈 Color Palette

| Role | Color | Preview |
|---|---|---|
| Primary Gradient | `#667eea → #764ba2` | ![](https://img.shields.io/badge/-%23667eea_→_%23764ba2-667eea?style=flat-square) |
| Accent Green | `#43e97b → #38f9d7` | ![](https://img.shields.io/badge/-%2343e97b_→_%2338f9d7-43e97b?style=flat-square) |
| Background | `#0f0f1a` | ![](https://img.shields.io/badge/-%230f0f1a-0f0f1a?style=flat-square) |
| Card Background | `#1a1a2e` | ![](https://img.shields.io/badge/-%231a1a2e-1a1a2e?style=flat-square) |
| Text | `#e2e8f0` | ![](https://img.shields.io/badge/-%23e2e8f0-e2e8f0?style=flat-square) |

### 🖋️ Typography
- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins) — weights 300, 400, 500, 600, 700, 800
- **Icons**: [Font Awesome 6.5](https://fontawesome.com/) — Solid, Brands

### 📐 Layout Highlights
- **Dark theme** throughout — deep navy/purple tones
- **Glassmorphism** cards with subtle borders and backdrop blur
- **Gradient text** on headings using CSS `background-clip: text`
- **Floating badges** on hero image (Java, Android, React)
- **Smooth reveal animations** on scroll using Intersection Observer
- **Typewriter effect** on hero subtitle
- **Shimmer skeleton loaders** while Firebase data loads
- **Fully responsive** — works on mobile, tablet, and desktop

---

## ⚙️ Features

### 🏠 Home Page
- **Hero Section** — Profile photo with glowing ring, floating tech badges, typewriter animation, stats (2+ Years, 10+ Projects, 100+ Students)
- **About Section** — Bio, location/email/phone info grid, education timeline (B.Tech, Intermediate, Matriculation, ADCA)
- **Skills** — Animated progress bars: Java/Android (85%), HTML/CSS (90%), JS/React (80%), Firebase/SQL (78%), Flutter (65%)
- **Work Experience** — Timeline cards loaded from Firebase (Infotact Solutions, CodeAlpha, Elite Computer Classes)
- **Tech Stack** — Chip grid: Java, Android, Flutter, HTML5, CSS3, JavaScript, React, Node.js, Firebase, Git
- **Certifications** — Loaded from Firebase with View modal (full description popup) and external Link button
- **Soft Skills** — Problem Solving, Team Collaboration, Communication, Adaptability
- **Languages** — English (Professional), Hindi (Native), Bhojpuri (Native) with progress bars
- **Projects Preview** — Shows latest projects from Firebase with "View All" link

### 💻 Projects Page
- **3-Tab System** — Personal Projects / Client Projects / College Projects
- Tabs are **dynamic** — only visible tabs are shown (if a category has no data, its tab is hidden)
- **Skeleton shimmer animation** while data loads
- Each project card shows: icon/image, title, tags, description snippet
- **Project Detail Modal** — Full description, key features list, tags, GitHub/Live links
- **Smart Icon System** — Font Awesome class OR image URL both work as project icon; image URLs render as full cover with `object-fit: contain` (no cropping)

### ⚡ Activities Page
- **Daily Log Tab** — Chronological day-by-day activity log from Firebase
- **Activities Tab** — Activity cards with icon, title, description loaded from Firebase
- **Card Detail Modal** — Click any card to see full details

### 🛠️ Services Page
- **6 Service Cards** (static + Firebase dynamic):
  - 📱 Android Development — Starting ₹5,000
  - 💻 Full Stack Web Development — Starting ₹10,000 *(Most Popular)*
  - 📲 Flutter App Development — Starting ₹8,000
  - 🎨 Responsive Web Design — Starting ₹3,000
  - 🗄️ Firebase & Backend Setup — Starting ₹4,000
  - 🧑‍🏫 Programming Tutoring — Starting ₹500/hr
- Each card has:
  - 👁️ **View button** — Opens detail modal
  - 🤝 **Get This button** (green) — Opens inquiry modal pre-filled with service name
- **Service Inquiry Modal** — Name, Email, Phone, Requirements → sends directly to **WhatsApp** (`+91 76671 10195`)
- **Contact Section** — Email, Phone, Location, Social links + WhatsApp contact form

### 📱 Mobile Experience
- **Bottom Navigation Bar** — Home, Activities, Projects, Services, Resume
- **Slide-in Drawer** — Profile photo, nav links, social icons, Hire Me button
- **NotesAura App link** in drawer with Google Play icon (green, with divider separator)
- **Hamburger menu** button in navbar

### 🔔 Modals System
- **Project Detail Modal** — Banner with icon/image, tags, title, description, features, links
- **Card Modal** — Used for certifications and activity cards
- **Service Inquiry Modal** — Pre-filled service name, WhatsApp submit
- All modals close on overlay click or ✕ button

---

## 🗂️ Project Categories

| Category | Firebase Path | Extra Field |
|---|---|---|
| 👨‍💻 Personal Projects | `personal_projects` | — |
| 🤝 Client Projects | `client_projects` | Client Name |
| 🎓 College Projects | `college_projects` | Course / Subject |

**Project Card Fields:** Title, Description, Icon (FA class or Image URL), Gradient, Tags, Features, GitHub Link, Live Link, Category

**Icon Behavior:**
- Font Awesome class (e.g. `fa-brands fa-android`) → renders `<i>` icon with gradient background
- Image URL (e.g. `https://...`) → renders `<img>` with `object-fit: contain`, centered, dark background (no gradient overlay)

---

## 🛠️ Services Offered

| Service | Price |
|---|---|
| 📱 Android Development | From ₹5,000 |
| 💻 Full Stack Web Development | From ₹10,000 |
| 📲 Flutter App Development | From ₹8,000 |
| 🎨 Responsive Web Design | From ₹3,000 |
| 🗄️ Firebase & Backend Setup | From ₹4,000 |
| 🧑‍🏫 Programming Tutoring | ₹500/hr |

---

## 📱 NotesAura App Section

A dedicated section on the home page showcasing the **NotesAura** Android app — a complete educational platform built by Hariom Kumar.

[![Download on Google Play](https://img.shields.io/badge/Download_on-Google_Play-34a853?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.hariomsonihs.notesaura)

**What's inside NotesAura:**

| Feature | Description |
|---|---|
| 📚 eBooks & PDFs | Structured study material |
| ❓ Quizzes | Test your knowledge |
| 💼 Interview Prep | Top Q&A for placements |
| 📶 Offline Access | Learn without internet |
| 🔍 Smart Search | Find topics instantly |
| 🗂️ Multi-Course | Java, C, Python, Web & more |

**Courses Available:** Java · C Programming · Python · Android Dev · Web Development · DSA · Database/SQL · App Development · Interview Prep · Quizzes · eBooks

**Stats:** 100+ Topics · 500+ Learners · Free to Use

---

## 🔧 Admin Panel

Located at `web-admin/index.html` — a full content management dashboard.

### 📊 Dashboard Cards
- Personal Projects count
- Client Projects count
- College Projects count

### 📝 Manageable Sections

| Section | Fields |
|---|---|
| 👨‍💻 Personal Projects | Title, Description, Icon/Image URL, Gradient, Tags, Features, GitHub, Live Link |
| 🤝 Client Projects | + Client Name field |
| 🎓 College Projects | + Course/Subject field |
| 🏆 Certifications | Title, Issuer, Date, Description, Link |
| 💼 Experience | Title, Company, Duration, Description |
| ⚡ Activities | Title, Description, Icon, Date |
| 📅 Daily Log | Date, Content |
| 🛠️ Services | Title, Description, Icon, Price, Features |
| 📄 Resume | Upload/manage resume link |

### 🖼️ Icon Preview
- Admin panel shows **live icon preview** while typing
- Supports both Font Awesome class and Image URL
- Label: *"Font Awesome class ya Image URL dono chalega"*

---

## 📁 File Structure

```
Hariom Kumar/
│
├── 📄 index.html          — Home page
├── 📄 projects.html       — Projects with 3-tab system
├── 📄 activities.html     — Daily Log + Activities tabs
├── 📄 services.html       — Services + Contact form
├── 📄 resume.html         — Resume page
│
├── 🎨 style.css           — All styles (dark theme, animations, responsive)
├── ⚙️  script.js           — UI logic (drawer, modals, WhatsApp forms, typewriter)
├── 🔥 firebase-data.js    — Firebase listeners, card renderers, tab logic
│
├── 🖼️  profile-photo.jpeg  — Profile photo
│
└── 🔧 web-admin/
    ├── index.html         — Admin dashboard
    ├── admin.js           — Admin CRUD logic
    ├── admin.css          — Admin styles
    └── README.md          — Admin panel docs
```

---

## 🔗 Links & Contact

<div align="center">

| Platform | Link |
|---|---|
| 🌐 Portfolio | [hariomsonihs.github.io](https://hariomsonihs.github.io) |
| 📱 NotesAura App | [Google Play Store](https://play.google.com/store/apps/details?id=com.hariomsonihs.notesaura) |
| 💻 GitHub | [github.com/hariomsonihs](https://github.com/hariomsonihs) |
| 🔗 LinkedIn | [linkedin.com/in/hariomsonihs](https://linkedin.com/in/hariomsonihs) |
| 📞 WhatsApp | [+91 76671 10195](https://wa.me/917667110195) |

</div>

---

<div align="center">

**Designed & Built with ❤️ by Hariom Kumar**

*© 2024 All Rights Reserved*

</div>
