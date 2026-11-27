import { codeEmailValues, renderCodeEmail } from "../_shared/codeEmail";
import { greeting, translate } from "../_shared/copy";
import { resolveEvent, type EmailVariant } from "../_shared/layout";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../_shared/types";

// Sent with the one-time code a user enters to reset their password.
//
// Kinde's editable copy is written for email verification, so only its
// disclaimer is used here; the rest of the wording is specific to a reset.

export const emailSettings: KindeEmailSettings = {
  bindings: {},
};

export default async function PasswordResetEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
  variant?: EmailVariant,
): Promise<KindeEmailRenderResult> {
  const event = resolveEvent(input);
  const values = codeEmailValues(event);
  const { business, code, expiresIn } = values;

  return renderCodeEmail(event, values, {
    subject: `Reset your ${business} password`,
    preview: `Use this code to reset your ${business} password`,
    heading: "Reset your password",
    body: `${greeting(event)}\nUse the code below to reset the password for your ${business} account. This code expires in ${expiresIn}.`,
    note: "If you didn't ask to reset your password, you can ignore this email. Your password won't change.",
    disclaimer: translate(
      event,
      "email_disclaimer",
      `You received this email because a password reset was requested for ${business}`,
      { business_name: business, code, expiration_duration: expiresIn },
    ),
  }, variant);
}
