/**
 * ApexStore - auth.js
 * Split-screen Login and Registration with Show/Hide Password Toggle,
 * Inline Real-Time Field Feedback, Loading Button States, and Safe URL Redirection.
 */

function getSafeNextUrl() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');

  if (!next) return 'index.html';

  if (next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }
  if (/^[a-zA-Z0-9_\-]+\.html(\?.*)?$/.test(next)) {
    return next;
  }

  return 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect away
  if (Auth.isLoggedIn()) {
    window.location.href = getSafeNextUrl();
    return;
  }

  // Preserve 'next' parameter across login <-> register switch links
  const nextParam = new URLSearchParams(window.location.search).get('next');
  if (nextParam) {
    const switchLinks = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
    switchLinks.forEach(link => {
      const base = link.getAttribute('href').split('?')[0];
      link.setAttribute('href', `${base}?next=${encodeURIComponent(nextParam)}`);
    });
  }

  // Password Toggle (Show / Hide)
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(toggleBtn => {
    toggleBtn.innerHTML = Icons.eye(18);
    toggleBtn.addEventListener('click', () => {
      const targetId = toggleBtn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = Icons.eyeOff(18);
      } else {
        input.type = 'password';
        toggleBtn.innerHTML = Icons.eye(18);
      }
    });
  });

  // Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const errBox = document.getElementById('login-error-banner');
    const submitBtn = document.getElementById('login-submit-btn');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errBox) {
        errBox.style.display = 'none';
        errBox.textContent = '';
      }

      const email = emailInput.value.trim();
      const password = passInput.value;

      if (!email || !password) {
        showInlineError(errBox, 'Please provide both email address and password');
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Signing in...';

      try {
        const response = await api('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        });

        Auth.setAuth(response.token, response.user);
        showToast('Login successful! Redirecting...', 'success');

        setTimeout(() => {
          window.location.href = getSafeNextUrl();
        }, 400);
      } catch (err) {
        showInlineError(errBox, err.message || 'Wrong email or password');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passInput = document.getElementById('register-password');
    const errBox = document.getElementById('register-error-banner');
    const submitBtn = document.getElementById('register-submit-btn');

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errBox) {
        errBox.style.display = 'none';
        errBox.textContent = '';
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passInput.value;

      if (!name) {
        showInlineError(errBox, 'Full Name is required');
        return;
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        showInlineError(errBox, 'Enter a valid email address');
        return;
      }

      if (!password || password.length < 6) {
        showInlineError(errBox, 'Password must be at least 6 characters long');
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Creating account...';

      try {
        const response = await api('/api/auth/register', {
          method: 'POST',
          body: { name, email, password }
        });

        Auth.setAuth(response.token, response.user);
        showToast('Account created successfully!', 'success');

        setTimeout(() => {
          window.location.href = getSafeNextUrl();
        }, 400);
      } catch (err) {
        showInlineError(errBox, err.message || 'Failed to create account');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }

  function showInlineError(box, msg) {
    if (box) {
      box.textContent = msg;
      box.style.display = 'block';
    }
    showToast(msg, 'error');
  }
});
