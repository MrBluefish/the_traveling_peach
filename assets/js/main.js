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
const signupBtn = document.getElementById('signupBtn');
const signupModal = document.getElementById('signupModal');
const closeEls = signupModal ? signupModal.querySelectorAll('[data-close-modal]') : [];

function openModal(){
  if (!signupModal) return;
  signupModal.hidden = false;
  signupModal.setAttribute('aria-hidden', 'false');
  // Prefill datetime-local to a sensible default (next day at 7pm)
  const dt = document.getElementById('startLocal');
  if (dt && !dt.value){
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(19, 0, 0, 0);
    // format YYYY-MM-DDTHH:MM
    const pad = n => String(n).padStart(2, '0');
    const val = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    dt.value = val;
  }
}
function closeModal(){
  if (!signupModal) return;
  signupModal.hidden = true;
  signupModal.setAttribute('aria-hidden', 'true');
}

// Open/close bindings
if (signupBtn){ signupBtn.addEventListener('click', e => { e.preventDefault(); openModal(); }); }
closeEls.forEach(el => el.addEventListener('click', closeModal));
if (signupModal){
  signupModal.addEventListener('click', e => { if (e.target.classList.contains('modal__backdrop')) closeModal(); });
  document.addEventListener('keydown', e => { if (!signupModal.hidden && e.key === 'Escape') closeModal(); });
}

// Form → Google Calendar link
const gcalForm = document.getElementById('gcalForm');
if (gcalForm){
  gcalForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(gcalForm);
    const hostName = (fd.get('hostName') || '').toString().trim();
    const hostEmail = (fd.get('hostEmail') || '').toString().trim();
    const startLocal = fd.get('startLocal'); // "YYYY-MM-DDTHH:MM"
    const durationMin = parseInt(fd.get('duration') || '120', 10);
    const location = (fd.get('location') || '').toString().trim();

    if (!startLocal){ alert('Please choose a start date & time.'); return; }

    // Convert local datetime to UTC for Google Calendar `dates=...Z/...Z`
    const start = new Date(startLocal);
    const end = new Date(start.getTime() + durationMin * 60000);

    const fmt = (d) => {
      // YYYYMMDDTHHMMSSZ
      const pad = n => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };

    const title = `the traveling peach – home pop-up`;
    const details = [
      `Host: ${hostName}${hostEmail ? ` (${hostEmail})` : ''}`,
      `We bring luxury cosmetics & perfumes at unbeatable prices.`,
      `Questions? Reply to this invite or contact us via the website.`
    ].join('%0A');

    const dates = `${fmt(start)}/${fmt(end)}`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      details: details,
    });
    if (location) params.set('location', location);
    params.set('dates', dates);

    const gcalUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

    // Open in a new tab so user can review & save
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');

    // Close modal & optionally show a toast
    closeModal();
    setTimeout(()=> alert('Opening Google Calendar…'), 50);
  });
}
