const API          = 'http://localhost:5000';
const API_FEEDBACK = 'http://localhost:5000/api/feedback';
const OTP_API      = 'http://localhost:5000/api/otp';

const ADMIN_USERNAME = 'admin@1';
const ADMIN_PASSWORD = 'adopto_adm';

let sliderIndex    = 0;
let autoSlideTimer = null;
const CARD_WIDTH   = 280;
const CARD_GAP     = 20;

let feedbackIndex = 0;
let feedbackData  = [];

let fpEmail = '';

// ═══════════════════════════════════════════
// DOM CONTENT LOADED
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {

  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('role');
  if (username && role) showProfileState(username, role);

  buildSlider();
  loadFeedbacks();
  setupFeedbackForm();

  // Star rating
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value);
      document.getElementById('feedbackRating').value = val;
      document.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('selected', i < val);
      });
    });
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      document.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('hovered', i < val);
      });
    });
    star.addEventListener('mouseout', () => {
      document.querySelectorAll('.star').forEach(s => s.classList.remove('hovered'));
    });
  });

  // Feedback form submit
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = document.getElementById('feedbackMessage').value.trim();
      const rating  = parseInt(document.getElementById('feedbackRating').value);
      const name    = localStorage.getItem('username') || 'Anonymous';
      const email   = localStorage.getItem('email')    || '';
      const userId  = localStorage.getItem('userId')   || null;

      if (!message) { showMsg('feedback-msg', '❌ Please write a message.', 'error'); return; }
      if (!rating || rating === 0) { showMsg('feedback-msg', '❌ Please select a star rating.', 'error'); return; }

      try {
        const res  = await fetch(API_FEEDBACK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, rating, userId })
        });
        const data = await res.json();
        if (res.ok) {
          showMsg('feedback-msg', '✅ Thank you for your feedback!', 'success');
          feedbackForm.reset();
          document.getElementById('feedbackRating').value = 0;
          document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('selected');
            s.classList.remove('hovered');
          });
          loadFeedbacks();
        } else {
          showMsg('feedback-msg', '❌ ' + (data.error || 'Failed to submit'), 'error');
        }
      } catch (err) {
        showMsg('feedback-msg', '❌ Cannot reach server.', 'error');
      }
    });
  }

  // Toggle forms
  const showLogin  = document.getElementById('show-login');
  const showSignup = document.getElementById('show-signup');
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('loginForm').style.display  = 'block';
      clearMsgs();
    });
  }
  if (showSignup) {
    showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display  = 'none';
      document.getElementById('signupForm').style.display = 'block';
      clearMsgs();
    });
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu   = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
      hamburger.classList.toggle('open');
    });
    // Close on nav link click (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        hamburger.classList.remove('open');
      });
    });
  }
});

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

// ── SIGNUP ──
const signupFormEl = document.getElementById('signupForm');
if (signupFormEl) {
  signupFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone    = document.getElementById('phone').value.trim();
    const role     = document.getElementById('role').value;

    if (role === 'admin') {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        showMsg('signup-msg', '❌ Admin credentials are incorrect.', 'error');
        return;
      }
      localStorage.setItem('username', username);
      localStorage.setItem('email',    email);
      localStorage.setItem('phone',    phone);
      localStorage.setItem('role',     'admin');

      const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
      if (modal) modal.hide();

      window.location.href = 'admin.html';
      return;
    }

    try {
      const res  = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password, role: 'user' })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('username', username);
        localStorage.setItem('email',    email);
        localStorage.setItem('phone',    phone);
        localStorage.setItem('userId',   data.id || '');
        localStorage.setItem('role',     'user');

        const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
        if (modal) modal.hide();

        showProfileState(username, 'user');
        setupFeedbackForm();
        showMsg('signup-msg', '✅ Signup successful! Welcome to Adopto 🐾', 'success');
      } else {
        showMsg('signup-msg', '❌ ' + (data.error || 'Signup failed. Try again.'), 'error');
      }
    } catch (err) {
      showMsg('signup-msg', '❌ Cannot reach server. Is it running?', 'error');
    }
  });
}

// ── LOGIN ──
const loginFormEl = document.getElementById('loginForm');
if (loginFormEl) {
  loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role     = document.getElementById('loginRole').value;

    if (!role) {
      showMsg('login-msg', '❌ Please select a role.', 'error');
      return;
    }

    if (role === 'admin') {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        showMsg('login-msg', '❌ Invalid admin credentials.', 'error');
        return;
      }
      localStorage.setItem('username', username);
      localStorage.setItem('role',     'admin');

      const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
      if (modal) modal.hide();

      window.location.href = 'admin.html';
      return;
    }

    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('username', data.username || username);
        localStorage.setItem('email',    data.email    || '');
        localStorage.setItem('phone',    data.phone    || '');
        localStorage.setItem('userId',   data.id       || '');
        localStorage.setItem('role',     'user');
        if (data.token) localStorage.setItem('token', data.token);

        const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
        if (modal) modal.hide();

        showProfileState(data.username || username, 'user');
        setupFeedbackForm();
      } else {
        showMsg('login-msg', '❌ ' + (data.error || 'Invalid credentials.'), 'error');
      }
    } catch (err) {
      showMsg('login-msg', '❌ Cannot reach server. Is it running?', 'error');
    }
  });
}

// ═══════════════════════════════════════════
// PROFILE & SIDEBAR
// ═══════════════════════════════════════════

function showProfileState(username, role) {
  const loginBtn   = document.querySelector('#login-signup-btn');
  const ngoBtn     = document.querySelector('#ngo-btn');
  const profileBtn = document.querySelector('.profile-btn');

  // Hide login and NGO buttons
  if (loginBtn) loginBtn.style.display = 'none';
  if (ngoBtn)   ngoBtn.style.display   = 'none';

  // Show profile button
  if (profileBtn) {
    profileBtn.style.display = 'inline-flex';
    const pfp      = localStorage.getItem('pfp') || null;
    const initials = username ? username.charAt(0).toUpperCase() : '?';
    if (pfp) {
      profileBtn.innerHTML = `<img src="${pfp}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      profileBtn.innerHTML = role === 'admin'
        ? `🛡️ ${username}`
        : `<span class="nav-initials">${initials}</span>`;
    }
  }

  populateSidebar();
}

function populateSidebar() {
  const username = localStorage.getItem('username') || '—';
  const email    = localStorage.getItem('email')    || '—';
  const phone    = localStorage.getItem('phone')    || '—';
  const role     = localStorage.getItem('role')     || 'user';
  const pfp      = localStorage.getItem('pfp')      || null;

  const el = (id) => document.getElementById(id);

  if (el('sidebar-username'))   el('sidebar-username').textContent   = username;
  if (el('sidebar-email'))      el('sidebar-email').textContent      = email;
  if (el('sidebar-phone'))      el('sidebar-phone').textContent      = phone;
  if (el('sidebar-role-label')) el('sidebar-role-label').textContent = role === 'admin' ? 'Administrator' : 'User';

  // Show initials or image in sidebar avatar
  const initials = username !== '—' ? username.charAt(0).toUpperCase() : '?';
  if (el('sidebar-initials')) {
    el('sidebar-initials').textContent = initials;
  }

  if (el('sidebar-admin-badge')) {
    el('sidebar-admin-badge').style.display = role === 'admin' ? 'block' : 'none';
  }
  if (el('sidebar-adoptions-link')) {
    el('sidebar-adoptions-link').style.display = role === 'admin' ? 'none' : 'block';
  }
  if (el('sidebar-dashboard-link')) {
    el('sidebar-dashboard-link').style.display = role === 'admin' ? 'block' : 'none';
  }
  if (el('sidebar-reports-link')) {
    el('sidebar-reports-link').style.display = role === 'admin' ? 'none' : 'block';
  }

  // Handle pfp image vs initials
  if (pfp && el('sidebar-pfp')) {
    el('sidebar-pfp').src = pfp;
    el('sidebar-pfp').style.display = 'block';
    if (el('sidebar-initials')) el('sidebar-initials').style.display = 'none';
  } else {
    if (el('sidebar-pfp'))      el('sidebar-pfp').style.display      = 'none';
    if (el('sidebar-initials')) el('sidebar-initials').style.display = 'flex';
  }

  // Also update the nav profile button avatar
  const profileBtn = document.querySelector('.profile-btn');
  if (profileBtn && profileBtn.style.display !== 'none') {
    if (pfp) {
      profileBtn.innerHTML = `<img src="${pfp}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      profileBtn.innerHTML = `<span class="nav-initials">${initials}</span>`;
    }
  }
}

function openSidebar() {
  populateSidebar();
  document.getElementById('profile-sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('show');
}

function closeSidebar() {
  document.getElementById('profile-sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

function handlePfpUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    localStorage.setItem('pfp', dataUrl);

    const pfpImg   = document.getElementById('sidebar-pfp');
    const initials = document.getElementById('sidebar-initials');
    if (pfpImg) {
      pfpImg.src = dataUrl;
      pfpImg.style.display = 'block';
    }
    if (initials) initials.style.display = 'none';

    // Also update the nav button
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
      profileBtn.innerHTML = `<img src="${dataUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    }
  };
  reader.readAsDataURL(file);
}

function logout() {
  localStorage.clear();
  const loginBtn   = document.querySelector('#login-signup-btn');
  const ngoBtn     = document.querySelector('#ngo-btn');
  const profileBtn = document.querySelector('.profile-btn');
  if (loginBtn)   loginBtn.style.display   = 'inline-block';
  if (ngoBtn)     ngoBtn.style.display     = 'inline-flex';
  if (profileBtn) profileBtn.style.display = 'none';
  closeSidebar();
  window.location.href = 'index.html';
}

// ═══════════════════════════════════════════
// PET SLIDER
// ═══════════════════════════════════════════

async function buildSlider() {
  const track = document.getElementById('slideTrack');
  if (!track) return;

  try {
    const res  = await fetch(`${API}/api/pets`);
    const pets = await res.json();

    if (!pets || pets.length === 0) {
      track.innerHTML = '<p style="padding:20px;color:#999;">No pets yet.</p>';
      return;
    }

    const allPets = [...pets, ...pets];

    track.innerHTML = allPets.map(pet => `
      <div class="slider-pet-card">
        <img src="${pet.image_url || 'images/logo.jpeg'}"
             alt="${pet.name}"
             onerror="this.src='images/logo.jpeg'">
        <div class="slider-pet-info">
          <h4>${pet.name}</h4>
          <p>${pet.temperament || ''}</p>
          <a href="adoption.html" class="slider-adopt-btn">Adopt 🐾</a>
        </div>
      </div>
    `).join('');

    startAutoSlide();
  } catch (err) {
    console.error('Slider error:', err);
  }
}

function moveSlider(direction) {
  const track = document.getElementById('slideTrack');
  if (!track) return;

  const card = track.querySelector('.slider-pet-card');
  if (!card) return;

  const cardWidth  = card.offsetWidth + 20;
  const totalCards = Math.floor(track.children.length / 2);

  sliderIndex += direction;
  if (sliderIndex >= totalCards) sliderIndex = 0;
  if (sliderIndex < 0) sliderIndex = totalCards - 1;

  track.style.transform = `translateX(-${sliderIndex * cardWidth}px)`;
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => moveSlider(1), 3000);
}

// ═══════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════

async function loadFeedbacks() {
  try {
    const res  = await fetch(API_FEEDBACK);
    const data = await res.json();
    feedbackData = data;

    const container = document.getElementById('feedbackContainer');
    const empty     = document.getElementById('feedback-empty');
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }

    if (empty) empty.style.display = 'none';

    const likedList = JSON.parse(localStorage.getItem('likedFeedbacks') || '[]');

    container.innerHTML = data.map((fb) => {
      const liked     = likedList.includes(fb.id);
      const likeCount = Math.max(0, fb.likes || 0); // ensure never negative
      return `
        <div class="feedback-card-item">
          <div class="feedback-card-top">
            <div class="feedback-avatar">
              ${fb.image
                ? `<img src="${fb.image}" alt="${fb.name}">`
                : `<span>${(fb.name || 'A').charAt(0).toUpperCase()}</span>`
              }
            </div>
            <div>
              <div class="feedback-card-name">${fb.name || 'Anonymous'}</div>
              <div class="feedback-card-date">${new Date(fb.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
            </div>
          </div>
          <div class="feedback-card-stars">${'★'.repeat(fb.rating || 0)}${'☆'.repeat(5 - (fb.rating || 0))}</div>
          <p class="feedback-card-msg">"${fb.message}"</p>
          <button class="fb-like-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${fb.id}, this)" data-count="${likeCount}">
            ${liked ? '❤️' : '🤍'} <span class="like-count">${likeCount}</span>
          </button>
        </div>
      `;
    }).join('');

    feedbackIndex = 0;
    updateFeedbackSlider();
  } catch (err) {
    console.error('Error loading feedbacks:', err);
  }
}

function moveFeedback(direction) {
  const cards = document.querySelectorAll('.feedback-card-item');
  if (cards.length === 0) return;

  feedbackIndex += direction;
  if (feedbackIndex < 0) feedbackIndex = cards.length - 1;
  if (feedbackIndex >= cards.length) feedbackIndex = 0;

  updateFeedbackSlider();
}

function updateFeedbackSlider() {
  const container = document.getElementById('feedbackContainer');
  if (!container) return;
  container.style.transform = `translateX(-${feedbackIndex * 370}px)`;
}

function setupFeedbackForm() {
  const username    = localStorage.getItem('username');
  const role        = localStorage.getItem('role');
  const loginPrompt = document.getElementById('feedback-login-prompt');
  const formBox     = document.getElementById('feedback-form-box');

  if (!loginPrompt || !formBox) return;

  if (username && role === 'user') {
    loginPrompt.style.display = 'none';
    formBox.style.display     = 'block';
  } else {
    loginPrompt.style.display = 'block';
    formBox.style.display     = 'none';
  }
}

// ═══════════════════════════════════════════
// LIKES — fixed: read count from data-count attr, not innerHTML
// ═══════════════════════════════════════════

async function toggleLike(feedbackId, btn) {
  const likedList    = JSON.parse(localStorage.getItem('likedFeedbacks') || '[]');
  const alreadyLiked = likedList.includes(feedbackId);
  const currentCount = parseInt(btn.dataset.count) || 0;
  const endpoint     = alreadyLiked ? 'unlike' : 'like';
  const newCount     = alreadyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

  try {
    await fetch(`http://localhost:5000/api/feedback/${feedbackId}/${endpoint}`, { method: 'PUT' });

    btn.dataset.count = newCount;

    if (alreadyLiked) {
      btn.classList.remove('liked');
      btn.innerHTML = `🤍 <span class="like-count">${newCount}</span>`;
      localStorage.setItem('likedFeedbacks', JSON.stringify(likedList.filter(id => id !== feedbackId)));
    } else {
      btn.classList.add('liked');
      btn.innerHTML = `❤️ <span class="like-count">${newCount}</span>`;
      localStorage.setItem('likedFeedbacks', JSON.stringify([...likedList, feedbackId]));
    }

    // Re-attach data-count after innerHTML overwrite
    btn.dataset.count = newCount;

  } catch (err) {
    console.error('Like error:', err);
  }
}

// ═══════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════

function openForgotModal() {
  const loginModal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
  if (loginModal) loginModal.hide();

  resetForgotModal();

  const forgot = new bootstrap.Modal(document.getElementById('forgot-modal'));
  forgot.show();
}

function resetForgotModal() {
  fpEmail = '';
  showFPStep(1);
  const ids = ['fp-email','fp-otp','fp-newpass','fp-confirmpass'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['fp-msg1','fp-msg2','fp-msg3'].forEach(id => showMsg(id, '', ''));
}

function showFPStep(step) {
  [1,2,3,4].forEach(n => {
    const el = document.getElementById(`fp-step${n}`);
    if (el) el.style.display = n === step ? 'block' : 'none';
  });
}

async function sendOTP(isResend = false) {
  const email = isResend ? fpEmail : document.getElementById('fp-email').value.trim();
  if (!email) { showMsg('fp-msg1', '❌ Please enter your email.', 'error'); return; }

  showMsg('fp-msg1', '⏳ Sending OTP...', '');

  try {
    const res  = await fetch(`${OTP_API}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (res.ok) {
      fpEmail = email;
      const disp = document.getElementById('fp-email-display');
      if (disp) disp.textContent = email;
      showFPStep(2);
      if (isResend) showMsg('fp-msg2', '✅ New OTP sent!', 'success');
    } else {
      showMsg('fp-msg1', '❌ ' + (data.error || 'Failed to send OTP'), 'error');
    }
  } catch (err) {
    showMsg('fp-msg1', '❌ Cannot reach server.', 'error');
  }
}

async function verifyOTP() {
  const otp = document.getElementById('fp-otp').value.trim();
  if (!otp || otp.length !== 6) { showMsg('fp-msg2', '❌ Please enter the 6-digit OTP.', 'error'); return; }

  showMsg('fp-msg2', '⏳ Verifying...', '');

  try {
    const res  = await fetch(`${OTP_API}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fpEmail, otp })
    });
    const data = await res.json();

    if (res.ok) { showFPStep(3); }
    else { showMsg('fp-msg2', '❌ ' + (data.error || 'Invalid OTP'), 'error'); }
  } catch (err) {
    showMsg('fp-msg2', '❌ Cannot reach server.', 'error');
  }
}

async function resetPassword() {
  const newPass     = document.getElementById('fp-newpass').value;
  const confirmPass = document.getElementById('fp-confirmpass').value;

  if (!newPass || newPass.length < 6) { showMsg('fp-msg3', '❌ Password must be at least 6 characters.', 'error'); return; }
  if (newPass !== confirmPass) { showMsg('fp-msg3', '❌ Passwords do not match.', 'error'); return; }

  showMsg('fp-msg3', '⏳ Resetting...', '');

  try {
    const res  = await fetch(`${OTP_API}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fpEmail, newPassword: newPass })
    });
    const data = await res.json();

    if (res.ok) { showFPStep(4); }
    else { showMsg('fp-msg3', '❌ ' + (data.error || 'Failed to reset'), 'error'); }
  } catch (err) {
    showMsg('fp-msg3', '❌ Cannot reach server.', 'error');
  }
}

function goToLogin() {
  const forgotModal = bootstrap.Modal.getInstance(document.getElementById('forgot-modal'));
  if (forgotModal) forgotModal.hide();

  const signupF = document.getElementById('signupForm');
  const loginF  = document.getElementById('loginForm');
  if (signupF) signupF.style.display = 'none';
  if (loginF)  loginF.style.display  = 'block';

  const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
  loginModal.show();
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '';
}

function clearMsgs() {
  showMsg('signup-msg', '', '');
  showMsg('login-msg',  '', '');
}