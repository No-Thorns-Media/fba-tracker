// auth.js — ES Module авторизация для FBA Tracker
// Подключение: <script type="module" src="auth.js"></script> — ПЕРЕД закрывающим </body>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ─── Конфигурация (такая же как в index.html) ───
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB08-RZU489mHZagucU7fXPjLfnWASr690",
  authDomain: "fba-tracker-1ae08.firebaseapp.com",
  databaseURL: "https://fba-tracker-1ae08-default-rtdb.firebaseio.com",
  projectId: "fba-tracker-1ae08",
  storageBucket: "fba-tracker-1ae08.firebasestorage.app",
  messagingSenderId: "832455319986",
  appId: "1:832455319986:web:3c6eec34479eec3c1604ab"
};

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// ─── Скрыть всё приложение сразу ───
document.querySelectorAll('.tabs, .panel, .kbar, header, .ubar, .ctrl, .af, .mismatch-bar, .pw, .tw, .toast')
  .forEach(el => el.style.display = 'none');

// ─── Создать экран входа ───
function showLogin() {
  if (document.getElementById('login-screen')) return;

  const overlay = document.createElement('div');
  overlay.id = 'login-screen';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#0b0d11;font-family:Syne,sans-serif';
  overlay.innerHTML = `
    <div style="background:#13161d;border:1px solid #272d3d;border-radius:16px;padding:40px 32px;width:100%;max-width:380px;box-shadow:0 25px 60px rgba(0,0,0,.4)">
      <h2 style="color:#e8ecf4;margin:0 0 6px;font-size:22px;text-align:center;font-weight:800">\u{1F512} FBA Tracker</h2>
      <p style="color:#6b7a96;margin:0 0 28px;font-size:12px;text-align:center;font-family:'IBM Plex Mono'">\u0412\u043E\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C</p>
      <label style="display:block;color:#b0b8cc;font-size:11px;margin-bottom:5px;font-weight:600;letter-spacing:.5px;text-transform:uppercase">Email</label>
      <input type="email" id="login-email" placeholder="email@example.com" autocomplete="email"
        style="width:100%;padding:10px 14px;border:1px solid #272d3d;border-radius:8px;background:#0b0d11;color:#e8ecf4;font-family:Syne;font-size:14px;margin-bottom:16px;box-sizing:border-box;outline:none" />
      <label style="display:block;color:#b0b8cc;font-size:11px;margin-bottom:5px;font-weight:600;letter-spacing:.5px;text-transform:uppercase">\u041F\u0430\u0440\u043E\u043B\u044C</label>
      <input type="password" id="login-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" autocomplete="current-password"
        style="width:100%;padding:10px 14px;border:1px solid #272d3d;border-radius:8px;background:#0b0d11;color:#e8ecf4;font-family:Syne;font-size:14px;margin-bottom:16px;box-sizing:border-box;outline:none" />
      <button id="login-btn"
        style="width:100%;padding:12px;background:#4f8ef7;color:#fff;border:none;border-radius:8px;font-family:Syne;font-size:14px;font-weight:700;cursor:pointer;margin-top:4px;letter-spacing:.3px">\u0412\u043E\u0439\u0442\u0438</button>
      <div id="login-error" style="color:#f7576c;font-size:11px;margin:12px 0 0;text-align:center;min-height:18px;font-family:'IBM Plex Mono'"></div>
    </div>
  `;
  document.body.prepend(overlay);

  document.getElementById('login-btn').addEventListener('click', doLogin);
  overlay.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  setTimeout(() => document.getElementById('login-email').focus(), 100);
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');

  errEl.textContent = '';
  if (!email || !password) { errEl.textContent = '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email \u0438 \u043F\u0430\u0440\u043E\u043B\u044C'; return; }

  btn.disabled = true;
  btn.textContent = '\u0412\u0445\u043E\u0434...';
  btn.style.background = '#333b50';

  signInWithEmailAndPassword(auth, email, password)
    .catch(err => {
      btn.disabled = false;
      btn.textContent = '\u0412\u043E\u0439\u0442\u0438';
      btn.style.background = '#4f8ef7';
      const msgs = {
        'auth/user-not-found': '\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D',
        'auth/wrong-password': '\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C',
        'auth/invalid-email': '\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email',
        'auth/too-many-requests': '\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043F\u044B\u0442\u043E\u043A. \u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435',
        'auth/invalid-credential': '\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C',
        'auth/network-request-failed': '\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0442\u0438',
      };
      errEl.textContent = msgs[err.code] || '\u041E\u0448\u0438\u0431\u043A\u0430: ' + err.message;
    });
}

// ─── Показать / скрыть приложение ───
function showApp() {
  const login = document.getElementById('login-screen');
  if (login) login.remove();

  document.querySelectorAll('.tabs, .panel.on, .kbar, header, .ubar, .ctrl, .af, .pw, .tw, .toast')
    .forEach(el => el.style.display = '');

  if (!document.getElementById('logout-btn')) {
    const btn = document.createElement('button');
    btn.id = 'logout-btn';
    btn.textContent = '\u0412\u044B\u0439\u0442\u0438';
    btn.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9999;padding:5px 14px;background:#f7576c;color:#fff;border:none;border-radius:6px;font-family:Syne;font-size:11px;font-weight:700;cursor:pointer;opacity:.8;transition:opacity .2s;letter-spacing:.3px';
    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '.8');
    btn.addEventListener('click', () => signOut(auth));
    document.body.appendChild(btn);
  }
}

function hideApp() {
  document.querySelectorAll('.tabs, .panel, .kbar, header, .ubar, .ctrl, .af, .mismatch-bar, .pw, .tw')
    .forEach(el => el.style.display = 'none');
  const btn = document.getElementById('logout-btn');
  if (btn) btn.remove();
}

// ─── Слушатель состояния авторизации ───
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('\u2705 \u0412\u0445\u043E\u0434:', user.email);
    showApp();
  } else {
    console.log('\u{1F512} \u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F');
    hideApp();
    showLogin();
  }
});
