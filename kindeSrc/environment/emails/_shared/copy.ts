import type { KindeEmailEvent } from "./types";

// Plain-text helpers shared by every template. Nothing here produces HTML:
// the HTML body is built with React, which escapes every value it renders.

/** The repo palette (see kindeSrc/styles/styles.ts), used when branding has no value. */
export const palette = {
  primary: "#1E90FF", // dodgerblue
  primaryText: "#FFFFFF",
  link: "#1E90FF",
  text: "#2B2B2B",
  heading: "#0F0F0F",
  muted: "#636363",
  border: "#E9EDEC",
  canvas: "#F4F6F6",
  surface: "#FFFFFF",
  fontFamily:
    "-apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif",
  codeFontFamily:
    "SFMono-Regular, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace",
} as const;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * A branding colour goes into a style attribute, so only a hex value is
 * accepted: anything else could smuggle extra CSS declarations in.
 */
export const safeColor = (value: string | undefined, fallback: string): string => {
  const trimmed = (value ?? "").trim();
  return HEX_COLOR.test(trimmed) ? trimmed : fallback;
};

/** Only absolute http(s) URLs may become an href or an image source. */
export const safeUrl = (value: string | undefined): string | undefined => {
  const trimmed = (value ?? "").trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(trimmed) ? trimmed : undefined;
};

// C0 control characters other than tab and newline, plus DEL.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Normalizes line endings and strips control characters from plain text. */
export const plain = (value: string | undefined): string =>
  (value ?? "").replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "");

/**
 * A subject is a single header line: user-supplied values such as an
 * organization name must not be able to add line breaks to it.
 */
export const toSubject = (value: string): string =>
  plain(value).replace(/\s+/g, " ").trim().slice(0, 200);

/** Splits copy into paragraphs on line breaks, dropping empty lines. */
export const paragraphs = (value: string): string[] =>
  plain(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/** "5 minutes", "1 hour", "2 days". English only, like the fallback copy. */
export const formatDuration = (minutes: number | undefined): string | undefined => {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
    return undefined;
  }
  const unit = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
  if (minutes % 1440 === 0) return unit(minutes / 1440, "day");
  if (minutes % 60 === 0) return unit(minutes / 60, "hour");
  return unit(Math.round(minutes), "minute");
};

export type Placeholders = {
  business_name?: string;
  code?: string;
  expiration_duration?: string;
};

/**
 * Fills the `${business_name}`, `${code}` and `${expiration_duration}`
 * placeholders the Email content page offers. One pass, so a substituted value
 * (an organization called "${code}", say) is never scanned again. A
 * placeholder with no value keeps its literal text, as Kinde's built-in
 * emails do.
 */
export const fillPlaceholders = (text: string, values: Placeholders): string =>
  text.replace(/\$\{(business_name|code|expiration_duration)\}/g, (match, name: keyof Placeholders) =>
    values[name] ?? match,
  );

/**
 * Returns the editable copy for `key` when the event carries it, with
 * placeholders filled, otherwise the English fallback.
 */
export const translate = (
  event: KindeEmailEvent,
  key: string,
  fallback: string,
  values: Placeholders = {},
): string => {
  const value = event.request.email.translations?.[key];
  return typeof value === "string" && value.trim() !== ""
    ? fillPlaceholders(value, values)
    : fallback;
};

/**
 * The name the email speaks for: the organization when the email belongs to
 * one, else the business. Kinde already resolves this into
 * `branding.businessName`; the organization name is preferred defensively.
 */
export const senderName = (event: KindeEmailEvent): string =>
  plain(
    event.context.organization?.name?.trim() ||
      event.context.branding.businessName?.trim() ||
      event.request.email.sender.fromName?.trim() ||
      "our team",
  );

export const greeting = (event: KindeEmailEvent): string => {
  const firstName = plain(event.request.email.recipient?.firstName).trim();
  return firstName ? `Hi ${firstName},` : "Hi there,";
};
