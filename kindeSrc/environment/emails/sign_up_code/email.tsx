import { codeEmailValues, renderCodeEmail } from "../_shared/codeEmail";
import { greeting, translate } from "../_shared/copy";
import { resolveEvent, type EmailVariant } from "../_shared/layout";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../_shared/types";

// Sent with the one-time code that confirms an email address at sign-up and
// at passwordless sign-in.
//
// This template reads the editable copy from Kinde's Email content page, so
// changes made there still apply. The English below is used only when the
// event carries no copy.

export const emailSettings: KindeEmailSettings = {
  bindings: {},
};

export default async function SignUpCodeEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
  variant?: EmailVariant,
): Promise<KindeEmailRenderResult> {
  const event = resolveEvent(input);
  const values = codeEmailValues(event);
  const { business, code, expiresIn } = values;
  const placeholders = { business_name: business, code, expiration_duration: expiresIn };

  return renderCodeEmail(event, values, {
    subject: translate(event, "email_subject", `Your ${business} verification code`, placeholders),
    preview: translate(
      event,
      "email_preview",
      `Use this code to confirm your email address and continue to ${business}`,
      placeholders,
    ),
    heading: "Confirm your email address",
    body: translate(
      event,
      "email_body",
      `${greeting(event)}\nUse the code below to confirm your email address and continue to ${business}. This code expires in ${expiresIn}. If you don't think you should be receiving this email, you can safely ignore it.`,
      placeholders,
    ),
    disclaimer: translate(
      event,
      "email_disclaimer",
      `You received this email because a confirmation code was requested for ${business}`,
      placeholders,
    ),
  }, variant);
}
