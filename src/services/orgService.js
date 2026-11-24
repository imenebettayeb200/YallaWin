/**
 * orgService.js — everything about organization accounts:
 * validating the "Apply to get verified" form, creating the application,
 * generating the OrganizationID and the (simulated) review by the trust team.
 */
import { db } from '../data/db.js';
import { DEMO_REVIEW_SECONDS, MAX_DOCUMENT_MB, ORG_DOCUMENTS, ORG_TYPES, PERMIT_EVENT_TYPES } from '../data/data.js';
import { createUser, isValidEmail, ROLES, validatePassword } from '../models/index.js';
import { uid } from '../utils/ids.js';

/* ------------------------------ validation ------------------------------ */

/** Step 1. Returns { field: message } (empty object = valid). */
export function validateOrgInfo(info) {
  const errors = {};
  if (info.name.trim().length < 2) errors.name = 'Enter your organization name.';
  if (info.city.trim().length < 2) errors.city = 'Enter your city.';
  if (!ORG_TYPES.some((t) => t.key === info.type)) errors.type = 'Choose your organization type.';
  if (info.website.trim().length < 4) errors.website = 'Add your website or Instagram.';
  if (!isValidEmail(info.adminEmail)) errors.adminEmail = 'Enter a valid email address.';
  else if (db.findOne('users', (u) => u.email === info.adminEmail.trim().toLowerCase())) {
    errors.adminEmail = 'An account already uses this email.';
  }
  if (info.eventTypes.length === 0) errors.eventTypes = 'Pick at least one kind of event.';
  const pw = validatePassword(info.password);
  if (pw) errors.password = pw;
  if (info.confirm !== info.password) errors.confirm = 'Passwords do not match.';
  return errors;
}

/** Is this document needed for an organization hosting these event types? */
export function isDocumentRequired(doc, eventTypes) {
  if (doc.required === 'permit') return eventTypes.some((t) => PERMIT_EVENT_TYPES.includes(t));
  return doc.required === true;
}

/** Step 2. Returns { documentKey: message }. */
export function validateDocuments(documents, eventTypes) {
  const errors = {};
  ORG_DOCUMENTS.forEach((doc) => {
    if (isDocumentRequired(doc, eventTypes) && !documents[doc.key]) errors[doc.key] = 'This document is required.';
  });
  return errors;
}

/** Checks one selected file. Returns an error message or ''. */
export function checkDocumentFile(file, doc) {
  if (!file) return 'No file selected.';
  if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) return `File is too large (max ${MAX_DOCUMENT_MB} MB).`;
  const okTypes = doc.accept.includes('.pdf') ? /^(application\/pdf|image\/(png|jpe?g))$/ : /^image\/(png|jpe?g)$/;
  if (!okTypes.test(file.type)) return doc.accept.includes('.pdf') ? 'Use a PDF, JPG or PNG file.' : 'Use a JPG or PNG image.';
  return '';
}

/* --------------------------- OrganizationID ---------------------------- */

/** "Foll'Amour" -> "ORG-FOLLAMOUR-2041" (unique). */
export function generateOrganizationId(name) {
  const slug =
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 12) || 'TEAM';
  let id;
  do {
    id = `ORG-${slug}-${1000 + Math.floor(Math.random() * 9000)}`;
  } while (db.findOne('organizations', (o) => o.organizationId === id));
  return id;
}

/** Finds an organization by OrganizationID or admin email. */
export function findOrganization(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;
  if (value.includes('@')) {
    const user = db.findOne('users', (u) => u.email === value.toLowerCase() && u.role === ROLES.ORG);
    return user ? db.findById('organizations', user.orgId) : null;
  }
  return db.findOne('organizations', (o) => (o.organizationId || '').toUpperCase() === value.toUpperCase());
}

/* ------------------------------ application ----------------------------- */

/** Creates the admin user + the organization with status "pending". Does not sign in. */
export function submitApplication(info, documents) {
  const infoErrors = validateOrgInfo(info);
  if (Object.keys(infoErrors).length) throw new Error(Object.values(infoErrors)[0]);
  const docErrors = validateDocuments(documents, info.eventTypes);
  if (Object.keys(docErrors).length) throw new Error('Please upload all required documents.');

  const now = new Date();
  const orgDbId = uid('org');
  const admin = { ...createUser({ name: info.name, email: info.adminEmail, password: info.password, role: ROLES.ORG }), orgId: orgDbId };
  const organization = {
    id: orgDbId,
    organizationId: null, // issued when approved
    name: info.name.trim(),
    ownerId: admin.id,
    verified: false,
    type: info.type,
    city: info.city.trim(),
    website: info.website.trim(),
    eventTypes: info.eventTypes,
    bio: '',
    contactEmail: admin.email,
    payoutMethod: { holder: info.name.trim(), bank: '' },
    documents, // only file names and sizes are kept, never the files themselves
    verification: {
      status: 'pending',
      submittedAt: now.toISOString(),
      reviewDueAt: new Date(now.getTime() + DEMO_REVIEW_SECONDS * 1000).toISOString(),
      approvedAt: null,
    },
    createdAt: now.toISOString(),
  };

  db.transaction((draft) => {
    draft.users.push(admin);
    draft.organizations.push(organization);
  });
  return organization;
}

/**
 * Simulated trust-team review: once reviewDueAt has passed, the application is
 * approved, the organization is verified and its OrganizationID is issued.
 * Returns the (possibly updated) organization.
 */
export function approveIfDue(orgDbId, now = new Date()) {
  const org = db.findById('organizations', orgDbId);
  if (!org || !org.verification || org.verification.status !== 'pending') return org;
  if (new Date(org.verification.reviewDueAt) > now) return org;
  return db.update('organizations', org.id, {
    verified: true,
    organizationId: org.organizationId || generateOrganizationId(org.name),
    verification: { ...org.verification, status: 'approved', approvedAt: now.toISOString() },
  });
}

/** "pending" | "approved" (organizations created before this feature count as approved). */
export function applicationStatus(org) {
  return (org && org.verification && org.verification.status) || 'approved';
}