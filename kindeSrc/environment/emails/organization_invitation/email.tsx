import React from "react";
import { greeting, plain, safeUrl, senderName, toSubject } from "../_shared/copy";
import {
  Button,
  EmailLayout,
  Muted,
  Paragraphs,
  plainText,
  renderEmail,
  resolveEvent,
  type EmailVariant,
  themeFor,
} from "../_shared/layout";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../_shared/types";

// Sent when someone is invited to join an organization. The link signs the
// invitee up and adds them to the organization.
//
// Kinde has no editable copy for this email, so all of the wording is here.

export const emailSettings: KindeEmailSettings = {
  bindings: {},
};

export default async function OrganizationInvitationEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
  variant?: EmailVariant,
): Promise<KindeEmailRenderResult> {
  const event = resolveEvent(input);
  const link = safeUrl(event.request.email.link);
  if (!link) {
    // Throwing makes Kinde send its built-in invitation instead.
    throw new Error("organization_invitation email has no valid link");
  }

  const theme = themeFor(event);
  const organization = senderName(event);
  const subject = toSubject(`You’re invited to join ${organization}`);
  const heading = `Join ${organization}`;
  const body = `${greeting(event)}\nYou’ve been invited to join ${organization}. Accept the invitation to set up your account and get started.`;
  const disclaimer = "If you weren’t expecting this invitation, you can ignore this email.";

  const html = renderEmail(
    <EmailLayout
      event={event}
      subject={subject}
      preview={`Accept your invitation to join ${organization}`}
      heading={heading}
      footer={<Muted>{disclaimer}</Muted>}
      variant={variant}
    >
      <Paragraphs copy={body} />
      <Button href={link} label="Accept invitation" theme={theme} />
      <Muted>
        Or copy and paste this link into your browser:
        <br />
        <a href={link} target="_blank" rel="noopener" style={{ color: theme.link, wordBreak: "break-all" }}>
          {link}
        </a>
      </Muted>
    </EmailLayout>,
  );

  const text = plainText([
    heading,
    body,
    `Accept the invitation:\n${link}`,
    disclaimer,
    `— ${plain(organization)}`,
  ]);

  return { subject, html, text };
}
