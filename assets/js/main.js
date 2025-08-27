// Current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Prevent default submit for demo search & signup
document.querySelectorAll('form.search').forEach(f=>{
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const q = new FormData(f).get('q') || '';
    alert('Search submitted: ' + q);
  });
});
const signup = document.getElementById('signup');
if (signup){
  signup.addEventListener('submit', e=>{
    e.preventDefault();
    const email = new FormData(signup).get('email') || '';
    alert('Thanks for signing up! ' + (email ? `(${email})` : ''));
  });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobilePanel = document.getElementById('mobilePanel');
if (hamburger && mobilePanel){
  hamburger.addEventListener('click', ()=>{
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobilePanel.hidden = expanded;
  });
}

// Desktop dropdown
const dropdown = document.getElementById('categoriesDropdown');
if (dropdown){
  const dropdownBtn = dropdown.querySelector('button');
  const closeDropdown = ()=>{
    dropdown.setAttribute('aria-expanded','false');
    dropdownBtn.setAttribute('aria-expanded','false');
  };
  dropdownBtn.addEventListener('click', ()=>{
    const expanded = dropdown.getAttribute('aria-expanded') === 'true';
    dropdown.setAttribute('aria-expanded', String(!expanded));
    dropdownBtn.setAttribute('aria-expanded', String(!expanded));
  });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeDropdown(); });
  document.addEventListener('click', (e)=>{ if (!dropdown.contains(e.target)) closeDropdown(); });
}

// Mobile dropdown
const mobileDropdownBtn = document.getElementById('mobileDropdownBtn');
const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');
if (mobileDropdownBtn && mobileDropdownMenu){
  mobileDropdownBtn.addEventListener('click', ()=>{
    const expanded = mobileDropdownBtn.getAttribute('aria-expanded') === 'true';
    mobileDropdownBtn.setAttribute('aria-expanded', String(!expanded));
    mobileDropdownMenu.hidden = expanded;
  });
}

// Back to top
const backToTop = document.getElementById('backToTop');
const toggleBackToTop = ()=>{
  if (!backToTop) return;
  backToTop.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
};
window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();
if (backToTop){
  backToTop.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Google Calendar signup modal flow --- //
function openModal() {
  const modal = document.getElementById('signupModal');
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');

  // Prefill tomorrow 7pm if empty
  const dt = document.getElementById('startLocal');
  if (dt && !dt.value) {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(19, 0, 0, 0);
    const pad = n => String(n).padStart(2, '0');
    dt.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
}

function closeModal() {
  const modal = document.getElementById('signupModal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
}

// Delegated event listeners (works across all pages/buttons)
document.addEventListener('click', e => {
  if (e.target.closest('[data-signup-btn]')) {
    e.preventDefault();
    openModal();
  }
  if (e.target.closest('[data-close-modal]') || e.target.classList.contains('modal__backdrop')) {
    closeModal();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !document.getElementById('signupModal').hidden) closeModal();
});

// Form → Google Calendar
const gcalForm = document.getElementById('gcalForm');
if (gcalForm) {
  gcalForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(gcalForm);
    const hostName = fd.get('hostName') || '';
    const hostEmail = fd.get('hostEmail') || '';
    const startLocal = fd.get('startLocal');
    const duration = parseInt(fd.get('duration') || '120', 10);
    const location = fd.get('location') || '';

    if (!startLocal) return alert('Please pick a date & time');

    const start = new Date(startLocal);
    const end = new Date(start.getTime() + duration * 60000);
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'The Traveling Peach – Home Pop-Up',
      details: `Host: ${hostName} (${hostEmail})%0AWe bring luxury cosmetics & perfumes.%0AQuestions? Contact us via the site.`,
      dates: `${fmt(start)}/${fmt(end)}`
    });
    if (location) params.set('location', location);

    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
    closeModal();
    setTimeout(() => alert('Opening Google Calendar…'), 100);
  });
}
// --- ICS download fallback --- //
const downloadBtn = document.getElementById('downloadICS');
if (downloadBtn && gcalForm) {
  downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const fd = new FormData(gcalForm);
    const hostName = fd.get('hostName') || '';
    const hostEmail = fd.get('hostEmail') || '';
    const startLocal = fd.get('startLocal');
    const duration = parseInt(fd.get('duration') || '120', 10);
    const location = fd.get('location') || '';

    if (!startLocal) return alert('Please pick a date & time');

    const start = new Date(startLocal);
    const end = new Date(start.getTime() + duration * 60000);

    // Format YYYYMMDDTHHMMSS
    const pad = n => String(n).padStart(2, '0');
    const fmt = d =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Traveling Peach//EN
BEGIN:VEVENT
UID:${Date.now()}@thetravelingpeach.com
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:The Traveling Peach – Home Pop-Up
DESCRIPTION:Host: ${hostName} (${hostEmail})\\nWe bring luxury cosmetics & perfumes.\\nQuestions? Contact us via the site.
${location ? `LOCATION:${location}` : ''}
END:VEVENT
END:VCALENDAR
`.trim();

    // Create file & trigger download
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'the-traveling-peach-event.ics';
    a.click();
    URL.revokeObjectURL(url);

    closeModal();
    setTimeout(() => alert('Downloading calendar file…'), 100);
  });
}

