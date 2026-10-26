const $ = id => document.getElementById(id);
const FIELDS = ['name', 'email', 'password', 'confirm', 'terms'];
const touched = new Set();

// ---- regular expressions ----
const NAME_RE = /^\p{L}[\p{L}\s'.-]*$/u;                                            // letters, spaces, ' . -
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/; // name@domain.tld
const COMMON = new Set(['password', 'password1', 'password123', '12345678', '123456789', 'qwerty123', 'iloveyou', 'admin123', 'welcome1']);
const TYPOS = { 'gmial.com': 'gmail.com', 'gmail.con': 'gmail.com', 'gamil.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };

// ---- password helpers ----
function checks(pw) {
  return {
    len: pw.length >= 8,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw)
  };
}
// Strength score from 0 (empty) to 5 (strong)
function strength(pw) {
  if (!pw) return 0;
  const c = checks(pw);
  let points = 0;
  if (c.len) points++;
  if (c.lower && c.upper) points++;
  if (c.digit) points++;
  if (c.symbol) points++;
  if (pw.length >= 12) points++;
  if (!c.len || COMMON.has(pw.toLowerCase())) points = Math.min(points, 1);
  return Math.max(points, 1);
}
const LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

// ---- validators: each returns an error message, or '' when the value is fine ----
const validators = {
  name() {
    const v = $('name').value.trim();
    if (!v) return 'Please enter your name.';
    if (v.length < 2) return 'Name must be at least 2 characters.';
    if (v.length > 50) return 'Name must be 50 characters or fewer.';
    if (!NAME_RE.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
    return '';
  },
  email() {
    const v = $('email').value.trim();
    if (!v) return 'Please enter your email address.';
    if (!EMAIL_RE.test(v)) return 'Enter a valid email, like name@example.com.';
    return '';
  },
  password() {
    const v = $('password').value, c = checks(v);
    if (!v) return 'Please enter a password.';
    if (!c.len) return 'Use at least 8 characters.';
    if (!c.lower) return 'Add a lowercase letter.';
    if (!c.upper) return 'Add an uppercase letter.';
    if (!c.digit) return 'Add a number.';
    if (COMMON.has(v.toLowerCase())) return 'That password is too common. Try something less guessable.';
    const local = $('email').value.split('@')[0].toLowerCase();
    if (local.length >= 3 && v.toLowerCase().includes(local)) return 'Do not include your email name in your password.';
    return '';
  },
  confirm() {
    const v = $('confirm').value;
    if (!v) return 'Please confirm your password.';
    if (v !== $('password').value) return 'Passwords do not match.';
    return '';
  },
  terms() { return $('terms').checked ? '' : 'You need to agree to continue.'; }
};

// Optional friendly hint for common email typos (not an error)
function emailHint() {
  const v = $('email').value.trim(), parts = v.split('@');
  const fix = parts.length === 2 && TYPOS[parts[1].toLowerCase()];
  return fix ? `Did you mean ${parts[0]}@${fix}?` : '';
}

// ---- showing the result next to the field ----
function showState(id, err, hint = '') {
  const field = document.querySelector(`[data-field="${id}"]`);
  const input = $(id), msg = $(id + '-err');
  const hasValue = id === 'terms' ? input.checked : input.value.trim() !== '';
  field.classList.toggle('invalid', !!err);
  field.classList.toggle('valid', !err && hasValue);
  msg.textContent = err || hint;
  msg.classList.toggle('hint', !err && !!hint);
  input.setAttribute('aria-invalid', err ? 'true' : 'false');
}
function validate(id) {
  const err = validators[id]();
  showState(id, err, id === 'email' && !err ? emailHint() : '');
  return err;
}

// ---- live UI: password rules, strength meter, progress ----
function updatePassword() {
  const pw = $('password').value, c = checks(pw), s = strength(pw);
  document.querySelectorAll('#rules li').forEach(li => li.classList.toggle('ok', c[li.dataset.rule]));
  document.querySelector('.meter').dataset.level = s;
  $('strength').textContent = 'Strength: ' + (pw ? LABELS[s] : 'enter a password');
}
function updateProgress() {
  const done = FIELDS.filter(id => !validators[id]()).length;
  $('progBar').style.width = (done / FIELDS.length) * 100 + '%';
  $('progText').textContent = `${done} of ${FIELDS.length} steps complete`;
  if (done === FIELDS.length) $('summary').textContent = '';
}

// ---- events: validate on blur, then live while typing ----
FIELDS.forEach(id => {
  const el = $(id);
  el.addEventListener(id === 'terms' ? 'change' : 'input', () => {
    if (id === 'password') {
      updatePassword();
      if (touched.has('confirm')) validate('confirm');
    }
    if (id === 'terms') touched.add(id);
    if (touched.has(id)) validate(id);
    updateProgress();
  });
  el.addEventListener('blur', () => { touched.add(id); validate(id); });
});

// Show / hide password
document.querySelectorAll('.eye').forEach(btn => btn.addEventListener('click', () => {
  const input = $(btn.dataset.for), show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.textContent = show ? 'Hide' : 'Show';
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  btn.setAttribute('aria-pressed', show);
}));

// ---- submit: blocked until every field is valid ----
$('form').addEventListener('submit', e => {
  e.preventDefault();
  FIELDS.forEach(id => touched.add(id));
  const invalid = FIELDS.filter(id => validate(id));
  if (invalid.length) {
    $('summary').textContent = `Please fix ${invalid.length} ${invalid.length === 1 ? 'field' : 'fields'} before continuing.`;
    $(invalid[0]).focus();
    return;
  }
  $('summary').textContent = '';
  const btn = $('submit');
  btn.disabled = true;
  btn.textContent = 'Creating account…';
  setTimeout(() => {               // simulated request: nothing is sent or stored
    const first = $('name').value.trim().split(/\s+/)[0];
    $('welcome').textContent = `Welcome, ${first}!`;
    $('formWrap').hidden = true;
    $('success').hidden = false;
    $('success').focus();
  }, 900);
});

$('another').addEventListener('click', () => {
  $('form').reset();
  touched.clear();
  FIELDS.forEach(id => showState(id, ''));
  document.querySelectorAll('.field').forEach(f => f.classList.remove('valid', 'invalid'));
  $('submit').disabled = false;
  $('submit').textContent = 'Create account';
  $('success').hidden = true;
  $('formWrap').hidden = false;
  updatePassword();
  updateProgress();
  $('name').focus();
});

// ---- theme ----
const tb = $('theme');
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  tb.textContent = t === 'dark' ? '☀' : '☾';
  tb.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
tb.addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(t); store.set('sprout-theme', t);
});
applyTheme(store.get('sprout-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

updatePassword();
updateProgress();
