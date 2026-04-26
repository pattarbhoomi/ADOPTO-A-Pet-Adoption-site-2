// API Configuration
const API_BASE_URL = 'https://adopto-a-pet-adoption-site-2.onrender.com/api/auth'; // backend routes

// Log API calls for debugging
function logError(endpoint, error) {
  console.error(`API Error at ${endpoint}:`, error.message || error);
}

// SIGNUP
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;

  try {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phone, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Signup successful! Please log in.');
      document.getElementById('signup-form-container').style.display = 'none';
      document.getElementById('login-form-container').style.display = 'block';
    } else {
      alert(data.error || 'Signup failed');
    }
  } catch (err) {
    logError('POST /signup', err);
    alert('Error during signup');
  }
});

// LOGIN
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-email').value; // treat as username
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      if (data.redirect) {
        window.location.href = data.redirect; // backend decides index.html vs admin.html
      } else {
        alert('Login successful, but no redirect provided.');
      }
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    logError('POST /login', err);
    alert('Error during login');
  }
});
