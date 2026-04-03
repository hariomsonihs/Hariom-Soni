// SCROLL PROGRESS BAR
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// TYPEWRITER
const words = ['Android Developer', 'Web Developer', 'Problem Solver', 'Java Programmer'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  if (!tw) return;
  const word = words[wi];
  tw.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  revealOnScroll();
  animateSkills();
});

// DRAWER
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// REVEAL ON SCROLL
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// SKILL BARS
let skillsAnimated = false;
function animateSkills() {
  if (skillsAnimated) return;
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;
  const first = bars[0].getBoundingClientRect();
  if (first.top < window.innerHeight) {
    bars.forEach(bar => bar.style.width = bar.dataset.width + '%');
    skillsAnimated = true;
  }
}

// CONTACT FORM — WhatsApp
function handleSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const inputs  = form.querySelectorAll('input');
  const name    = inputs[0].value.trim();
  const email   = inputs[1].value.trim();
  const phone   = inputs[2].value.trim();
  const subject = inputs[3].value.trim();
  const message = form.querySelector('textarea').value.trim();

  const text = `Hi Hariom! 👋%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone || 'Not provided')}%0A*Subject:* ${encodeURIComponent(subject || 'No subject')}%0A%0A*Message:*%0A${encodeURIComponent(message)}`;

  window.open(`https://wa.me/917667110195?text=${text}`, '_blank');

  const btn = form.querySelector('button');
  btn.innerHTML = '✅ Opening WhatsApp...';
  btn.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
  setTimeout(() => {
    btn.innerHTML = 'Send via WhatsApp <i class="fa-brands fa-whatsapp"></i>';
    btn.style.background = '';
    form.reset();
  }, 3000);
}

// SERVICE INQUIRY MODAL
window.openServiceInquiry = function(serviceName) {
  document.getElementById('siq-service-name').textContent = serviceName;
  document.getElementById('serviceInquiryForm').reset();
  const btn = document.getElementById('siq-submit');
  btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Send via WhatsApp';
  btn.style.background = '';
  document.getElementById('serviceInquiryOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeServiceInquiry = function(e) {
  const overlay = document.getElementById('serviceInquiryOverlay');
  if (!overlay) return;
  if (e && e.target !== overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

window.submitServiceInquiry = function(e) {
  e.preventDefault();
  const service = document.getElementById('siq-service-name').textContent.trim();
  const name    = document.getElementById('siq-name').value.trim();
  const email   = document.getElementById('siq-email').value.trim();
  const phone   = document.getElementById('siq-phone').value.trim();
  const message = document.getElementById('siq-message').value.trim();

  const text = `Hi Hariom! 👋%0A%0AI'm interested in your *${encodeURIComponent(service)}* service.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone || 'Not provided')}%0A%0A*Requirements:*%0A${encodeURIComponent(message)}`;

  window.open(`https://wa.me/917667110195?text=${text}`, '_blank');

  const btn = document.getElementById('siq-submit');
  btn.innerHTML = '✅ Opening WhatsApp...';
  btn.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
  setTimeout(() => {
    document.getElementById('serviceInquiryOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }, 2000);
};

// RESUME TIMELINE TABS
window.switchResTl = function(btn, panel) {
  document.querySelectorAll('.res-tl-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.res-tl-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('res-tl-' + panel).classList.add('active');
};

// GITHUB STATS — static values (GitHub API rate limits unauthenticated calls)
(function setGitHubStats() {
  const stats = { 'gh-repos': '10+', 'gh-followers': '—', 'gh-following': '—', 'gh-stars': '—' };
  Object.entries(stats).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
})();

// INIT
window.addEventListener('load', () => {
  revealOnScroll();
  animateSkills();
});
