import React from "react";
import { formatDuration, plain, senderName, toSubject } from "./copy";
import { CodeBlock, EmailLayout, Muted, Paragraphs, plainText, renderEmail, type EmailVariant } from "./layout";
import type { KindeEmailEvent, KindeEmailRenderResult } from "./types";

// The sign-up, password reset and MFA emails share one shape: a heading, some
// copy, the one-time code and a disclaimer. Each template supplies its own
// wording through `CodeEmailCopy`; this renders both bodies from it.

export type CodeEmailValues = {
  /** Organization name, or the business name when there is no organization. */
  business: string;
  code: string;
  /** "10 minutes", or "a short while" when the event has no expiry. */
  expiresIn: string;
};

export type CodeEmailCopy = {
  subject: string;
  preview?: string;
  heading: string;
  /** Shown above the code. Line breaks become paragraphs. */
  body: string;
  /** Shown below the code. */
  note?: string;
  disclaimer?: string;
};

export const codeEmailValues = (event: KindeEmailEvent): CodeEmailValues => {
  const code = plain(event.request.email.code).trim();
  if (!code) {
    // Throwing makes Kinde send its built-in email instead, which is better
    // than sending a code email without a code.
    throw new Error(`${event.request.email.key} email has no code`);
  }
  return {
    business: senderName(event),
    code,
    expiresIn: formatDuration(event.request.email.expiresInMinutes) ?? "a short while",
  };
};

/** Adds a full stop to copy that does not end in punctuation. */
const sentence = (value: string): string => {
  const trimmed = value.trim();
  return /[.!?。]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

export const renderCodeEmail = (
  event: KindeEmailEvent,
  values: CodeEmailValues,
  copy: CodeEmailCopy,
  variant?: EmailVariant,
): KindeEmailRenderResult => {
  const subject = toSubject(copy.subject);
  const disclaimer = copy.disclaimer ? sentence(copy.disclaimer) : undefined;

  const html = renderEmail(
    <EmailLayout
      event={event}
      subject={subject}
      preview={copy.preview}
      heading={copy.heading}
      footer={disclaimer ? <Muted>{disclaimer}</Muted> : undefined}
      variant={variant}
    >
      <Paragraphs copy={copy.body} />
      <CodeBlock code={values.code} />
      {copy.note ? <Paragraphs copy={copy.note} /> : null}
    </EmailLayout>,
  );

  const text = plainText([
    copy.heading,
    copy.body,
    values.code,
    copy.note,
    disclaimer,
    `— ${values.business}`,
  ]);

  return { subject, html, text };
};
