/*
 * utils.js — small helper functions used by many components.
 * They only calculate or format values: no React, no state, no data.
 */
import { categoryThemes } from "./Data";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekDaysLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ---------------------------- dates ---------------------------- */

/* "2026-11-22" -> Date (local time, no timezone shift) */
export function toDate(isoDate) {
  if (!isoDate) return null;
  const parts = isoDate.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

/* Date -> "2026-11-22" */
export function toIsoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

export function todayIso() {
  return toIsoDate(new Date());
}

/* Date of today + days, as "2026-11-22" */
export function isoDaysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/* "2026-11-22" + "20:00" -> Date */
export function combineDateTime(isoDate, time) {
  const date = toDate(isoDate);
  if (!date) return null;
  const parts = (time || "00:00").split(":").map(Number);
  date.setHours(parts[0] || 0, parts[1] || 0, 0, 0);
  return date;
}

/* ---------------------------- formatting ---------------------------- */

export function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

export function formatTND(value) {
  return formatNumber(value) + " TND";
}

export function formatPrice(price) {
  return Number(price) === 0 ? "Free" : formatTND(price);
}

/* "20:00" -> "8:00 PM" */
export function formatTime(time) {
  if (!time) return "";
  const parts = time.split(":").map(Number);
  const suffix = parts[0] >= 12 ? "PM" : "AM";
  const hour = parts[0] % 12 === 0 ? 12 : parts[0] % 12;
  return hour + ":" + String(parts[1]).padStart(2, "0") + " " + suffix;
}

/* "2026-11-22" -> "Sat, 22 Nov" (or "Sat, 22 Nov 2026") */
export function formatShortDate(isoDate, withYear) {
  const date = toDate(isoDate);
  if (!date) return "";
  let text = weekDays[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()];
  if (withYear) text = text + " " + date.getFullYear();
  return text;
}

/* "2026-11-22" -> "Saturday, 22 November 2026" */
export function formatLongDate(isoDate) {
  const date = toDate(isoDate);
  if (!date) return "";
  return (
    weekDaysLong[date.getDay()] + ", " + date.getDate() + " " + monthsLong[date.getMonth()] + " " + date.getFullYear()
  );
}

/* Date -> "21 Oct" */
export function formatDayMonth(date) {
  return date.getDate() + " " + months[date.getMonth()];
}

export function monthName(index, long) {
  return long ? monthsLong[index] : months[index];
}

/* "in 3 days", "in 4h", "Tomorrow", "Happening now" */
export function formatCountdown(target) {
  if (!target) return "";
  const minutes = Math.floor((target.getTime() - Date.now()) / 60000);
  if (minutes <= 0) return "Happening now";
  if (minutes < 60) return "in " + minutes + " min";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return "in " + hours + "h";
  const days = Math.floor(hours / 24);
  if (days === 1) return "Tomorrow";
  return "in " + days + " days";
}

/* "2026-11-20" -> "4 days ago" */
export function timeAgo(isoDate) {
  const date = toDate(isoDate);
  if (!date) return "";
  const days = Math.round((toDate(todayIso()) - date) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return days + " days ago";
  if (days < 30) return Math.floor(days / 7) === 1 ? "1 week ago" : Math.floor(days / 7) + " weeks ago";
  if (days < 365) return Math.floor(days / 30) <= 1 ? "1 month ago" : Math.floor(days / 30) + " months ago";
  return Math.floor(days / 365) === 1 ? "1 year ago" : Math.floor(days / 365) + " years ago";
}

/* "Sarra Ben Ali" -> "SB" */
export function initials(name) {
  const words = (name || "")
    .replace(/[^A-Za-zÀ-ÿ\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function percentChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/* "sarra@example.com" -> "s•••••@example.com" */
export function maskEmail(email) {
  const parts = (email || "").split("@");
  if (parts.length !== 2) return email;
  return parts[0][0] + "•••••@" + parts[1];
}

/* ---------------------------- validation ---------------------------- */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
}

/* Returns an error message, or "" when the password is fine. */
export function passwordError(password) {
  if (!password || password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Use both letters and numbers.";
  return "";
}

/* ---------------------------- ids ---------------------------- */

/* makeId("evt") -> "evt-lq3k2a9f" (a database will create ids itself later) */
export function makeId(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

/* Random ticket number like "YW-4807" */
export function makeTicketNumber() {
  return "YW-" + (1000 + Math.floor(Math.random() * 9000));
}

/* Random 6-digit code for the (demo) emails */
export function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ---------------------------- users ---------------------------- */

export function fullName(user) {
  if (!user) return "";
  return (user.firstName + " " + (user.lastName || "")).trim();
}

/* "Sarra Ben Ali" -> "Sarra B." (name shown on reviews) */
export function shortName(user) {
  if (!user) return "";
  return user.lastName ? user.firstName + " " + user.lastName[0] + "." : user.firstName;
}

/* ---------------------------- events ---------------------------- */

export function eventCapacity(event) {
  return event.tiers.reduce((sum, tier) => sum + (Number(tier.quantity) || 0), 0);
}

export function eventSold(event) {
  return event.tiers.reduce((sum, tier) => sum + (Number(tier.sold) || 0), 0);
}

export function spotsLeft(event) {
  return eventCapacity(event) - eventSold(event);
}

export function eventRevenue(event) {
  return event.tiers.reduce((sum, tier) => sum + (Number(tier.price) || 0) * (Number(tier.sold) || 0), 0);
}

export function minPrice(event) {
  if (event.tiers.length === 0) return 0;
  return Math.min(...event.tiers.map((tier) => Number(tier.price) || 0));
}

export function isFreeEvent(event) {
  return event.tiers.every((tier) => Number(tier.price) === 0);
}

export function eventStart(event) {
  return combineDateTime(event.date, event.startTime);
}

/* End date and time (an event ending at 04:00 finishes the next day). */
export function eventEnd(event) {
  const start = eventStart(event);
  const end = combineDateTime(event.date, event.endTime || event.startTime);
  if (!start || !end) return null;
  if (end <= start) end.setDate(end.getDate() + 1);
  return end;
}

/* "draft" | "ended" | "sold_out" | "almost_full" | "on_sale" */
export function eventStatus(event) {
  if (event.status === "draft") return "draft";
  const end = eventEnd(event);
  if (end && end < new Date()) return "ended";
  const capacity = eventCapacity(event);
  const left = capacity - eventSold(event);
  if (capacity > 0 && left <= 0) return "sold_out";
  if (capacity > 0 && left <= Math.max(3, Math.ceil(capacity * 0.05))) return "almost_full";
  return "on_sale";
}

export const statusLabels = {
  draft: "Draft",
  ended: "Ended",
  sold_out: "Sold out",
  almost_full: "Almost full",
  on_sale: "On sale",
};

/* Published and not finished yet */
export function isUpcoming(event) {
  const status = eventStatus(event);
  return status !== "draft" && status !== "ended";
}

export function isPast(event) {
  return eventStatus(event) === "ended";
}

/* "Foll'Amour, Gammarth" -> "Gammarth" */
export function cityOf(venue) {
  const parts = (venue || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

/* Name of the organization or user who hosts the event. */
export function hostName(event, organizations, users) {
  if (event.orgId) {
    const org = organizations.find((o) => o.id === event.orgId);
    return org ? org.name : "Organization";
  }
  const user = users.find((u) => u.id === event.hostUserId);
  return user ? fullName(user) : "YallaWin member";
}

/* All events of the same host (organization or user). */
export function sameHost(a, b) {
  if (a.orgId) return a.orgId === b.orgId;
  return Boolean(a.hostUserId) && a.hostUserId === b.hostUserId;
}

/* Google Maps link for the "Directions" buttons. */
export function directionsUrl(event) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(event.venue + ", " + event.address);
}

/* Average of a list of reviews (0 when empty). */
export function averageRating(reviewList) {
  if (reviewList.length === 0) return 0;
  return reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length;
}

/* ---------------------------- covers ---------------------------- */

export function themeFor(category) {
  return categoryThemes[category] || categoryThemes.Workshop;
}

/* Draws a colourful SVG cover (as an image URL) from the category and the title. */
export function generateCover(category, title) {
  const theme = themeFor(category);
  let hash = 0;
  const text = category + title;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  const x1 = 150 + (hash % 600);
  const y1 = 120 + (hash % 500);
  const x2 = 100 + ((hash * 7) % 700);
  const y2 = 300 + ((hash * 3) % 500);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' +
    theme.from +
    '"/><stop offset="1" stop-color="' +
    theme.to +
    '"/></linearGradient>' +
    '<radialGradient id="r"><stop offset="0" stop-color="' +
    theme.accent +
    '" stop-opacity="0.55"/>' +
    '<stop offset="1" stop-color="' +
    theme.accent +
    '" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="1000" height="1000" fill="url(#g)"/>' +
    '<circle cx="' +
    x1 +
    '" cy="' +
    y1 +
    '" r="360" fill="url(#r)"/>' +
    '<circle cx="' +
    x2 +
    '" cy="' +
    y2 +
    '" r="260" fill="url(#r)"/>' +
    '<text x="500" y="590" font-size="360" text-anchor="middle">' +
    theme.emoji +
    "</text></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* The picture of an event: its own image, or a generated cover. */
export function eventImage(event) {
  return event.image || generateCover(event.category, event.title);
}

/* Style for a box that shows the event picture as its background. */
export function coverStyle(event) {
  return { backgroundImage: 'url("' + eventImage(event) + '")' };
}

/* ---------------------------- files ---------------------------- */

/* Reads an image file, makes it smaller (max 1000px) and gives it back as a text URL. */
export function readImage(file, onDone, onError) {
  if (!file) return;
  if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
    onError("Use a JPG, PNG or WebP image.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    onError("Image is too large (max 10 MB).");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      onDone(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => onError("This image could not be opened.");
    img.src = reader.result;
  };
  reader.onerror = () => onError("Could not read this file.");
  reader.readAsDataURL(file);
}

export function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

/* ---------------------------- charts ---------------------------- */

/*
 * Tickets sold per day for the last "days" days (oldest first): [{ date, value }].
 * offset moves the window back (days=30, offset=30 -> the 30 days before).
 */
export function dailyTotals(ticketList, days, offset) {
  const totals = {};
  ticketList.forEach((ticket) => {
    totals[ticket.date] = (totals[ticket.date] || 0) + ticket.qty;
  });
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i - (offset || 0));
    series.push({ date: date, value: totals[toIsoDate(date)] || 0 });
  }
  return series;
}

export function sumValues(series) {
  return series.reduce((sum, day) => sum + day.value, 0);
}
