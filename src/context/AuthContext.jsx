import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { db } from '../data/db.js';
import { useDbState } from '../data/useDb.js';
import { hashPassword, randomCode, randomHex } from '../utils/crypto.js';
import { createOrganization, createUser, isValidEmail, ROLES, validatePassword } from '../models/index.js';
import { applicationStatus, approveIfDue, findOrganization } from '../services/orgService.js';

const SESSION_KEY = 'yw_session';
const PENDING_KEY = 'yw_pending_2fa';
const RESET_KEY = 'yw_password_reset';
const TRUST_KEY = 'yw_trusted_devices';

const REMEMBER_MS = 30 * 24 * 3600 * 1000; // "Keep me signed in"
const SESSION_MS = 12 * 3600 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;
const TRUST_MS = 30 * 24 * 3600 * 1000; // "Trust this device for 30 days"
const MAX_ATTEMPTS = 5;

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

function readSession() {
  const s = safeParse(localStorage.getItem(SESSION_KEY)) || safeParse(sessionStorage.getItem(SESSION_KEY));
  if (!s || !s.userId || typeof s.expiresAt !== 'number' || s.expiresAt < Date.now()) {
    clearStoredSession();
    return null;
  }
  return s;
}

function readTrusted() {
  return safeParse(localStorage.getItem(TRUST_KEY)) || {};
}

function isDeviceTrusted(userId) {
  const t = readTrusted();
  return typeof t[userId] === 'number' && t[userId] > Date.now();
}

function trustDevice(userId) {
  const t = readTrusted();
  t[userId] = Date.now() + TRUST_MS;
  localStorage.setItem(TRUST_KEY, JSON.stringify(t));
}

function readPending() {
  return safeParse(sessionStorage.getItem(PENDING_KEY));
}

/** Where each account type lands: organizations -> dashboard, attendees -> home page. */
export function homeFor(user) {
  return user && user.role === ROLES.ORG ? '/org' : '/';
}

/** After sign-in: organizations always end up in their dashboard. */
export function destinationAfterLogin(user, from) {
  if (user && user.role === ROLES.ORG) return from && from.startsWith('/org') ? from : '/org';
  return from && !from.startsWith('/org') ? from : '/';
}

export function maskEmail(email = '') {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name[0]}${'•'.repeat(Math.max(2, Math.min(6, name.length - 1)))}@${domain}`;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dbState = useDbState();
  const [session, setSession] = useState(readSession);
  const [pending, setPending] = useState(readPending);

  const user = useMemo(
    () => (session ? dbState.users.find((u) => u.id === session.userId) || null : null),
    [session, dbState.users],
  );
  const organization = useMemo(
    () => (user && user.orgId ? dbState.organizations.find((o) => o.id === user.orgId) || null : null),
    [user, dbState.organizations],
  );

  const beginSession = useCallback((userId, remember) => {
    const s = { userId, remember: Boolean(remember), expiresAt: Date.now() + (remember ? REMEMBER_MS : SESSION_MS) };
    clearStoredSession();
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const savePending = useCallback((p) => {
    if (p) sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
    else sessionStorage.removeItem(PENDING_KEY);
    setPending(p);
  }, []);

  /** Creates a fresh 6-digit code. demoCode exists only because there is no email server. */
  const issueCode = useCallback(
    (base) => {
      const code = randomCode();
      const salt = randomHex(8);
      const p = {
        ...base,
        codeSalt: salt,
        codeHash: hashPassword(code, salt),
        demoCode: code,
        attempts: 0,
        sentAt: Date.now(),
        expiresAt: Date.now() + CODE_TTL_MS,
      };
      savePending(p);
      return p;
    },
    [savePending],
  );

  /**
   * Step 1 of sign-in. Attendees use their email; organizations use their
   * OrganizationID (their admin email also works). Organizations whose
   * application is still under review cannot sign in yet.
   */
  const startLogin = useCallback(
    ({ email, password, remember, expectRole = null }) => {
      const identifier = String(email || '').trim();
      let found = null;

      if (expectRole === ROLES.ORG) {
        if (!identifier) throw new Error('Enter your OrganizationID.');
        const org = findOrganization(identifier);
        found = org ? db.findById('users', org.ownerId) : null;
        if (!found || hashPassword(password, found.salt) !== found.passwordHash) {
          throw new Error('Incorrect OrganizationID or password.');
        }
      } else {
        const normalized = identifier.toLowerCase();
        if (!isValidEmail(normalized)) throw new Error('Enter a valid email address.');
        found = db.findOne('users', (u) => u.email === normalized);
        if (!found || hashPassword(password, found.salt) !== found.passwordHash) {
          throw new Error('Incorrect email or password.');
        }
      }

      if (found.role === ROLES.ORG) {
        const org = approveIfDue(found.orgId);
        if (applicationStatus(org) === 'pending') {
          throw new Error('Your application is still under review. We will email your OrganizationID once it is approved.');
        }
      }

      if (isDeviceTrusted(found.id)) {
        savePending(null);
        beginSession(found.id, remember);
        return { status: 'signed_in', user: found };
      }
      issueCode({ userId: found.id, email: found.email, role: found.role, remember: Boolean(remember) });
      return { status: '2fa' };
    },
    [beginSession, issueCode, savePending],
  );

  const resendCode = useCallback(() => {
    const p = readPending();
    if (!p) throw new Error('Your sign-in session expired. Please sign in again.');
    return issueCode({ userId: p.userId, email: p.email, role: p.role, remember: p.remember });
  }, [issueCode]);

  const cancelPending = useCallback(() => savePending(null), [savePending]);

  const verifyCode = useCallback(
    (code, trust) => {
      const p = readPending();
      if (!p) {
        const err = new Error('Your sign-in session expired. Please sign in again.');
        err.fatal = true;
        throw err;
      }
      if (!/^\d{6}$/.test(code)) throw new Error('Enter all 6 digits.');
      if (p.expiresAt < Date.now()) throw new Error('This code has expired. Click "Resend code" to get a new one.');
      if (hashPassword(code, p.codeSalt) !== p.codeHash) {
        const attempts = p.attempts + 1;
        if (attempts >= MAX_ATTEMPTS) {
          savePending(null);
          const err = new Error('Too many incorrect attempts. Please sign in again.');
          err.fatal = true;
          throw err;
        }
        savePending({ ...p, attempts });
        const left = MAX_ATTEMPTS - attempts;
        throw new Error(`Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`);
      }
      if (trust) trustDevice(p.userId);
      savePending(null);
      beginSession(p.userId, p.remember);
      return db.findById('users', p.userId);
    },
    [beginSession, savePending],
  );

  const register = useCallback(
    ({ name, email, password, role, orgName }) => {
      const normalized = String(email || '').trim().toLowerCase();
      if (!String(name || '').trim()) throw new Error('Enter your name.');
      if (!isValidEmail(normalized)) throw new Error('Enter a valid email address.');
      const passwordError = validatePassword(password);
      if (passwordError) throw new Error(passwordError);
      if (role === ROLES.ORG && String(orgName || '').trim().length < 2) throw new Error('Enter your organization name.');
      if (db.findOne('users', (u) => u.email === normalized)) throw new Error('An account with this email already exists.');

      let newUser = createUser({ name, email: normalized, password, role });
      db.transaction((draft) => {
        if (role === ROLES.ORG) {
          const org = createOrganization({ name: orgName, ownerId: newUser.id, contactEmail: normalized });
          newUser = { ...newUser, orgId: org.id };
          draft.organizations.push(org);
        }
        draft.users.push(newUser);
      });
      beginSession(newUser.id, false);
      return newUser;
    },
    [beginSession],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    savePending(null);
    setSession(null);
  }, [savePending]);

  /* ---------------------------- password reset --------------------------- */

  /** identifier = email, or an OrganizationID (the code then goes to the organization's admin email). */
  const requestPasswordReset = useCallback((identifier) => {
    const value = String(identifier || '').trim();
    let found = null;
    if (value.includes('@')) {
      const normalized = value.toLowerCase();
      if (!isValidEmail(normalized)) throw new Error('Enter a valid email address.');
      found = db.findOne('users', (u) => u.email === normalized);
    } else {
      if (!value) throw new Error('Enter your OrganizationID or admin email.');
      const org = findOrganization(value);
      found = org ? db.findById('users', org.ownerId) : null;
    }
    if (!found) {
      sessionStorage.removeItem(RESET_KEY);
      return { demoCode: null, email: null };
    }
    const code = randomCode();
    const salt = randomHex(8);
    sessionStorage.setItem(
      RESET_KEY,
      JSON.stringify({ userId: found.id, codeSalt: salt, codeHash: hashPassword(code, salt), expiresAt: Date.now() + CODE_TTL_MS }),
    );
    return { demoCode: code, email: found.email };
  }, []);

  const resetPassword = useCallback((code, newPassword) => {
    const r = safeParse(sessionStorage.getItem(RESET_KEY));
    if (!r || r.expiresAt < Date.now()) throw new Error('This reset code has expired. Request a new one.');
    if (hashPassword(String(code).trim(), r.codeSalt) !== r.codeHash) throw new Error('Incorrect code.');
    const passwordError = validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError);
    const salt = randomHex(16);
    db.update('users', r.userId, { salt, passwordHash: hashPassword(newPassword, salt) });
    sessionStorage.removeItem(RESET_KEY);
  }, []);

  const changePassword = useCallback(
    (currentPassword, newPassword) => {
      if (!user) throw new Error('You are signed out.');
      if (hashPassword(currentPassword, user.salt) !== user.passwordHash) throw new Error('Current password is incorrect.');
      const passwordError = validatePassword(newPassword);
      if (passwordError) throw new Error(passwordError);
      const salt = randomHex(16);
      db.update('users', user.id, { salt, passwordHash: hashPassword(newPassword, salt) });
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      organization,
      pending,
      startLogin,
      verifyCode,
      resendCode,
      cancelPending,
      register,
      logout,
      requestPasswordReset,
      resetPassword,
      changePassword,
    }),
    [user, organization, pending, startLogin, verifyCode, resendCode, cancelPending, register, logout, requestPasswordReset, resetPassword, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}